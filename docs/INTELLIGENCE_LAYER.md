# Intelligence Layer — smallapp-v1

## Messy Inputs
- Free-text touchpoint summaries ("called, seemed interested but budget unclear")
- Irregular touchpoint cadence per lead
- Source labels entered inconsistently

## Auto-Structure Schema
```json
{
  "lead_id": "uuid",
  "touchpoint_count": 4,
  "days_since_last_touch": 2,
  "channels_used": ["email", "call"],
  "recency_score": 0.82,
  "frequency_score": 0.65,
  "derived_intent": "high",
  "ai_score": 78,
  "ai_score_source": "rule-v1",
  "ai_score_confidence": 0.90,
  "ai_score_review_status": "unreviewed"
}
```

## Events to Track
- Lead created
- Touchpoint logged
- Lead status changed
- Payment completed
- Score updated

## Scoring Rules (v1 — rule-based)
- Base: `touchpoint_count × 10` (max 50)
- Recency bonus: +30 if last touch ≤ 3 days, +15 if ≤ 7 days, +0 otherwise
- Channel bonus: +10 if call or in-person in last 2 touches
- Cap at 100

## What Gets Ranked
- Leads sorted by score descending on list page
- Low-confidence AI scores flagged for review

## v1 vs Later
| v1 | Later |
|----|-------|
| Rule-based score | GPT summary of touchpoint notes |
| Score badge on UI | Follow-up draft suggestions |
| Manual review flag | Automated re-score on new touchpoint |
