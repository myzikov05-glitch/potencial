import { FormEvent, useEffect, useState } from "react";
import { AdminSession, LoginFormState } from "../../../entities/session/model/types";
import { ADMIN_STORAGE_KEY } from "../../../shared/config/auth";
import { achievements, taskColumns } from "../model/constants";
import type { AdminView } from "../model/types";
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
import { ForecastsPage } from "./ForecastsPage/ForecastsPage";
import { HelpSection } from "./HelpSection/HelpSection";
import { ProfilePage } from "./ProfilePage/ProfilePage";
import { TaskBoard } from "./TaskBoard/TaskBoard";
import { WorkloadSection } from "./WorkloadSection/WorkloadSection";
import "./AdminPage.css";

const initialLoginForm: LoginFormState = {
  username: "admin",
  password: "admin"
};

function getActiveAdminView(): AdminView {
  if (window.location.hash === "#profile") {
    return "profile";
  }

  if (window.location.hash === "#forecasts") {
    return "forecasts";
  }

  return "dashboard";
}

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
  const [activeView, setActiveView] = useState<AdminView>(getActiveAdminView);
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

  useEffect(() => {
    function handleHashChange() {
      setActiveView(getActiveAdminView());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

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

  if (activeView === "dashboard" && dashboard.status === "loading") {
    return <AdminLoading />;
  }

  if (activeView === "dashboard" && dashboard.status === "error") {
    return (
      <div className="page-shell admin-dashboard-shell">
        <div className="background-grid" />
        <main className="dashboard-page">
          <section className="dashboard-section">
            <h2 className="dashboard-section-title">Не удалось загрузить аналитику</h2>
          </section>
        </main>
        <DashboardBottomNav activeView={activeView} />
      </div>
    );
  }

  const dashboardData = dashboard.data;

  return (
    <div className="page-shell admin-dashboard-shell">
      <div className="background-grid" />
      <main className="dashboard-page">
        {activeView === "forecasts" ? (
          <ForecastsPage />
        ) : activeView === "profile" ? (
          <ProfilePage />
        ) : dashboardData ? (
          <>
            <DashboardHeader />
            <DashboardScoreCard score={dashboardData.score.total} />
            <DashboardMetrics metrics={dashboardData.metrics} />
            <WorkloadSection workloadCards={dashboardData.workload} />
            <AchievementsSection achievements={achievements} />
            <AiAnalyticsSection />
            <ActionPanel actionItems={dashboardData.action_items.map((item) => item.text)} />
            <HelpSection help={dashboardData.help} />
            <TaskBoard taskColumns={taskColumns} />
          </>
        ) : (
          <>
            <DashboardHeader />
            <AchievementsSection achievements={achievements} />
            <AiAnalyticsSection />
            <TaskBoard taskColumns={taskColumns} />
          </>
        )}
      </main>
      <DashboardBottomNav activeView={activeView} />
    </div>
  );
}
