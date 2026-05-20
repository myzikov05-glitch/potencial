import { FormEvent, useEffect, useState } from "react";
import {
  CheckSquare,
  Clock3,
  Handshake,
  Info,
  LayoutGrid,
  LoaderCircle,
  Medal,
  Send,
  Settings,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Zap
} from "lucide-react";
import { AdminSession, LoginFormState } from "../../../entities/session/model/types";
import { ADMIN_STORAGE_KEY } from "../../../shared/config/auth";
import "./AdminPage.css";

const initialLoginForm: LoginFormState = {
  username: "admin",
  password: "admin"
};

type AdminPageProps = {
  apiBaseUrl: string;
};

type TaskItem = {
  title: string;
  initials: string;
  owner: string;
  date: string;
  priority: "HIGH" | "MED" | "LOW";
  progress?: string;
};

type TaskColumn = {
  title: string;
  count: number;
  tone: "muted" | "blue" | "green";
  tasks: TaskItem[];
};

const workloadCards = [
  {
    type: "danger",
    initials: "ИВ",
    name: "Иванов Петр",
    load: "90%",
    warning: "Перегруз из-за 3 сложных задач и 5 встреч сегодня",
    recommendation:
      "Иванов Петр перегружен (90%). Петрова Ксения свободна (45%) -> Петрова, можешь помочь Иванову с задачей \"Рефакторинг API\"?"
  },
  {
    type: "danger",
    initials: "СИ",
    name: "Сидоров Алексей",
    load: "88%",
    warning: "Перегруз из-за 2 высокоприоритетных задач",
    recommendation:
      "Сидоров Алексей перегружен (88%). Денис К. свободна (55%) -> Денис, можешь помочь Сидорову с задачей \"Интеграция платежей\"?"
  },
  {
    type: "success",
    initials: "ПЕ",
    name: "Петрова Анна",
    load: "56%",
    warning: "Ресурс свободен. Можно помочь коллеге"
  },
  {
    type: "neutral",
    initials: "ДЕ",
    name: "Денис Кузнецов",
    load: "55%"
  },
  {
    type: "neutral",
    initials: "СМ",
    name: "Смирнова Елена",
    load: "68%"
  }
];

const achievements = [
  {
    title: "Анна взяла самую сложную задачу в спринте",
    meta: "Анна Смирнова",
    detail: "Сложность +40%"
  },
  {
    title: "Денис завершил 5 задач досрочно",
    meta: "Денис Иванов",
    detail: "5 задач на 2 дня раньше"
  },
  {
    title: "Команда закрыла спринт на 94%",
    meta: "Вся команда",
    detail: "Лучший результат за 2 месяца"
  }
];

const actionItems = [
  "Делегировать задачу «Рефакторинг API» от Иванова к Петровой",
  "Дать Сидорову задачу «Интеграция GraphQL API»",
  "Перенести важные задачи с пятницы на среду-четверг (низкая активность в пятницу)"
];

const taskColumns: TaskColumn[] = [
  {
    title: "К выполнению",
    count: 2,
    tone: "muted",
    tasks: [
      {
        title: "Рефакторинг API модуля",
        initials: "ИВ",
        owner: "Иванов",
        date: "15 мая",
        priority: "HIGH"
      },
      {
        title: "Тесты для нового функционала",
        initials: "ПЕ",
        owner: "Петрова",
        date: "13 мая",
        priority: "MED"
      }
    ]
  },
  {
    title: "В работе",
    count: 2,
    tone: "blue",
    tasks: [
      {
        title: "Интеграция с платёжной системой",
        initials: "СИ",
        owner: "Сидоров",
        date: "14 мая",
        priority: "HIGH",
        progress: "65%"
      },
      {
        title: "Дизайн новой формы",
        initials: "АН",
        owner: "Анна",
        date: "16 мая",
        priority: "LOW",
        progress: "40%"
      }
    ]
  },
  {
    title: "Готово",
    count: 1,
    tone: "green",
    tasks: [
      {
        title: "Настройка CI/CD",
        initials: "ДЕ",
        owner: "Денис",
        date: "12 мая",
        priority: "MED",
        progress: "100%"
      }
    ]
  }
];

