import { Lightbulb } from "lucide-react";
import type { ProfileRecommendation } from "../../../model/types";
import "./ProfileRecommendations.css";

type ProfileRecommendationsProps = {
  recommendations: ProfileRecommendation[];
};

export function ProfileRecommendations({ recommendations }: ProfileRecommendationsProps) {
  return (
    <section className="profile-recommendations">
      <h2>
        <Lightbulb size={20} />
        AI-рекомендации для вас
      </h2>
      <div className="profile-recommendation-list">
        {recommendations.map((recommendation) => (
          <article className={`profile-recommendation-card profile-recommendation-${recommendation.tone}`} key={recommendation.title}>
            <h3>{recommendation.title}</h3>
            <p>{recommendation.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
