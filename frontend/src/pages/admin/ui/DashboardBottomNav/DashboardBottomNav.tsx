import { LayoutGrid, Settings, TrendingUp, User } from "lucide-react";
import "./DashboardBottomNav.css";

export function DashboardBottomNav() {
  return (
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
  );
}
