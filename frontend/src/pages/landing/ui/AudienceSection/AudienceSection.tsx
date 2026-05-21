import { audienceCards } from "../../model/constans";
import "./AudienceSection.css";

export function AudienceSection() {
  return (
    <section className="container audience-section">
      <div className="audience-grid">
        {audienceCards.map(({ className, title, text }) => (
          <article className={`audience-card ${className}`} key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
