import { benefitCards } from "../../model/constans";
import "./BenefitsSection.css";

export function BenefitsSection() {
  return (
    <section className="container features-section">
      <h2 className="features-heading">
        Что вы получаете, <span className="text-accent flow-glow">подключив PotenCore</span>
      </h2>
      <div className="features">
        {benefitCards.map(({ icon: Icon, iconClass, title, text }) => (
          <article className="feature-card" key={title}>
            <div className={`icon-chip ${iconClass}`}>
              <Icon />
            </div>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
