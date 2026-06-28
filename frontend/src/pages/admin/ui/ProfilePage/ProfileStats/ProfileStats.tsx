import type { ProfileStat } from "../../../model/types";
import "./ProfileStats.css";

type ProfileStatsProps = {
  stats: ProfileStat[];
};

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <section className="profile-stats" aria-label="Метрики профиля">
      {stats.map((stat) => (
        <article className={`profile-stat-card profile-stat-${stat.tone}`} key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
          <p>{stat.caption}</p>
        </article>
      ))}
    </section>
  );
}
