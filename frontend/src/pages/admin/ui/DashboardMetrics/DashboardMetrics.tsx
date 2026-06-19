import type { MetricCard } from "../../model/analytics";
import "./DashboardMetrics.css";

type DashboardMetricsProps = {
  metrics: MetricCard[];
};

const toneClass: Record<MetricCard["tone"], string> = {
  good: "metric-good",
  warn: "metric-warn",
  blue: "metric-blue"
};

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <section className="dashboard-metrics">
      {metrics.map((metric) => (
        <article className="dashboard-metric-card" key={metric.label}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
          <small>{metric.source}</small>
          <b className={toneClass[metric.tone]}>{metric.note}</b>
        </article>
      ))}
    </section>
  );
}