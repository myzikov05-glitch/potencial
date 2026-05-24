import { FormEvent, useEffect, useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { LeadRecord } from "../../../entities/lead/model/types";
import { AdminSession, LoginFormState } from "../../../entities/session/model/types";
import { ADMIN_STORAGE_KEY } from "../../../shared/config/auth";
import { formatDate } from "../../../shared/lib/formatDate";

const initialLoginForm: LoginFormState = {
  username: "admin",
  password: "admin"
};

type AdminPageProps = {
  apiBaseUrl: string;
};

export function AdminPage({ apiBaseUrl }: AdminPageProps) {
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
                  {lead.phone && <span>{lead.phone}</span>}
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
