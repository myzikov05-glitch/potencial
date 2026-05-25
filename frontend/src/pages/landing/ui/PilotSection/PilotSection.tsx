import "./PilotSection.css";

type PilotSectionProps = {
  onPilotClick: () => void;
};

export function PilotSection({ onPilotClick }: PilotSectionProps) {
  return (
    <section className="container pilot-section">
      <div className="pilot-banner">
        <h2>Попробуйте бесплатную пилотную версию уже сегодня</h2>
        <p>
          Подключите интеграции за 5 минут. PotenCore сразу покажет загрузку, риски и даст первые подсказки. Без опросов и ручного ввода.
        </p>
        <button className="pilot-button" type="button" onClick={onPilotClick}>
          Присоединиться
        </button>
      </div>
    </section>
  );
}
