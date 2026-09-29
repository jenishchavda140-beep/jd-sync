export type User = {
  id: string;
  email: string;
  full_name?: string | null;
  created_at?: string;
};

export type Client = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company?: string | null;
  created_at?: string;
};

export type Invoice = {
  id: string;
  user_id: string;
  client_id: string;
  amount: number | string;
  status: string;
  due_date: string;
  stripe_payment_link?: string | null;
  created_at?: string;
  clients?: {
    name?: string;
    email?: string;
  };
};

export type DashboardMetric = {
  label: string;
  value: string;
  change: string;
  positive: boolean;
};
