import "./SettingsPlan.css";

export function SettingsPlan() {
  return (
    <article className="settings-plan-card">
      <div className="settings-plan-head">
        <span>
          <strong>PRO Plan (месяц)</strong>
          <small>До 20 участников команды</small>
        </span>
        <b>2 990 ₽/мес</b>
      </div>

      <div className="settings-year-card">
        <span>
          <strong>Годовой тариф</strong>
          <small>Экономия 5 980 ₽</small>
        </span>
        <b>29 900 ₽/год</b>
      </div>

      <button className="settings-subscription-button" type="button">
        Управление подпиской
      </button>
      <button className="settings-year-button" type="button">
        Перейти на тариф "Year"
      </button>
    </article>
  );
}
