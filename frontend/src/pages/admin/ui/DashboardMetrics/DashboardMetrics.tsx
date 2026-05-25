import "./DashboardMetrics.css";

export function DashboardMetrics() {
  return (
    <section className="dashboard-metrics">
      <article className="dashboard-metric-card">
        <strong>72%</strong>
        <span>Загрузка команды</span>
        <small>📊 Jira tasks</small>
        <b className="metric-good">🤖 Загрузка в норме</b>
      </article>
      <article className="dashboard-metric-card">
        <strong>89%</strong>
        <span>Задач в срок</span>
        <small>📊 Jira deadlines</small>
        <b className="metric-warn">🤖 Баланс хромает: фронтенд перегружен</b>
      </article>
      <article className="dashboard-metric-card">
        <strong>76%</strong>
        <span>Баланс нагрузки</span>
        <small>📊 Распределение</small>
        <b className="metric-blue">🤖 Совет: перекиньте 2 задачи</b>
      </article>
    </section>
  );
}
