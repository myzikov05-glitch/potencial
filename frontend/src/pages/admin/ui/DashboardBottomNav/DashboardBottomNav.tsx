import { LayoutGrid, Settings, TrendingUp, User } from "lucide-react";
import type { AdminView } from "../../model/types";
import "./DashboardBottomNav.css";

type DashboardBottomNavProps = {
  activeView: AdminView;
};

export function DashboardBottomNav({ activeView }: DashboardBottomNavProps) {
  return (
    <nav className="dashboard-bottom-nav" aria-label="Админ навигация">
      <a className={activeView === "dashboard" ? "active" : undefined} href="/admin">
        <LayoutGrid size={28} />
        <span>Дашборд</span>
      </a>
      <a className={activeView === "profile" ? "active" : undefined} href="/admin#profile">
        <User size={28} />
        <span>Профиль</span>
      </a>
      <a className={activeView === "forecasts" ? "active" : undefined} href="/admin#forecasts">
        <TrendingUp size={28} />
        <span>Прогнозы</span>
      </a>
      <a className={activeView === "settings" ? "active" : undefined} href="/admin#settings">
        <Settings size={28} />
        <span>Настройки</span>
      </a>
    </nav>
  );
}
