import { Target } from "lucide-react";
import "./ProfileGrowthZones.css";

type ProfileGrowthZonesProps = {
  zones: string[];
};

export function ProfileGrowthZones({ zones }: ProfileGrowthZonesProps) {
  return (
    <section className="profile-growth-card">
      <h2>
        <Target size={20} />
        Зоны роста
      </h2>
      <ul>
        {zones.map((zone) => (
          <li key={zone}>{zone}</li>
        ))}
      </ul>
    </section>
  );
}
