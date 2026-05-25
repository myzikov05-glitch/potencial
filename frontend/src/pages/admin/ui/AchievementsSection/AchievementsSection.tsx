import { Award } from "lucide-react";
import { Achievement } from "../../model/types";
import "./AchievementsSection.css";

type AchievementsSectionProps = {
  achievements: Achievement[];
};

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section-title muted-title">
        <Award size={18} />
        Наши достижения
      </h2>
      <div className="achievement-list">
        {achievements.map((achievement) => (
          <article className="achievement-card" key={achievement.title}>
            <span className="achievement-icon">⭐</span>
            <div>
              <h3>{achievement.title}</h3>
              <p>
                <strong>{achievement.meta}</strong>
                <span>•</span>
                {achievement.detail}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
