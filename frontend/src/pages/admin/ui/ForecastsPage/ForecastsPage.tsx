import { communicationRisks, forecastRecommendations, operationalRisks } from "../../model/constants";
import { CompletionForecastCard } from "./CompletionForecastCard/CompletionForecastCard";
import { ForecastRiskSection } from "./ForecastRiskSection/ForecastRiskSection";
import { ForecastSummary } from "./ForecastSummary/ForecastSummary";
import "./ForecastsPage.css";

export function ForecastsPage() {
  return (
    <div className="forecasts-page">
      <header className="forecasts-header">
        <h1>Прогнозы и риски</h1>
        <p>Превентивная аналитика</p>
      </header>

      <CompletionForecastCard />
      <ForecastRiskSection risks={operationalRisks} title="Операционные риски" tone="danger" />
      <ForecastRiskSection risks={communicationRisks} title="Риски коммуникаций" tone="info" />
      <ForecastSummary recommendations={forecastRecommendations} />
    </div>
  );
}
