import { teamCards } from "../../model/constans";
import "./TeamSection.css";

export function TeamSection() {
  return (
    <section className="container team-section">
      <h2 className="team-heading">
        PotenCore нужен не только лидеру - <span>он нужен всей команде</span>
      </h2>

      <div className="team-grid">
        {teamCards.map(({ emoji, title, text }) => (
          <article className="team-card" key={title}>
            <div className="team-card-emoji" aria-hidden="true">
              {emoji}
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <p className="team-note">
        PotenCore не оценивает, не наказывает и не создаёт рейтинги. Он просто показывает факты и предлагает, как сделать лучше.
      </p>
    </section>
  );
}
