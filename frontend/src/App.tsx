import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  LoaderCircle,
  LogOut,
} from "lucide-react";
import heroImage from "./assets/landing-hero.png";
import { EyesIcon } from "./assets/svg/eyes";
import { FlowerIcon } from "./assets/svg/flower";
import { GraphIcon } from "./assets/svg/graph";
import { HandsIcon } from "./assets/svg/hands";
import { PhoneIcon } from "./assets/svg/phone";
import { RobotIcon } from "./assets/svg/robot";
import { ScalesIcon } from "./assets/svg/scales";
import { SocketIcon } from "./assets/svg/socket";
import { StarIcon } from "./assets/svg/star";

type LoginFormState = {
  username: string;
  password: string;
};

type AdminUser = {
  username: string;
  role: string;
};

type AdminSession = {
  access_token: string;
  token_type: string;
  user: AdminUser;
};

type LeadRecord = {
  id: string;
  created_at: string;
  status: string;
  name: string;
  email: string;
  team_name: string;
  team_size: number;
  message: string;
};

const ADMIN_STORAGE_KEY = "potencore_admin_session";

const benefitCards = [
  {
    icon: EyesIcon,
    iconClass: "benefit-icon-green",
    title: "Видите неочевидное",
    text: "Система показывает скрытую перегрузку и стагнацию, которые незаметны в маленькой команде."
  },
  {
    icon: FlowerIcon,
    iconClass: "benefit-icon-green",
    title: "Помогаете расти плавно",
    text: "AI подсказывает, кому пора дать более сложную задачу, а кому - помочь коллеге."
  },
  {
    icon: StarIcon,
    iconClass: "benefit-icon-blue",
    title: "Предсказываете риски",
    text: "За 2-3 недели узнаёте, у кого может снизиться продуктивность."
  },
  {
    icon: ScalesIcon,
    iconClass: "benefit-icon-lavender",
    title: "Балансируете нагрузку",
    text: "Автоматические рекомендации, кому делегировать задачу, а кого разгрузить."
  },
  {
    icon: PhoneIcon,
    iconClass: "benefit-icon-lavender",
    title: "Ничего не заполняете",
    text: "Никаких опросов, тайм-трекеров и ежедневных отчётов."
  },
  {
    icon: HandsIcon,
    iconClass: "benefit-icon-blue",
    title: "Вся команда в курсе",
    text: "Каждый участник видит свой вклад, зоны роста и прогресс."
  }
];

const audienceCards = [
  {
    className: "audience-card-green",
    title: "Для тимлидов и руководителей проектов",
    text: "Получайте готовые подсказки и помогайте команде работать в потоке."
  },
  {
    className: "audience-card-blue",
    title: "Для участников команд",
    text: "Понимайте свой вклад, видите зоны роста и получайте рекомендации, как становиться лучше."
  },
  {
    className: "audience-card-lavender",
    title: "Для стартапов и небольших технологических компаний",
    text: "Прозрачность без бюрократии. Внедряете за 5 минут, начинаете помогать команде сразу."
  }
];

const integrations = [
  {
    icon: SocketIcon,
    iconClass: "integration-icon-green",
    title: "Быстрая интеграция за 5 минут",
    text: "Подключаете инструменты, в которых команда уже работает. Один раз - и система начинает помогать."
  },
  {
    icon: RobotIcon,
    iconClass: "integration-icon-blue",
    title: "AI анализирует и подсказывает",
    text: "В фоне, без вашего участия. Не нужно заполнять отчёты, ставить таймеры или отвечать на опросы."
  },
  {
    icon: GraphIcon,
    iconClass: "integration-icon-lavender",
    title: "Вы видите картину и принимаете решения",
    text: "Кто перегружен, у кого есть свободное время, кому пора дать задачу сложнее. И конкретные подсказки: что сделать прямо сейчас."
  },
];

const initialLoginForm: LoginFormState = {
  username: "admin",
  password: "admin"
};

function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (window.location.hostname === "localhost" && window.location.port === "5173") {
    return "http://localhost:8000/api/v1";
  }

  return "/api/v1";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ru-RU");
}

