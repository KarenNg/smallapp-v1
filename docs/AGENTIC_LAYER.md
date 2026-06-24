# Agentic Layer — smallapp-v1

## Risk Levels & Actions

### Low — Auto (no approval)
- Tag lead source from email domain pattern
- Score lead on new touchpoint (rule-based)
- Summarise touchpoint notes into one sentence

### Medium — Light Approval (user confirms)
- Create a follow-up task / reminder for a lead
- Change lead status to "Contacted" after first touchpoint logged

### High — Always Approval
- Send an email to a lead on the user's behalf
- Initiate a Stripe refund

### Critical — Human Only
- Delete a lead and all touchpoints
- Issue a refund manually in Stripe
- Any legal or compliance action

## Named Tools (approved list)
- `score_lead(lead_id)` — recalculate score, write ai_score fields
- `summarise_touchpoint(touchpoint_id)` — GPT summary, write to summary field
- `draft_followup(lead_id)` → returns draft, human sends
- `create_stripe_checkout(email, tier)` — server-side only
- `mark_payment_paid(session_id)` — webhook-triggered, write payments row

## Audit Log Fields (every action)
`user_id, table_name, record_id, action, old_data, new_data, created_at`

## v1 vs Later
| v1 | Later |
|----|-------|
| mark_payment_paid webhook | draft_followup with approval UI |
| score_lead (rule-based) | summarise_touchpoint (GPT) |
| audit_log writes | Full agent action queue UI |