export function AdminPage({ apiBaseUrl }: AdminPageProps) {
  const [session, setSession] = useState<AdminSession | null>(() => {
    const rawValue = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as AdminSession) : null;
  });
  const [loginForm, setLoginForm] = useState<LoginFormState>(initialLoginForm);
  const [loginState, setLoginState] = useState<"idle" | "sending" | "error">("idle");
  const [authChecked, setAuthChecked] = useState(false);

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
    <div className="page-shell admin-dashboard-shell">
      <div className="background-grid" />
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div className="dashboard-team">
            <div className="dashboard-team-icon">
              <Users size={34} />
            </div>
            <div>
              <h1>Команда «Backend Core»</h1>
              <p>12 участников</p>
            </div>
          </div>
          <button className="dashboard-telegram" type="button">
            <Send size={22} />
            Отправить сводку в Telegram
          </button>
        </header>

        <section className="dashboard-score-card">
          <div className="dashboard-score-head">
            <div className="dashboard-score-title">
              <TrendingUp size={26} />
              <span>Общая эффективность команды</span>
              <Info size={20} />
            </div>
            <span className="dashboard-source">📊 Jira + Git + Calendar</span>
          </div>
          <div className="dashboard-score">
            <strong>87</strong>
            <span>/100</span>
          </div>
          <p>Средняя загрузка, баланс сложности и выполнение сроков</p>
        </section>

        <section className="dashboard-metrics">
          <article className="dashboard-metric-card">
            <strong>72%</strong>
            <span>Загрузка команды</span>
            <small>📊 Jira tasks</small>
            <b className="metric-good">🤖 Загрузка в норме</b>
          </article>
          <article className="dashboard-metric-card">
            <strong>89%</strong>
            <span>Задач в срок</span>
            <small>📊 Jira deadlines</small>
            <b className="metric-warn">🤖 Баланс хромает: фронтенд перегружен</b>
          </article>
          <article className="dashboard-metric-card">
            <strong>76%</strong>
            <span>Баланс нагрузки</span>
            <small>📊 Распределение</small>
            <b className="metric-blue">🤖 Совет: перекиньте 2 задачи</b>
          </article>
        </section>

        <section className="dashboard-section">
          <h2 className="dashboard-section-title">⚖️ Текущая загрузка команды</h2>
          <div className="workload-list">
            {workloadCards.map((member) => (
              <article className={`workload-card workload-card-${member.type}`} key={member.name}>
                <div className="workload-main">
                  <div className="member-avatar">{member.initials}</div>
                  <div>
                    <h3>{member.name}</h3>
                    <strong>Загрузка: {member.load}</strong>
                  </div>
                  <span className="status-dot" />
                </div>
                {member.warning && (
                  <p className="workload-warning">
                    {member.type === "success" ? "✅" : "⚠️"} {member.warning}
                  </p>
                )}
                {member.recommendation && (
                  <>
                    <div className="workload-divider" />
                    <p className="workload-recommendation">💬 {member.recommendation}</p>
                    <div className="feedback-row">
                      <span>Полезна рекомендация?</span>
                      <button type="button">👍</button>
                      <button type="button">👎</button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="dashboard-section-title muted-title">
            <Medal size={20} />
            Наши достижения
          </h2>
          <div className="achievement-list">
            {achievements.map((achievement) => (
              <article className="achievement-card" key={achievement.title}>
                <span>⭐</span>
                <div>
                  <h3>{achievement.title}</h3>
                  <p>
                    <strong>{achievement.meta}</strong>
                    <span>•</span>
                    {achievement.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-section ai-section">
          <h2 className="ai-heading">
            <Sparkles size={28} />
            AI-аналитика и рекомендации
          </h2>

          <article className="forecast-card">
            <h3>
              <TrendingUp size={26} />
              Прогноз на следующую неделю
            </h3>
            <div className="forecast-value">
              <strong>76%</strong>
              <span>ожидаемая загрузка команды (в норме)</span>
            </div>
            <div className="forecast-note success-note">
              <strong>Прогноз выполнения задач:</strong>
              <span>20 из 24 задач (83%) при текущей скорости</span>
            </div>
            <div className="forecast-note risk-note">
              <strong>Риск:</strong>
              <span>Пятница — традиционный спад активности на 30% (по данным за 4 недели)</span>
              <small>💡 Рекомендуем перенести важные задачи на среду-четверг</small>
            </div>
            <p className="dashboard-source">📊 Анализ на основе Jira + Git + Calendar за 4 недели</p>
          </article>

          <h2 className="dashboard-section-title muted-title">
            <Users size={18} />
            AI-выводы по команде
          </h2>

          <article className="insight-card insight-danger">
            <h3>⚠️ Перегрузка требует действий</h3>
            <p>
              <strong>Иванов перегружен (90%) уже 3 дня подряд.</strong> Причина: 5 встреч сегодня + 3 сложные задачи.
            </p>
            <div className="insight-recommendation">
              <strong>💡 Рекомендация:</strong>
              Делегировать задачу "Рефакторинг API" Петровой (у неё загрузка 45%, есть опыт)
            </div>
            <p className="effect-line">
              <strong>Эффект:</strong> загрузка Иванова снизится до 65%, Петрова вырастет до 65% — баланс восстановится
            </p>
          </article>

          <article className="insight-card insight-warning">
            <h3>📊 Стагнация и развитие</h3>
            <p>
              <strong>У Сидорова стагнация: сложность задач не растёт 3 недели.</strong> Причина: выполняет только задачи
              среднего уровня сложности, хотя готов к более высоким.
            </p>
            <div className="insight-recommendation">
              <strong>💡 Рекомендация:</strong>
              Задача "Интеграция GraphQL API" (сложность +25%) — плавное повышение без стресса
            </div>
            <p className="effect-line">
              <strong>Эффект:</strong> развитие навыков, повышение мотивации, рост сложности задач
            </p>
          </article>

          <article className="insight-card insight-success">
            <h3>🤝 Коммуникация и помощь</h3>
            <p>
              <strong>Петрова — лучший помощник:</strong> помогла команде 4 раза за неделю (код-ревью, консультации).
              Иванов и Петрова синхронизированы на 90% — отличная связка.
            </p>
            <div className="insight-recommendation secondary">
              <strong>💡 Рекомендация:</strong>
              Дайте им совместный проект для усиления синергии
            </div>
          </article>
        </section>

        <section className="action-panel">
          <h2>
            <Zap size={28} />
            Что делать прямо сейчас
          </h2>
          <div className="action-list">
            {actionItems.map((item, index) => (
              <article className="action-card" key={item}>
                <span>{index + 1}</span>
                <div>
                  <p>{item}</p>
                  <button type="button">Выполнить</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-section help-section">
          <h2 className="help-heading">
            <Handshake size={22} />
            Помощь коллегам
          </h2>
          <article className="help-card help-danger">
            <h3>Кто перегружен и нуждается в помощи</h3>
            <div className="help-row">
              <span>Иван Иванов <small>(90%)</small></span>
              <a href="#tasks">Задача: Интеграция платежей →</a>
            </div>
            <div className="help-row">
              <span>Алексей Сидоров <small>(88%)</small></span>
              <a href="#tasks">Задача: Рефакторинг API →</a>
            </div>
          </article>

          <article className="help-card help-success">
            <h3>
              <Clock3 size={24} />
              У кого свободное время и кто может помочь
            </h3>
            <div className="help-row">
              <span>
                Ксения Петрова
                <small>Опыт: Backend интеграции</small>
              </span>
              <strong>45% свободна</strong>
            </div>
            <div className="help-row">
              <span>
                Денис Кузнецов
                <small>Опыт: API разработка</small>
              </span>
              <strong>55% свободна</strong>
            </div>
          </article>

          <article className="help-card help-review">
            <h3>
              <CheckSquare size={24} />
              Кто готов взять задачу на ревью
            </h3>
            <p>● Елена Смирнова</p>
            <p>● Ксения Петрова</p>
          </article>
        </section>

        <section className="task-board" id="tasks">
          <h2>Доска задач</h2>
          <div className="task-columns">
            {taskColumns.map((column) => (
              <div className="task-column" key={column.title}>
                <div className={`task-column-head task-column-${column.tone}`}>
                  <span>{column.title}</span>
                  <strong>{column.count}</strong>
                </div>
                {column.tasks.map((task) => (
                  <article className="task-card" key={task.title}>
                    <h3>{task.title}</h3>
                    <p>
                      <span className="task-avatar">{task.initials}</span>
                      {task.owner}
                    </p>
                    <div className="task-meta">
                      <span>◷ {task.date}</span>
                      <b className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</b>
                    </div>
                    {task.progress && (
                      <div className="task-progress">
                        <span style={{ width: task.progress }} />
                        <small>{task.progress}</small>
                      </div>
                    )}
                    <button type="button">🔗 Запросить помощь</button>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>

      <nav className="dashboard-bottom-nav" aria-label="Админ навигация">
        <a className="active" href="/admin">
          <LayoutGrid size={28} />
          <span>Дашборд</span>
        </a>
        <a href="/admin#profile">
          <User size={28} />
          <span>Профиль</span>
        </a>
        <a href="/admin#forecasts">
          <TrendingUp size={28} />
          <span>Прогнозы</span>
        </a>
        <a href="/admin#settings">
          <Settings size={28} />
          <span>Настройки</span>
        </a>
      </nav>
    </div>
  );
}
