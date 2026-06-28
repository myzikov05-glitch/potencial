import { CheckSquare, Clock3, HandHeart } from "lucide-react";

import type { HelpData } from "../../model/analytics";
import "./HelpSection.css";

type HelpSectionProps = {
  help: HelpData;
};

export function HelpSection({ help }: HelpSectionProps) {
  return (
    <section className="dashboard-section help-section">
      <h2 className="help-heading">
        <HandHeart size={18} />
        Помощь коллегам
      </h2>

      <article className="help-card help-danger">
        <h3>Кто перегружен и нуждается в помощи</h3>
        {help.overloaded.length === 0 && <p>Перегруженных нет</p>}
        {help.overloaded.map((person) => (
          <div className="help-row" key={person.name}>
            <span>
              {person.name} <small>({person.detail})</small>
            </span>
          </div>
        ))}
      </article>

      <article className="help-card help-success">
        <h3>
          <Clock3 size={24} />У кого свободное время и кто может помочь
        </h3>
        {help.available.length === 0 && <p>Свободных пока нет</p>}
        {help.available.map((person) => (
          <div className="help-row" key={person.name}>
            <span>{person.name}</span>
            <strong>{person.detail}</strong>
          </div>
        ))}
      </article>

      <article className="help-card help-review">
        <h3>
          <CheckSquare size={24} />
          Кто чаще всех помогает с ревью
        </h3>
        {help.reviewers.length === 0 && <p>Данных по ревью нет</p>}
        {help.reviewers.map((name) => (
          <p key={name}>● {name}</p>
        ))}
        <p className="review-member">
          <span className="green-circle" />
          Елена Смирнова
        </p>
        <p className="review-member">
          <span className="green-circle" />
          Ксения Петрова
        </p>
      </article>
    </section>
  );
}