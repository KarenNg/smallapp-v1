# Architecture — smallapp-v1

## Stack
- **Frontend:** Next.js 14 (App Router) on Vercel
- **Database + Auth:** Supabase (Postgres, RLS, Auth)
- **Payments:** Stripe Checkout + Webhooks
- **Email (later):** Resend

## What to Build Now vs Later
| Now | Later |
|-----|-------|
| Lead capture + touchpoint log | Auth + per-user isolation |
| Lead list + detail views | Lead status pipeline |
| Stripe checkout + webhook | AI lead scoring |
| Paid tier gate (5-lead limit) | Email notifications |

## Key User Action — Step by Step
1. User fills the New Lead form → client POSTs to `/api/leads`
2. API route validates input, inserts row into `leads` table
3. Supabase returns the new row; UI appends it to the list
4. User opens lead detail, fills Log Touchpoint form → POST to `/api/touchpoints`
5. Touchpoint row saved; timeline re-fetches and shows new entry
6. On 6th lead attempt, API checks `leads` count; returns 402 if unpaid
7. UI shows upgrade prompt → user clicks → POST to `/api/checkout` → Stripe session created server-side
8. User completes Stripe payment → webhook fires → `payments` row marked `paid`
9. Next lead creation succeeds; no limit enforced

## Layer Plan
1. **Data first** — tables, seed rows, open RLS policies
2. **App logic** — CRUD routes, lead count gate, Stripe webhook
3. **Smart features** — AI scoring, follow-up drafts (later)

## Core Without AI
All lead capture, touchpoint logging, and payment gating are pure database + server logic. AI features are additive; removing them leaves a fully working product.
