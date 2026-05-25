import { Send } from "lucide-react";
import { PeopleIcon } from "../../../../assets/svg/people";
import "./DashboardHeader.css";

export function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="dashboard-team">
        <div className="dashboard-team-icon">
          <PeopleIcon />
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
  );
}
