import "./PricingSection.css";

export function PricingSection() {
  return (
    <section className="container pricing-section">
      <h2 className="pricing-title">Тарифы</h2>
      <div className="pricing-grid">
        <article className="pricing-card pricing-card-month">
          <h3>Month</h3>
          <div className="pricing-price">
            2 990 ₽<span>/мес</span>
          </div>
          <ul>
            <li>Все функции</li>
            <li>Поддержка</li>
          </ul>
          <a className="pricing-button pricing-button-outline" href="#contact">
            Выбрать месяц
          </a>
        </article>

        <article className="pricing-card pricing-card-year">
          <span className="pricing-badge">Выгода</span>
          <h3>Year</h3>
          <div className="pricing-price">
            29 900 ₽<span>/год</span>
          </div>
          <ul>
            <li>Всё то же самое</li>
            <li>Экономия 5 980 ₽</li>
          </ul>
          <a className="pricing-button pricing-button-filled" href="#contact">
            Выбрать год
          </a>
        </article>
      </div>
    </section>
  );
}
