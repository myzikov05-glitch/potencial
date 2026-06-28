import { Sparkles, TrendingUp, Users } from "lucide-react";
import "./AiAnalyticsSection.css";

type AiAnalyticsSectionProps = {
  aiSummary?: string;
};

export function AiAnalyticsSection({ aiSummary }: AiAnalyticsSectionProps) {
  return (
    <section className="dashboard-section ai-section">
      <h2 className="ai-heading">
        <Sparkles size={24} />
        AI-аналитика и рекомендации
      </h2>

      <article className="forecast-card">
        <h3>
          <TrendingUp size={26} />
          Прогноз на следующую неделю
        </h3>
        <div className="forecast-value">
          <strong>76%</strong>
          <span>ожидаемая загрузка команды (в норме)</span>
        </div>
        <div className="forecast-note success-note">
          <strong>Прогноз выполнения задач:</strong>
          <span>20 из 24 задач (83%) при текущей скорости</span>
        </div>
        <div className="forecast-note risk-note">
          <strong>Риск:</strong>
          <span>Пятница - традиционный спад активности на 30% (по данным за 4 недели)</span>
          <small>💡 Рекомендуем перенести важные задачи на среду-четверг</small>
        </div>
        <p className="dashboard-source">📊 Анализ на основе Jira + Git + Calendar за 4 недели</p>
      </article>

      <h2 className="dashboard-section-title muted-title">
        <Users size={14} />
        AI-выводы по команде
      </h2>

      {aiSummary && (
        <article className="insight-card insight-danger">
          <h3>🤖 Рекомендация по балансировке</h3>
          <p>{aiSummary}</p>
        </article>
      )}
      <article className="insight-card insight-danger">
        <h3>⚠️ Перегрузка требует действий</h3>
        <p>
          <strong>Иванов перегружен (90%) уже 3 дня подряд.</strong> Причина: 5 встреч сегодня + 3 сложные задачи.
        </p>
        <div className="insight-recommendation">
          <strong>💡 Рекомендация:</strong>
          Делегировать задачу "Рефакторинг API" Петровой (у неё загрузка 45%, есть опыт)
        </div>
        <p className="effect-line">
          <strong>Эффект:</strong> загрузка Иванова снизится до 65%, Петрова вырастет до 65% - баланс восстановится
        </p>
      </article>

      <article className="insight-card insight-warning">
        <h3>📊 Стагнация и развитие</h3>
        <p>
          <strong>У Сидорова стагнация: сложность задач не растёт 3 недели.</strong> Причина: выполняет только задачи
          среднего уровня сложности, хотя готов к более высоким.
        </p>
        <div className="insight-recommendation">
          <strong>💡 Рекомендация:</strong>
          Задача "Интеграция GraphQL API" (сложность +25%) - плавное повышение без стресса
        </div>
        <p className="effect-line">
          <strong>Эффект:</strong> развитие навыков, повышение мотивации, рост сложности задач
        </p>
      </article>

      <article className="insight-card insight-success">
        <h3>🤝 Коммуникация и помощь</h3>
        <p>
          <strong>Петрова - лучший помощник:</strong> помогла команде 4 раза за неделю (код-ревью, консультации).
          Иванов и Петрова синхронизированы на 90% - отличная связка.
        </p>
        <div className="insight-recommendation secondary">
          <strong>💡 Рекомендация:</strong>
          Дайте им совместный проект для усиления синергии
        </div>
      </article>
    </section>
  );
}