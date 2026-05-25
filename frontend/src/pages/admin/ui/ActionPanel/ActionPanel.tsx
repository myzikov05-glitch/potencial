import { Zap } from "lucide-react";
import "./ActionPanel.css";

type ActionPanelProps = {
  actionItems: string[];
};

export function ActionPanel({ actionItems }: ActionPanelProps) {
  return (
    <section className="action-panel">
      <h2>
        <Zap size={28} />
        Что делать прямо сейчас
      </h2>
      <div className="action-list">
        {actionItems.map((item, index) => (
          <article className="action-card" key={item}>
            <span>{index + 1}</span>
            <div>
              <p>{item}</p>
              <button type="button">Выполнить</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
