import { useState } from "react";
import { CheckCircle, Zap } from "lucide-react";
import "./ActionPanel.css";

type ActionPanelProps = {
  actionItems: string[];
};

export function ActionPanel({ actionItems }: ActionPanelProps) {
  const [assignedItems, setAssignedItems] = useState<string[]>([]);

  function assignTask(item: string) {
    setAssignedItems((currentItems) => (currentItems.includes(item) ? currentItems : [...currentItems, item]));
  }

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
              {assignedItems.includes(item) ? (
                <div className="action-assigned-message">
                  <CheckCircle size={14} />
                  Задача назначена
                </div>
              ) : (
                <button type="button" onClick={() => assignTask(item)}>
                  Выполнить
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
