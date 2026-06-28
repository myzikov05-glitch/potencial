import { ArrowRight } from "lucide-react";
import "./ForecastSummary.css";

type ForecastSummaryProps = {
  recommendations: string[];
};

export function ForecastSummary({ recommendations }: ForecastSummaryProps) {
  return (
    <section className="forecast-summary-card">
      <h2>Сводка рекомендаций</h2>
      <ul>
        {recommendations.map((recommendation) => (
          <li key={recommendation}>
            <ArrowRight size={18} />
            {recommendation}
          </li>
        ))}
      </ul>
    </section>
  );
}
