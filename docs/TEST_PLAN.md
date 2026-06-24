# Test Plan — smallapp-v1

## v1 Success Scenario (manual walkthrough)
1. Open `/leads` — confirm 4 seed leads render without login
2. Click **New Lead** — submit with name=`Test User`, email=`test@example.com`, source=`direct`
3. Confirm new row appears at top of list immediately
4. Click the new lead — confirm empty touchpoint timeline with empty-state copy
5. Click **Log Touchpoint** — submit channel=`email`, summary=`Sent intro`, outcome=`awaiting reply`, date=today
6. Confirm touchpoint appears in timeline
7. Repeat steps 2–3 until 5 leads exist (use unique emails)
8. Attempt to add a 6th lead — confirm upgrade banner/modal appears, no insert occurs
9. Click **Upgrade to Pro** — confirm redirect to Stripe-hosted checkout
10. Complete Stripe test checkout (card `4242 4242 4242 4242`)
11. Confirm redirect to `/upgrade/success` with success message
12. Add the 6th lead — confirm it saves successfully
13. Open Supabase `payments` table — confirm row with `status=paid` and `paid_at` set
14. Open Supabase `audit_logs` — confirm webhook event row present

## Empty States
- Delete all leads → `/leads` shows "No leads yet. Add your first lead." copy
- Open a lead with no touchpoints → timeline shows "No interactions logged yet."
- `/upgrade` visited when already paid → show "You're already on Pro."

## Error Cases
- Submit New Lead form with blank name → inline error "Name is required"
- Submit New Lead with duplicate email → API returns 409; UI shows "A lead with this email already exists"
- Stripe webhook arrives with invalid signature → API returns 400, no DB write
- Network failure on touchpoint submit → form shows "Something went wrong. Try again." toast; no duplicate row

## Security Checks
- Open browser devtools Network tab — confirm no response contains `STRIPE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`
- Direct `GET /api/checkout` (no POST body) → returns 405 Method Not Allowed
- Manually craft POST to `/api/leads` with 6 leads and no payment → returns 402
