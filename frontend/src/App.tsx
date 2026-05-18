import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarRange,
  CheckCircle2,
  GitBranch,
  LoaderCircle,
  Lock,
  LogOut,
  MessageCircleMore,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow
} from "lucide-react";
import heroImage from "./assets/landing-hero.png";
import dashboardImage from "./assets/app-dashboard.png";
import forecastImage from "./assets/app-forecast.png";

type PlatformOverview = {
  product_stage: string;
  integrations: string[];
  ai_status: {
    enabled: boolean;
    mode: string;
    summary: string;
    planned_modules: string[];
  };
  roadmap: {
    current: string[];
    next: string[];
  };
};

type LeadFormState = {
  name: string;
  email: string;
  team_name: string;
  team_size: string;
  message: string;
};

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

const featureCards = [
  {
    icon: Radar,
    title: "Командный радар нагрузки",
    text: "Показывает перегрузку, свободный ресурс и дисбаланс раньше, чем это превращается в срыв."
  },
  {
    icon: Workflow,
    title: "Прозрачные сигналы без бюрократии",
    text: "Никаких опросников и ручных статусов. Только факты из Jira, Git, Telegram и календарей."
  },
  {
    icon: Sparkles,
    title: "AI-ready без AI-магии в MVP",
    text: "Первый релиз собирает данные, считает метрики и готовит слой под рекомендации, не обещая лишнего."
  }
];

const trustItems = [
  "Только метаданные и рабочие сигналы, без обучения на личной переписке.",
  "Отключаемые интеграции и возможность удалить историю по запросу.",
  "Подход под 152-ФЗ и размещение данных на инфраструктуре в РФ."
];

const integrations = [
  { icon: Workflow, title: "Jira", text: "Задачи, сроки, ответственные, статусы." },
  { icon: GitBranch, title: "GitHub / GitLab", text: "Коммиты, PR, ревью и скорость цикла." },
  { icon: MessageCircleMore, title: "Telegram Bot", text: "Метаданные активности, уведомления и сводки." },
  { icon: CalendarRange, title: "Calendar", text: "Встречи, занятость и конфликт загрузки." }
];

const initialLeadForm: LeadFormState = {
  name: "",
  email: "",
  team_name: "",
  team_size: "",
  message: ""
};

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

