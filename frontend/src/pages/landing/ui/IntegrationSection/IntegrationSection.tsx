import { integrations } from "../../model/constans";
import "./IntegrationSection.css";

export function IntegrationSection() {
  return (
    <section className="container integration-section">
      <div className="integration-grid">
        {integrations.map(({ icon: Icon, iconClass, title, text }) => (
          <article className="integration-card" key={title}>
            <div className={`integration-icon ${iconClass}`}>
              <Icon />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
