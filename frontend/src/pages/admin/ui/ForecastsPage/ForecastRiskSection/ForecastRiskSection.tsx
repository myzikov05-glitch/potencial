import { AlertTriangle, MessageSquare, TrendingDown } from "lucide-react";
import type { ForecastRisk } from "../../../model/types";
import "./ForecastRiskSection.css";

type ForecastRiskSectionProps = {
  risks: ForecastRisk[];
  title: string;
  tone: "danger" | "info";
};

const riskLabels: Record<ForecastRisk["tone"], string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий"
};

export function ForecastRiskSection({ risks, title, tone }: ForecastRiskSectionProps) {
  const SectionIcon = tone === "danger" ? TrendingDown : MessageSquare;

  return (
    <section className={`forecast-risk-section forecast-risk-section-${tone}`}>
      <h2>
        <SectionIcon size={18} />
        {title}
      </h2>
      <div className="forecast-risk-list">
        {risks.map((risk) => (
          <article className={`forecast-risk-card forecast-risk-${risk.tone}`} key={risk.title}>
            <strong className="forecast-risk-level">
              <AlertTriangle size={18} />
              {riskLabels[risk.tone]}
            </strong>
            <h3>{risk.title}</h3>
            <p>{risk.description}</p>
            <div className="forecast-risk-divider" />
            <b>💡 Рекомендация: {risk.recommendation}</b>
            <small>📊 {risk.source}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