function LandingPage({ apiBaseUrl }: { apiBaseUrl: string }) {
  const [overview, setOverview] = useState<PlatformOverview | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [form, setForm] = useState<LeadFormState>(initialLeadForm);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      try {
        const response = await fetch(`${apiBaseUrl}/platform/overview`);
        if (!response.ok) {
          throw new Error("overview request failed");
        }

        const data = (await response.json()) as PlatformOverview;
        if (active) {
          setOverview(data);
        }
      } catch {
        if (active) {
          setOverview(null);
        }
      } finally {
        if (active) {
          setLoadingOverview(false);
        }
      }
    }

    void loadOverview();
    return () => {
      active = false;
    };
  }, [apiBaseUrl]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("sending");

    try {
      const response = await fetch(`${apiBaseUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          team_size: Number(form.team_size || 0)
        })
      });

      if (!response.ok) {
        throw new Error("lead request failed");
      }

      setSubmitState("success");
      setForm(initialLeadForm);
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <div className="page-shell">
      <div className="background-grid" />
      <header className="container site-header">
        <a className="brand" href="#top" aria-label="PotenCore">
          <span className="brand-accent">Poten</span>Core
        </a>
        <nav className="site-nav">
          <a href="#product">Продукт</a>
          <a href="#architecture">Архитектура</a>
          <a href="#contact">Заявка</a>
          <a href="/admin">Admin</a>
        </nav>
      </header>

      <main id="top">
        <section className="container hero">
          <div className="hero-copy">
            <span className="eyebrow">Автопилот для технологических команд до 50 человек</span>
            <h1>
              PotenCore собирает сигналы из ваших процессов и показывает,
              <span className="text-accent"> где команда теряет темп, ресурс и фокус.</span>
            </h1>
            <p className="hero-text">
              MVP уже закрывает лендинг, сбор заявок и архитектурную основу под будущие AI-рекомендации.
              В первом релизе без рискованных “умных решений”: сначала данные, прозрачность и полезные сигналы.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">
                Запросить пилот
                <ArrowRight size={18} />
              </a>
              <a className="button button-secondary" href="#architecture">
                Посмотреть архитектуру
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <strong>5 минут</strong>
                <span>на подключение первых интеграций</span>
              </div>
              <div className="stat-card">
                <strong>Zero-UI</strong>
                <span>без ручного ввода и тайм-трекеров</span>
              </div>
              <div className="stat-card">
                <strong>AI-ready</strong>
                <span>слой расширения уже заложен</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="screen-card large-screen">
              <img src={heroImage} alt="PotenCore landing concept" />
            </div>
            <div className="floating-metric floating-metric-left">
              <span>Свободный ресурс</span>
              <strong>18%</strong>
            </div>
            <div className="floating-metric floating-metric-right warning">
              <span>Риск дедлайна</span>
              <strong>Высокий</strong>
            </div>
          </div>
        </section>

        <section className="container features">
          {featureCards.map(({ icon: Icon, title, text }) => (
            <article className="feature-card" key={title}>
              <div className="icon-chip">
                <Icon size={22} />
              </div>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section id="product" className="container product-section">
          <div className="section-heading">
            <span className="eyebrow">Как выглядит продукт</span>
            <h2>Лендинг ведет в понятный рабочий контур, а не в пустое обещание AI.</h2>
            <p>
              В MVP показываем визуальный вектор продукта: дашборд команды, риски по задачам и прозрачную логику рекомендаций.
            </p>
          </div>

          <div className="preview-grid">
            <article className="preview-card">
              <div className="preview-copy">
                <span className="preview-label">Командный дашборд</span>
                <h3>Нагрузка команды, перегретые участники и рекомендации по перераспределению.</h3>
                <p>
                  Это отражает экспортированный UI-макет: темная панель, status cards, критические перегрузки и CTA к полезным действиям.
                </p>
              </div>
              <div className="screen-card">
                <img src={dashboardImage} alt="PotenCore dashboard preview" />
              </div>
            </article>

            <article className="preview-card alt">
              <div className="preview-copy">
                <span className="preview-label">Прогнозы и риски</span>
                <h3>Отчетность по спринту и предупредительные сигналы до того, как дедлайн сорвался.</h3>
                <p>
                  Блок готов под будущую ML-логику, но уже в MVP можно показывать правила, пороги и историю событий.
                </p>
              </div>
              <div className="screen-card">
                <img src={forecastImage} alt="PotenCore forecasts preview" />
              </div>
            </article>
          </div>
        </section>

        <section className="container integration-section">
          <div className="section-heading compact">
            <span className="eyebrow">Интеграции MVP</span>
            <h2>Сначала подключаем источники данных, потом добавляем интеллектуальный слой.</h2>
          </div>

          <div className="integration-grid">
            {integrations.map(({ icon: Icon, title, text }) => (
              <article className="integration-card" key={title}>
                <Icon size={20} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="architecture" className="container architecture-section">
          <div className="section-heading">
            <span className="eyebrow">Архитектура MVP</span>
            <h2>Backend уже разделен так, чтобы AI можно было подключить позже без сноса продукта.</h2>
          </div>

          <div className="architecture-grid">
            <article className="architecture-card">
              <div className="card-topline">
                <ShieldCheck size={18} />
                <span>Текущий контур</span>
              </div>
              <ul>
                <li>React/Vite лендинг с формой заявок и секциями продукта.</li>
                <li>FastAPI API для healthcheck, lead capture и продуктового overview.</li>
                <li>Nginx reverse proxy под `potencore.ru` с разделением `/` и `/api`.</li>
              </ul>
            </article>

            <article className="architecture-card highlighted">
              <div className="card-topline">
                <BrainCircuit size={18} />
                <span>AI placeholder</span>
              </div>
              {loadingOverview ? (
                <div className="loading-row">
                  <LoaderCircle className="spin" size={18} />
                  <span>Загружаю статус платформы</span>
                </div>
              ) : (
                <>
                  <p className="ai-summary">
                    {overview?.ai_status.summary ??
                      "AI не активирован: интерфейс и API уже готовы под подключение сервисов прогнозов и рекомендаций."}
                  </p>
                  <div className="pill-row">
                    {(overview?.ai_status.planned_modules ?? [
                      "risk-forecasting",
                      "task-allocation",
                      "communication-nlp"
                    ]).map((module) => (
                      <span className="pill" key={module}>
                        {module}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </article>

            <article className="architecture-card">
              <div className="card-topline">
                <Bot size={18} />
                <span>Дальше по релизам</span>
              </div>
              <ul>
                {(overview?.roadmap.next ?? [
                  "Подключить ручной импорт CSV и Google Sheets",
                  "Добавить event ingestion из Jira/Git/Telegram",
                  "Вынести рекомендации в отдельный сервис"
                ]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="container trust-section">
          <div className="trust-copy">
            <span className="eyebrow">Доверие и приватность</span>
            <h2>Продукт не должен выглядеть как система слежки.</h2>
            <p>
              Поэтому в лендинге и API сразу зафиксированы ограничения: только полезные метаданные, понятная цель сбора и отключаемые интеграции.
            </p>
          </div>
          <div className="trust-list">
            {trustItems.map((item) => (
              <div className="trust-item" key={item}>
                <Lock size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="container contact-section">
          <div className="contact-copy">
            <span className="eyebrow">Пилотный запуск</span>
            <h2>Собирайте лиды уже сейчас, пока продуктовая логика догоняет маркетинг.</h2>
            <p>
              Форма пишет заявки в backend, чтобы не терять интерес команд до подключения CRM или внешних automation-сценариев.
            </p>
            <div className="contact-highlights">
              <div>
                <Users size={18} />
                <span>Команды до 50 человек</span>
              </div>
              <div>
                <CheckCircle2 size={18} />
                <span>Тарифный ориентир: 2 990 ₽ / мес</span>
              </div>
            </div>
          </div>

          <form className="lead-form" onSubmit={handleSubmit}>
            <label>
              Имя
              <input
                value={form.name}
                onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
                placeholder="Как к вам обращаться"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))}
                placeholder="teamlead@company.ru"
                required
              />
            </label>

            <label>
              Команда
              <input
                value={form.team_name}
                onChange={(event) => setForm((state) => ({ ...state, team_name: event.target.value }))}
                placeholder="Backend Core"
                required
              />
            </label>

            <label>
              Размер команды
              <input
                type="number"
                min="1"
                max="50"
                value={form.team_size}
                onChange={(event) => setForm((state) => ({ ...state, team_size: event.target.value }))}
                placeholder="12"
                required
              />
            </label>

            <label className="full-width">
              Что хотите автоматизировать первым
              <textarea
                value={form.message}
                onChange={(event) => setForm((state) => ({ ...state, message: event.target.value }))}
                placeholder="Например: ретроспективы, баланс нагрузки, ранние сигналы по дедлайнам."
                rows={5}
              />
            </label>

            <button className="button button-primary full-width" type="submit" disabled={submitState === "sending"}>
              {submitState === "sending" ? "Отправляем..." : "Оставить заявку"}
            </button>

            {submitState === "success" && (
              <p className="form-message success">Заявка сохранена. Можно подключать следующий шаг: Telegram, email или CRM.</p>
            )}
            {submitState === "error" && (
              <p className="form-message error">Не удалось отправить заявку. Проверь, запущен ли backend.</p>
            )}
          </form>
        </section>
      </main>

      <footer className="container site-footer">
        <div>
          <strong>PotenCore</strong>
          <p>Автопилот для технологической команды без бюрократии и псевдо-AI.</p>
        </div>
        <div className="footer-meta">
          <span>{overview?.product_stage ?? "MVP landing + backend scaffold"}</span>
          <span>{overview?.integrations.join(" · ") ?? "Jira · Git · Telegram · Calendar"}</span>
        </div>
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

  return isAdminRoute ? <AdminPage apiBaseUrl={apiBaseUrl} /> : <LandingPage apiBaseUrl={apiBaseUrl} />;
}
