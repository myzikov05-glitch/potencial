import type { ApiWorkloadCard } from "../../model/analytics";
import "./WorkloadSection.css";

type WorkloadSectionProps = {
  workloadCards: ApiWorkloadCard[];
};

export function WorkloadSection({ workloadCards }: WorkloadSectionProps) {
  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section-title">⚖️ Текущая загрузка команды</h2>
      <div className="workload-list">
        {workloadCards.map((member) => (
          <article className={`workload-card workload-card-${member.type}`} key={member.name}>
            <div className="workload-main">
              <div className="member-avatar">{member.initials}</div>
              <div>
                <h3>{member.name}</h3>
                <strong>Загрузка: {member.load}</strong>
              </div>
              <span className="status-dot" />
            </div>
            {member.warning && (
              <p className="workload-warning">
                {member.type === "success" ? "✅" : "⚠️"} {member.warning}
              </p>
            )}
            {member.recommendation && (
              <>
                <div className="workload-divider" />
                <p className="workload-recommendation">💬 {member.recommendation}</p>
                <div className="feedback-row">
                  <span>Полезна рекомендация?</span>
                  <button type="button">👍</button>
                  <button type="button">👎</button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}