function LandingPage() {
  return (
    <div className="page-shell">
      <div className="background-grid" />
      <header className="container site-header">
        <a className="brand" href="#top" aria-label="PotenCore">
          <span className="brand-accent">Poten</span>Core
        </a>
        <nav className="site-nav">
          <a href="/admin">Войти</a>
        </nav>
      </header>

      <main id="top">
        <section className="container hero">
          <div className="hero-copy">
            <h2>
              PotenCore - помогаем технологическим командам
              <span className="text-accent flow-glow"> работать в потоке</span>
              <span> и расти вместе</span>
            </h2>
            <p className="hero-text">
              Автоматическая аналитика эффективности команды, прогноз узких мест и AI-подсказки. Система сама подключается к инструментам, которые вы уже используете, и подсвечивает то, что не видно невооружённым взглядом: скрытую перегрузку, незаметную стагнацию, точки, где команде нужна помощь. Никаких опросов и ручного ввода - просто работайте, а мы поможем.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">
                Попробовать пилотную версию
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="screen-card large-screen">
              <img src={heroImage} alt="PotenCore landing concept" />
            </div>
          </div>
        </section>

        <section className="container integration-section">
          <div className="integration-grid">
            {integrations.map(({ icon: Icon, iconClass, title, text }) => (
              <article className="integration-card" key={title}>
                <div className={`integration-icon ${iconClass}`}>
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="architecture" className="container architecture-section">
          <div className="architecture-banner">
            Команда тратит меньше времени на рутину и больше - на интересные задачи. А руководитель перестаёт гадать и получает готовые подсказки, как помочь команде стать сильнее.
          </div>
        </section>

        <section className="container features-section">
          <h2 className="features-heading">
            Что вы получаете, <span className="text-accent flow-glow">подключив PotenCore</span>
          </h2>
          <div className="features">
            {benefitCards.map(({ icon: Icon, iconClass, title, text }) => (
              <article className="feature-card" key={title}>
                <div className={`icon-chip ${iconClass}`}>
                  <Icon />
                </div>
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container audience-section">
          <div className="audience-grid">
            {audienceCards.map(({ className, title, text }) => (
              <article className={`audience-card ${className}`} key={title}>
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container pricing-section">
          <h2 className="pricing-title">Тарифы</h2>
          <div className="pricing-grid">
            <article className="pricing-card pricing-card-month">
              <h3>Month</h3>
              <div className="pricing-price">
                2 990 ₽<span>/мес</span>
              </div>
              <ul>
                <li>Все функции</li>
                <li>Поддержка</li>
              </ul>
              <a className="pricing-button pricing-button-outline" href="#contact">
                Выбрать месяц
              </a>
            </article>

            <article className="pricing-card pricing-card-year">
              <span className="pricing-badge">Выгода</span>
              <h3>Year</h3>
              <div className="pricing-price">
                29 900 ₽<span>/год</span>
              </div>
              <ul>
                <li>Всё то же самое</li>
                <li>Экономия 5 980 ₽</li>
              </ul>
              <a className="pricing-button pricing-button-filled" href="#contact">
                Выбрать год
              </a>
            </article>
          </div>
        </section>

        <section className="container pilot-section">
          <div className="pilot-banner">
            <h2>Попробуйте бесплатную пилотную версию уже сегодня</h2>
            <p>
              Подключите интеграции за 5 минут. PotenCore сразу покажет загрузку, риски и даст первые подсказки. Без опросов и ручного ввода.
            </p>
            <a className="pilot-button" href="#contact">
              Присоединиться
            </a>
          </div>
        </section>
        
      </main>

      <footer className="container site-footer">
        <p>PotenCore © 2026 | Политика конфиденциальности | Пользовательское соглашение</p>
      </footer>
    </div>
  );
}

function AdminPage({ apiBaseUrl }: { apiBaseUrl: string }) {
  const [session, setSession] = useState<AdminSession | null>(() => {
    const rawValue = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as AdminSession) : null;
  });
  const [loginForm, setLoginForm] = useState<LoginFormState>(initialLoginForm);
  const [loginState, setLoginState] = useState<"idle" | "sending" | "error">("idle");
  const [authChecked, setAuthChecked] = useState(false);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState("");

  useEffect(() => {
    async function validateExistingSession() {
      if (!session) {
        setAuthChecked(true);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error("invalid session");
        }
      } catch {
        window.localStorage.removeItem(ADMIN_STORAGE_KEY);
        setSession(null);
      } finally {
        setAuthChecked(true);
      }
    }

    void validateExistingSession();
  }, [apiBaseUrl, session]);

  useEffect(() => {
    async function loadLeads() {
      if (!session) {
        return;
      }

      setLeadsLoading(true);
      setLeadsError("");

      try {
        const response = await fetch(`${apiBaseUrl}/leads`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error("lead fetch failed");
        }

        const data = (await response.json()) as LeadRecord[];
        setLeads(data);
      } catch {
        setLeadsError("Не удалось загрузить лиды.");
      } finally {
        setLeadsLoading(false);
      }
    }

    void loadLeads();
  }, [apiBaseUrl, session]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginState("sending");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginForm)
      });

      if (!response.ok) {
        throw new Error("login failed");
      }

      const data = (await response.json()) as AdminSession;
      window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
      setSession(data);
      setLoginState("idle");
    } catch {
      setLoginState("error");
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(ADMIN_STORAGE_KEY);
    setSession(null);
  }

  if (!authChecked) {
    return (
      <div className="page-shell admin-shell">
        <div className="background-grid" />
        <div className="admin-loading">
          <LoaderCircle className="spin" size={20} />
          <span>Проверяю сессию администратора</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page-shell admin-shell">
        <div className="background-grid" />
        <main className="container admin-main">
          <section className="admin-auth-card">
            <span className="eyebrow">Временный доступ</span>
            <h1>Admin вход в PotenCore</h1>
            <p>
              Для MVP создана временная учетка. По умолчанию логин и пароль уже подставлены: <strong>admin / admin</strong>.
            </p>

            <form className="admin-form" onSubmit={handleLogin}>
              <label>
                Логин
                <input
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((state) => ({ ...state, username: event.target.value }))}
                  required
                />
              </label>
              <label>
                Пароль
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((state) => ({ ...state, password: event.target.value }))}
                  required
                />
              </label>
              <button className="button button-primary full-width" type="submit" disabled={loginState === "sending"}>
                {loginState === "sending" ? "Входим..." : "Войти в админку"}
              </button>
              {loginState === "error" && <p className="form-message error">Неверный логин или пароль.</p>}
            </form>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell admin-shell">
      <div className="background-grid" />
      <header className="container admin-header">
        <div>
          <a className="brand" href="/">
            <span className="brand-accent">Poten</span>Core
          </a>
          <p className="admin-subtitle">Админ-панель MVP</p>
        </div>
        <div className="admin-actions">
          <span className="admin-badge">{session.user.username}</span>
          <button className="button button-secondary" onClick={handleLogout} type="button">
            <LogOut size={16} />
            Выйти
          </button>
        </div>
      </header>

      <main className="container admin-main">
        <section className="admin-summary-grid">
          <article className="stat-card">
            <strong>{leads.length}</strong>
            <span>лидов сохранено</span>
          </article>
          <article className="stat-card">
            <strong>admin</strong>
            <span>временная учетка MVP</span>
          </article>
          <article className="stat-card">
            <strong>/api/v1/leads</strong>
            <span>readonly-доступ через bearer token</span>
          </article>
        </section>

        <section className="admin-leads-card">
          <div className="admin-leads-head">
            <div>
              <span className="eyebrow">Заявки</span>
              <h2>Список лидов</h2>
            </div>
            <button className="button button-secondary" onClick={() => window.location.reload()} type="button">
              Обновить
            </button>
          </div>

          {leadsLoading && (
            <div className="loading-row">
              <LoaderCircle className="spin" size={18} />
              <span>Загружаю лиды</span>
            </div>
          )}

          {leadsError && <p className="form-message error">{leadsError}</p>}

          {!leadsLoading && !leads.length && !leadsError && (
            <p className="admin-empty">Лидов пока нет. Как только кто-то отправит форму с лендинга, запись появится здесь.</p>
          )}

          <div className="lead-list">
            {leads.map((lead) => (
              <article className="lead-card" key={lead.id}>
                <div className="lead-card-head">
                  <div>
                    <h3>{lead.team_name}</h3>
                    <p>{lead.name}</p>
                  </div>
                  <span className="lead-status">{lead.status}</span>
                </div>
                <div className="lead-meta">
                  <span>{lead.email}</span>
                  <span>{lead.team_size} чел.</span>
                  <span>{formatDate(lead.created_at)}</span>
                </div>
                <p className="lead-message">{lead.message || "Без дополнительного комментария"}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return isAdminRoute ? <AdminPage apiBaseUrl={apiBaseUrl} /> : <LandingPage />;
}
