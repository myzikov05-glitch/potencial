import "./PilotSection.css";

export function PilotSection() {
  return (
    <section className="container pilot-section">
      <div className="pilot-banner">
        <h2>Попробуйте бесплатную пилотную версию уже сегодня</h2>
        <p>
          Подключите интеграции за 5 минут. PotenCore сразу покажет загрузку, риски и даст первые подсказки. Без опросов и ручного ввода.
        </p>
        <a className="pilot-button" href="#contact">
          Присоединиться
        </a>
      </div>
    </section>
  );
}
