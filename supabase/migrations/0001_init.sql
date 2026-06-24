create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  email text not null,
  source text not null default 'direct',
  status text not null default 'new',
  notes text,
  ai_score numeric,
  ai_score_source text,
  ai_score_confidence numeric,
  ai_score_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

alter table leads enable row level security;
drop policy if exists "leads_v1_read" on leads;
create policy "leads_v1_read" on leads for select using (true);
drop policy if exists "leads_v1_write" on leads;
create policy "leads_v1_write" on leads for all using (true) with check (true);

create table if not exists touchpoints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  lead_id uuid not null references leads(id) on delete cascade,
  channel text not null,
  summary text not null,
  outcome text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table touchpoints enable row level security;
drop policy if exists "touchpoints_v1_read" on touchpoints;
create policy "touchpoints_v1_read" on touchpoints for select using (true);
drop policy if exists "touchpoints_v1_write" on touchpoints;
create policy "touchpoints_v1_write" on touchpoints for all using (true) with check (true);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text not null,
  stripe_session_id text,
  stripe_customer_id text,
  status text not null default 'pending',
  tier text not null default 'pro',
  amount_cents integer not null default 2900,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table payments enable row level security;
drop policy if exists "payments_v1_read" on payments;
create policy "payments_v1_read" on payments for select using (true);
drop policy if exists "payments_v1_write" on payments;
create policy "payments_v1_write" on payments for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  table_name text not null,
  record_id uuid,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into leads (id, name, email, source, status, notes) values
  ('a1000000-0000-0000-0000-000000000001', 'Sarah Chen', 'sarah@techstartup.io', 'referral', 'contacted', 'Interested in the pro plan, follow up Friday'),
  ('a1000000-0000-0000-0000-000000000002', 'Marcus Webb', 'marcus@growthco.com', 'linkedin', 'new', 'Found us via a post, wants a demo'),
  ('a1000000-0000-0000-0000-000000000003', 'Priya Nair', 'priya@designlab.co', 'organic', 'converted', 'Paid last week, onboarding done'),
  ('a1000000-0000-0000-0000-000000000004', 'Tom Okafor', 'tom@freelancehq.net', 'twitter', 'new', 'Asked about pricing in DMs');

insert into touchpoints (lead_id, channel, summary, outcome, occurred_at) values
  ('a1000000-0000-0000-0000-000000000001', 'email', 'Sent intro + pricing deck', 'awaiting reply', now() - interval '3 days'),
  ('a1000000-0000-0000-0000-000000000001', 'call', '20-min discovery call, identified pain point', 'send proposal', now() - interval '1 day'),
  ('a1000000-0000-0000-0000-000000000002', 'linkedin', 'Replied to comment, moved to DMs', 'interested', now() - interval '5 days'),
  ('a1000000-0000-0000-0000-000000000002', 'email', 'Sent demo invite', 'no reply yet', now() - interval '2 days'),
  ('a1000000-0000-0000-0000-000000000003', 'call', 'Closed call — agreed on pro tier', 'won', now() - interval '8 days'),
  ('a1000000-0000-0000-0000-000000000003', 'email', 'Welcome email + onboarding checklist sent', 'completed', now() - interval '7 days'),
  ('a1000000-0000-0000-0000-000000000004', 'twitter', 'Answered pricing question publicly', 'DM follow-up', now() - interval '1 day'),
  ('a1000000-0000-0000-0000-000000000004', 'email', 'Sent pricing page link', 'awaiting reply', now() - interval '6 hours');

insert into payments (email, stripe_session_id, status, tier, amount_cents, paid_at) values
  ('priya@designlab.co', 'cs_demo_abc123', 'paid', 'pro', 2900, now() - interval '7 days');