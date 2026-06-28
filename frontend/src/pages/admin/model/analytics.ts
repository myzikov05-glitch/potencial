export type ScoreComponents = {
  avg_load: number;
  avg_load_score: number;
  balance_score: number;
  stagnation_rate: number;
  stagnation_score: number;
  help_score: number;
};

export type TeamScore = {
  total: number;
  components: ScoreComponents;
};

export type MetricCard = {
  value: string;
  label: string;
  source: string;
  note: string;
  tone: "good" | "warn" | "blue";
};

export type ApiWorkloadCard = {
  type: "danger" | "success" | "neutral";
  initials: string;
  name: string;
  load: string;
  warning?: string | null;
  recommendation?: string | null;
};

export type ActionItem = {
  text: string;
};

export type HelpPerson = {
  name: string;
  detail: string;
};

export type HelpData = {
  overloaded: HelpPerson[];
  available: HelpPerson[];
  reviewers: string[];
};

export type DashboardResponse = {
  score: TeamScore;
  metrics: MetricCard[];
  workload: ApiWorkloadCard[];
  action_items: ActionItem[];
  help: HelpData;
  ai_summary: string;
  generated_at: string;
  llm_used: boolean;
};