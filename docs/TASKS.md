# Tasks — smallapp-v1

## Gantt Overview
```
Sprint 1 [DB + Core Engine]     ██████
Sprint 2 [Stripe + Paid Tier]         ██████   ← v1 functional ✓
Sprint 3 [Lock It Down]                     ██████
Sprint 4 [Pipeline + Notifications]               ██████
Sprint 5 [AI Lead Scoring]                              ██████
```

---

## Sprint 1 — DB + Lead Capture Engine
**Goal:** Core engine works end-to-end; app is demoable without login.

- [ ] Run migration SQL — leads, touchpoints, payments, audit_logs tables + seed data
- [ ] `/leads` page — server-rendered table of all leads (name, email, source, status, last touchpoint date)
- [ ] Lead detail page `/leads/[id]` — touchpoint timeline, newest first
- [ ] `POST /api/leads` — validate, insert, return new row; client appends to list
- [ ] New Lead form (modal or inline) — name, email, source; shows error on duplicate email
- [ ] `POST /api/touchpoints` — validate, insert, return row; timeline re-renders
- [ ] Log Touchpoint form on detail page — channel, summary, outcome, date
- [ ] Empty state copy on leads list and timeline
- [ ] Loading skeleton on list and detail
- [ ] Form validation errors shown inline

**Definition of Done:** `/leads` renders seed data without login; a tester can add a new lead and log a touchpoint; both persist and appear immediately; no console errors.

---

## Sprint 2 — Stripe Checkout + Paid Tier ✦ v1 functional
**Goal:** Tool can take a real payment and unlock full access.

- [ ] `POST /api/leads` returns 402 + upgrade prompt JSON when unpaid lead count ≥ 5
- [ ] UI shows upgrade banner / modal when 402 is returned
- [ ] `/upgrade` page — pricing copy ("Pro — $29/mo — unlimited leads"), Checkout button
- [ ] `POST /api/checkout` — create Stripe Checkout session server-side, return URL
- [ ] Redirect user to Stripe-hosted checkout
- [ ] `POST /api/webhooks/stripe` — verify signature, handle `checkout.session.completed`, mark `payments.status = 'paid'`, write audit log
- [ ] `/upgrade/success` page — confirm payment, show "You're on Pro" message
- [ ] Re-check paid status in `POST /api/leads` — allow insert if paid row exists for email
- [ ] STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET in Vercel env only; smoke-test no key in bundle

**Definition of Done:** End-to-end scenario passes — add 5 leads, hit limit, complete Stripe test checkout, add 6th lead successfully. Webhook verified. Audit log row written.

---

## Sprint 3 — Lock It Down
**Goal:** Real user data is isolated; app safe for production traffic.

- [ ] Enable Supabase Auth (email/password)
- [ ] `/login` and `/signup` pages
- [ ] Populate `user_id` on leads and touchpoints at write time via session
- [ ] Populate `user_id` on payments at webhook time (match by email)
- [ ] Drop v1 open RLS policies; add `auth.uid() = user_id` owner policies
- [ ] Unauthenticated users: read-only access to their own data (none); seed demo rows remain public
- [ ] Redirect unauthenticated write attempts to `/login`
- [ ] Smoke-test: own rows visible, other users' rows not visible

**Definition of Done:** Two test accounts cannot see each other's leads. Demo seed rows still visible. No write succeeds without auth.

---

## Sprint 4 — Lead Pipeline + Notifications
**Goal:** Lead status is trackable; user notified on new lead.

- [ ] Status dropdown on lead list — inline update, persists via `PATCH /api/leads/[id]`
- [ ] Status filter tabs on `/leads` (All / New / Contacted / Converted / Closed)
- [ ] Email notification via Resend when new lead is created (to the account owner)
- [ ] `GET /api/leads/export` — CSV of leads + touchpoint count
- [ ] Lead search by name or email (client-side filter)

**Definition of Done:** Status change persists and survives page reload. Export CSV opens in spreadsheet. Notification email received in test.

---

## Sprint 5 — AI Lead Scoring
**Goal:** Each lead has a data-driven score to prioritise follow-up.

- [ ] `score_lead(lead_id)` function — rule-based formula (touchpoint count × recency decay)
- [ ] Trigger score recalculation on every touchpoint insert
- [ ] Display score badge (0–100) on lead list and detail
- [ ] Write ai_score, ai_score_source, ai_score_confidence, ai_score_review_status on each update
- [ ] Flag scores with confidence < 0.5 as "needs review" in UI
- [ ] GPT narrative summary of touchpoint notes (summarise_touchpoint) — draft, human approves before saving
- [ ] Audit log entry for every score update

**Definition of Done:** Score visible on all leads; low-confidence scores flagged; GPT summary shows as draft pending approval; audit log has entry per score change.
