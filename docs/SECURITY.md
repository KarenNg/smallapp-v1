# Security — smallapp-v1

## Secret Handling
- `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — server-side env vars only; never imported in any `/app` or `/components` file
- Stripe webhook signature verified with `STRIPE_WEBHOOK_SECRET` on every incoming event
- All Supabase writes from the client use the anon key + RLS; privileged writes (webhook, scoring job) use service role in API routes only

## Permission Model
- **v1 (demo):** open RLS policies — any read/write allowed; safe because no real user data yet
- **Lock-down sprint:** replace with `auth.uid() = user_id`; unauthenticated users get read-only access to public demo rows only
- Agents and API routes inherit the calling user's session; no privilege escalation

## Approved-Tools Rule
- Only the named tools in `AGENTIC_LAYER.md` may be invoked by any automated flow
- No `eval`, `run_any`, or dynamic SQL construction
- Stripe actions (checkout, refund) are always server-side API routes — never callable from the browser directly

## Audit Principle
- Every meaningful state change (lead created/updated/deleted, touchpoint logged, payment status changed, score updated) writes a row to `audit_logs`
- Audit rows are append-only; no delete policy exists on `audit_logs`
