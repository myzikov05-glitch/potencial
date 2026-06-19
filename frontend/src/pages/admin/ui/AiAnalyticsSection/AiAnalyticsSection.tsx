import { Sparkles, TrendingUp, Users } from "lucide-react";
import "./AiAnalyticsSection.css";

type AiAnalyticsSectionProps = {
  aiSummary?: string;
};

export function AiAnalyticsSection({ aiSummary }: AiAnalyticsSectionProps) {
  return (
    <section className="dashboard-section ai-section">
      <h2 className="ai-heading">
        <Sparkles size={24} />
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
        <Users size={14} />
        AI-выводы по команде
      </h2>

      {aiSummary && (
        <article className="insight-card insight-danger">
          <h3>🤖 Рекомендация по балансировке</h3>
          <p>{aiSummary}</p>
        </article>
      )}
    </section>
  );
}