import { CheckCircle } from "lucide-react";
import type { IntegrationItem } from "../../../model/types";
import "./SettingsIntegrations.css";

type SettingsIntegrationsProps = {
  integrations: IntegrationItem[];
};

export function SettingsIntegrations({ integrations }: SettingsIntegrationsProps) {
  return (
    <div className="settings-integration-list">
      {integrations.map((integration) => (
        <article className="settings-integration-card" key={integration.name}>
          <span className="settings-integration-icon">{integration.icon}</span>
          <span className="settings-integration-copy">
            <strong>{integration.name}</strong>
            {integration.sync && <small>Синхронизация: {integration.sync}</small>}
          </span>
          {integration.status === "connected" ? (
            <b className="settings-connected">
              <CheckCircle size={18} />
              Подключено
            </b>
          ) : (
            <button type="button">Подключить</button>
          )}
        </article>
      ))}
    </div>
  );
}
