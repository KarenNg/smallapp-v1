export type Lead = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  source: string;
  status: string;
  notes: string | null;
  ai_score: number | null;
  ai_score_source: string | null;
  ai_score_confidence: number | null;
  ai_score_review_status: string | null;
  created_at: string;
};

export type Touchpoint = {
  id: string;
  user_id: string | null;
  lead_id: string;
  channel: string;
  summary: string;
  outcome: string | null;
  occurred_at: string;
  created_at: string;
};

export const LEAD_SOURCES = ["direct", "referral", "linkedin", "twitter", "organic"] as const;
export const LEAD_STATUSES = ["new", "contacted", "converted", "closed"] as const;
export const TOUCHPOINT_CHANNELS = ["email", "call", "linkedin", "twitter", "in-person", "other"] as const;

export const FREE_LEAD_LIMIT = 5;
