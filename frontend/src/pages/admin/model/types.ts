export type WorkloadCard = {
  type: "danger" | "success" | "neutral";
  initials: string;
  name: string;
  load: string;
  warning?: string;
  recommendation?: string;
};

export type Achievement = {
  title: string;
  meta: string;
  detail: string;
};

export type TaskItem = {
  title: string;
  initials: string;
  owner: string;
  date: string;
  priority: "HIGH" | "MED" | "LOW";
  progress?: string;
};

export type TaskColumn = {
  title: string;
  count: number;
  tone: "muted" | "blue" | "green";
  tasks: TaskItem[];
};

export type AdminView = "dashboard" | "forecasts";

export type ForecastRisk = {
  tone: "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
  source: string;
};
