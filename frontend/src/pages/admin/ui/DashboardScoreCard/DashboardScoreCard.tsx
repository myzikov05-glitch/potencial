import { Info, TrendingUp } from "lucide-react";
import "./DashboardScoreCard.css";

type DashboardScoreCardProps = {
  score: number;
};

export function DashboardScoreCard({ score }: DashboardScoreCardProps) {
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
        <strong>{Math.round(score)}</strong>
        <span>/100</span>
      </div>
      <p>Средняя загрузка, баланс сложности и выполнение сроков</p>
    </section>
  );
}