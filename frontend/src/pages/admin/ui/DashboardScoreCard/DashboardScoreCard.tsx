import { Info, TrendingUp } from "lucide-react";
import "./DashboardScoreCard.css";

export function DashboardScoreCard() {
  return (
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
  );
}
