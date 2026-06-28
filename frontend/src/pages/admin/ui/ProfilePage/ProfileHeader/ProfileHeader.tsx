import { User } from "lucide-react";
import "./ProfileHeader.css";

export function ProfileHeader() {
  return (
    <header className="profile-header">
      <div className="profile-avatar">
        <User size={28} />
      </div>
      <div>
        <h1>Ксения Петрова</h1>
        <p>Frontend Developer</p>
      </div>
    </header>
  );
}
