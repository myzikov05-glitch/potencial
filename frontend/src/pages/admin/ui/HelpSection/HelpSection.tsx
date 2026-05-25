import { CheckSquare, Clock3, HandHeart } from "lucide-react";
import "./HelpSection.css";

export function HelpSection() {
  return (
    <section className="dashboard-section help-section">
      <h2 className="help-heading">
        <HandHeart size={18} />
        Помощь коллегам
      </h2>
      <article className="help-card help-danger">
        <h3>Кто перегружен и нуждается в помощи</h3>
        <div className="help-row">
          <span>Иван Иванов <small>(90%)</small></span>
          <a href="#tasks">Задача: Интеграция платежей →</a>
        </div>
        <div className="help-row">
          <span>Алексей Сидоров <small>(88%)</small></span>
          <a href="#tasks">Задача: Рефакторинг API →</a>
        </div>
      </article>

      <article className="help-card help-success">
        <h3>
          <Clock3 size={24} />
          У кого свободное время и кто может помочь
        </h3>
        <div className="help-row">
          <span>
            Ксения Петрова
            <small>Опыт: Backend интеграции</small>
          </span>
          <strong>45% свободна</strong>
        </div>
        <div className="help-row">
          <span>
            Денис Кузнецов
            <small>Опыт: API разработка</small>
          </span>
          <strong>55% свободна</strong>
        </div>
      </article>

      <article className="help-card help-review">
        <h3>
          <CheckSquare size={24} />
          Кто готов взять задачу на ревью
        </h3>
        <p>● Елена Смирнова</p>
        <p>● Ксения Петрова</p>
      </article>
    </section>
  );
}
