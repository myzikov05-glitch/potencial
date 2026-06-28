import { Bell, CreditCard, Link } from "lucide-react";
import { integrationItems, notificationSettings } from "../../model/constants";
import { SettingsIntegrations } from "./SettingsIntegrations/SettingsIntegrations";
import { SettingsNotifications } from "./SettingsNotifications/SettingsNotifications";
import { SettingsPlan } from "./SettingsPlan/SettingsPlan";
import { SettingsTeam } from "./SettingsTeam/SettingsTeam";
import "./SettingsPage.css";

export function SettingsPage() {
  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Настройки</h1>
        <p>Конфигурация системы</p>
      </header>

      <SettingsTeam />

      <section className="settings-section">
        <h2>
          <Link size={18} />
          Интеграции
        </h2>
        <SettingsIntegrations integrations={integrationItems} />
      </section>

      <section className="settings-section">
        <h2>
          <Bell size={18} />
          Уведомления
        </h2>
        <SettingsNotifications notifications={notificationSettings} />
      </section>

      <section className="settings-section">
        <h2>
          <CreditCard size={18} />
          Тариф
        </h2>
        <SettingsPlan />
      </section>

      <footer className="settings-footer">
        PotenCore v1.0.0 • <span> Powered by AI</span>
      </footer>
    </div>
  );
}
