# PRD — smallapp-v1

## Problem
People who sell a service or product have leads scattered across DMs, emails, and spreadsheets. They miss follow-ups because there is no single place to log every interaction. They need one tiny tool that captures a lead, logs every touchpoint, and charges a small fee to keep it serious.

## Target User
Anyone running a small service business, freelance practice, or solo SaaS who manages leads manually today.

## Core Objects
- **Lead** — a potential customer (name, email, source, status, notes)
- **Touchpoint** — a logged interaction with a lead (channel, summary, outcome, date)
- **Payment** — a Stripe checkout record (email, session, tier, status, paid_at)

## MVP Must-Haves
- [ ] Lead list page — see all leads at a glance
- [ ] Add New Lead form — saves to DB, visible immediately
- [ ] Lead detail page — full touchpoint timeline
- [ ] Log Touchpoint form — saves to DB, appears in timeline
- [ ] Free tier: up to 5 leads; paid tier: unlimited
- [ ] Upgrade page with Stripe checkout
- [ ] Payment webhook — unlock full access on success
- [ ] Empty, loading, and error states throughout

## Non-Goals (v1)
- Team/multi-user accounts
- Email automation or sequences
- CRM integrations (HubSpot, Salesforce)
- Mobile app

## Success Criteria
A visitor lands on `/leads`, sees demo data, adds their first real lead, logs a touchpoint, hits the 5-lead limit, completes Stripe checkout for $29/mo, and immediately sees the lead creation limit lifted — all without a bug.
