export type LeadRecord = {
  id: string;
  created_at: string;
  status: string;
  name: string;
  phone?: string;
  email: string;
  team_name: string;
  team_size: number;
  message: string;
};
