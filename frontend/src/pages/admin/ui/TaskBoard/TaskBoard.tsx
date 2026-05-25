import { HandHeart } from "lucide-react";
import { TaskColumn } from "../../model/types";
import "./TaskBoard.css";

type TaskBoardProps = {
  taskColumns: TaskColumn[];
};

export function TaskBoard({ taskColumns }: TaskBoardProps) {
  return (
    <section className="task-board" id="tasks">
      <h2>Доска задач</h2>
      <div className="task-columns">
        {taskColumns.map((column) => (
          <div className="task-column" key={column.title}>
            <div className={`task-column-head task-column-${column.tone}`}>
              <span>{column.title}</span>
              <strong>{column.count}</strong>
            </div>
            {column.tasks.map((task) => (
              <article className="task-card" key={task.title}>
                <h3>{task.title}</h3>
                <p>
                  <span className="task-avatar">{task.initials}</span>
                  {task.owner}
                </p>
                <div className="task-meta">
                  <span>◷ {task.date}</span>
                  <b className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</b>
                </div>
                {task.progress && (
                  <div className="task-progress">
                    <span style={{ width: task.progress }} />
                    <small>{task.progress}</small>
                  </div>
                )}
                <button type="button">
                  <HandHeart size={14} />
                  Запросить помощь
                </button>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
