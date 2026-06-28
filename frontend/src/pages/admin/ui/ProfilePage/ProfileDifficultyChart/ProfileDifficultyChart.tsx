import { TrendingUp } from "lucide-react";
import "./ProfileDifficultyChart.css";

const chartPoints = [
  { index: 0, value: 52, x: "1%", y: "42%" },
  { index: 1, value: 58, x: "34%", y: "35%" },
  { index: 2, value: 66, x: "68%", y: "26%" },
  { index: 3, value: 72, x: "99%", y: "15%" }
];

export function ProfileDifficultyChart() {
  return (
    <section className="profile-chart-card">
      <div className="profile-chart-head">
        <h2>
          <TrendingUp size={20} />
          Динамика сложности моих задач
        </h2>
        <strong>
          <TrendingUp size={18} />
          +38%
        </strong>
      </div>
      <div className="profile-chart-stage">
        <svg
          className="profile-chart-plot"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          role="img"
          aria-label="Рост сложности задач"
        >
          <path d="M1 42 L34 35 L68 26 L99 15" />
        </svg>
        {chartPoints.map((point) => (
          <button
            aria-label={`Неделя ${point.index}: value ${point.value}`}
            className="profile-chart-point"
            key={point.index}
            style={{ left: point.x, top: point.y }}
            type="button"
          >
            <span className="profile-chart-tooltip">
              <span>{point.index}</span>
              <strong>value : {point.value}</strong>
            </span>
          </button>
        ))}
      </div>
      <span className="profile-source">📊 Анализ из Jira tasks</span>
    </section>
  );
}
