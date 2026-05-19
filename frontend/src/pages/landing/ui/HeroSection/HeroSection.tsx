import heroImage from "../../../../assets/landing-hero.png";
import "./HeroSection.css";

export function HeroSection() {
  return (
    <section className="container hero">
      <div className="hero-copy">
        <h2>
          PotenCore - помогаем технологическим командам
          <span className="text-accent flow-glow"> работать в потоке</span>
          <span> и расти вместе</span>
        </h2>
        <p className="hero-text">
          Автоматическая аналитика эффективности команды, прогноз узких мест и AI-подсказки. Система сама подключается к инструментам, которые вы уже используете, и подсвечивает то, что не видно невооружённым взглядом: скрытую перегрузку, незаметную стагнацию, точки, где команде нужна помощь. Никаких опросов и ручного ввода - просто работайте, а мы поможем.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">
            Попробовать пилотную версию
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="screen-card large-screen">
          <img src={heroImage} alt="PotenCore landing concept" />
        </div>
      </div>
    </section>
  );
}
