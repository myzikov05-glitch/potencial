import { ArrowRight, UserPlus } from "lucide-react";
import "./SettingsTeam.css";

export function SettingsTeam() {
  return (
    <section className="settings-section settings-team-section">
      <h2>Команда</h2>
      <button className="settings-invite-card" type="button">
        <span className="settings-invite-icon">
          <UserPlus size={24} />
        </span>
        <span>
          <strong>Пригласить участника</strong>
          <small>Добавить нового члена команды</small>
        </span>
        <ArrowRight size={24} />
      </button>

      <article className="settings-team-card">
        <span>
          <strong>Текущая команда</strong>
          <small>12 активных участников</small>
        </span>
        <b>12</b>
      </article>
    </section>
  );
}
