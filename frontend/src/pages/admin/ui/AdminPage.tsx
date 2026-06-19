import { FormEvent, useEffect, useState } from "react";
import { AdminSession, LoginFormState } from "../../../entities/session/model/types";
import { ADMIN_STORAGE_KEY } from "../../../shared/config/auth";
import { achievements, taskColumns } from "../model/constants";
import { useDashboard } from "../model/useDashboard";
import { AchievementsSection } from "./AchievementsSection/AchievementsSection";
import { ActionPanel } from "./ActionPanel/ActionPanel";
import { AdminAuthCard } from "./AdminAuthCard/AdminAuthCard";
import { AdminLoading } from "./AdminLoading/AdminLoading";
import { AiAnalyticsSection } from "./AiAnalyticsSection/AiAnalyticsSection";
import { DashboardBottomNav } from "./DashboardBottomNav/DashboardBottomNav";
import { DashboardHeader } from "./DashboardHeader/DashboardHeader";
import { DashboardMetrics } from "./DashboardMetrics/DashboardMetrics";
import { DashboardScoreCard } from "./DashboardScoreCard/DashboardScoreCard";
import { HelpSection } from "./HelpSection/HelpSection";
import { TaskBoard } from "./TaskBoard/TaskBoard";
import { WorkloadSection } from "./WorkloadSection/WorkloadSection";
import "./AdminPage.css";

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
  const dashboard = useDashboard(apiBaseUrl, session?.access_token);

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
    return <AdminLoading />;
  }

  if (!session) {
    return (
      <AdminAuthCard
        loginForm={loginForm}
        loginState={loginState}
        onLogin={handleLogin}
        onLoginFormChange={setLoginForm}
      />
    );
  }

  if (dashboard.status === "loading") {
    return <AdminLoading />;
  }

  if (dashboard.status === "error" || !dashboard.data) {
    return (
      <div className="page-shell admin-dashboard-shell">
        <main className="dashboard-page">
          <DashboardHeader />
          <p style={{ padding: "2rem", textAlign: "center" }}>
            Не удалось загрузить аналитику. Проверьте, что backend запущен, и обновите страницу.
          </p>
        </main>
        <DashboardBottomNav />
      </div>
    );
  }

  const { score, metrics, workload, action_items, help, ai_summary } = dashboard.data;

  return (
    <div className="page-shell admin-dashboard-shell">
      <div className="background-grid" />
      <main className="dashboard-page">
        <DashboardHeader />
        <DashboardScoreCard score={score.total} />
        <DashboardMetrics metrics={metrics} />
        <WorkloadSection workloadCards={workload} />
        <AchievementsSection achievements={achievements} />
        <AiAnalyticsSection aiSummary={ai_summary} />
        <ActionPanel actionItems={action_items.map((item) => item.text)} />
        <HelpSection help={help} />
        <TaskBoard taskColumns={taskColumns} />
      </main>
      <DashboardBottomNav />
    </div>
  );
}
