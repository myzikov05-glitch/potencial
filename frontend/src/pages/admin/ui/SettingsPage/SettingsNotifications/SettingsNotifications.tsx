import { useState } from "react";
import type { NotificationSetting } from "../../../model/types";
import "./SettingsNotifications.css";

type SettingsNotificationsProps = {
  notifications: NotificationSetting[];
};

export function SettingsNotifications({ notifications }: SettingsNotificationsProps) {
  const [settings, setSettings] = useState(notifications);

  function toggleNotification(title: string) {
    setSettings((currentSettings) =>
      currentSettings.map((notification) =>
        notification.title === title ? { ...notification, enabled: !notification.enabled } : notification
      )
    );
  }

  return (
    <article className="settings-notifications-card">
      {settings.map((notification) => (
        <div className="settings-notification-row" key={notification.title}>
          <span>
            <strong>{notification.title}</strong>
            <small>{notification.description}</small>
          </span>
          <button
            aria-label={`${notification.enabled ? "Выключить" : "Включить"} ${notification.title}`}
            aria-pressed={notification.enabled}
            className={notification.enabled ? "settings-toggle settings-toggle-on" : "settings-toggle"}
            onClick={() => toggleNotification(notification.title)}
            type="button"
          >
            <span />
          </button>
        </div>
      ))}
    </article>
  );
}
