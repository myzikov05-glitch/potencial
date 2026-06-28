import { profileGrowthZones, profileRecommendations, profileStats } from "../../model/constants";
import { ProfileDifficultyChart } from "./ProfileDifficultyChart/ProfileDifficultyChart";
import { ProfileGrowthZones } from "./ProfileGrowthZones/ProfileGrowthZones";
import { ProfileHeader } from "./ProfileHeader/ProfileHeader";
import { ProfileRecommendations } from "./ProfileRecommendations/ProfileRecommendations";
import { ProfileStats } from "./ProfileStats/ProfileStats";
import "./ProfilePage.css";

export function ProfilePage() {
  return (
    <div className="profile-page">
      <ProfileHeader />
      <ProfileStats stats={profileStats} />
      <ProfileDifficultyChart />
      <ProfileGrowthZones zones={profileGrowthZones} />
      <ProfileRecommendations recommendations={profileRecommendations} />
    </div>
  );
}
