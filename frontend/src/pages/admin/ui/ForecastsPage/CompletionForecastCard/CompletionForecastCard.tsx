import { Target } from "lucide-react";
import "./CompletionForecastCard.css";

export function CompletionForecastCard() {
  return (
    <section className="completion-forecast-card">
      <h2>
        <Target size={22} />
        Прогноз выполнения задач
      </h2>
      <div className="completion-forecast-value">
        <strong>78%</strong>
        <span>вероятность полного выполнения</span>
      </div>
      <p>При текущей скорости: 18 из 23 задач будут завершены за неделю</p>
      <div className="completion-progress" aria-label="Вероятность выполнения 78%">
        <span />
      </div>
      <small>📊 Jira velocity + burndown analysis</small>
    </section>
  );
}
