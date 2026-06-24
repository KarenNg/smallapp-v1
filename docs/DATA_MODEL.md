# Data Model — smallapp-v1

## leads
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid | nullable until auth sprint |
| name | text | required |
| email | text | required |
| source | text | direct / referral / linkedin / twitter / organic |
| status | text | new / contacted / converted / closed |
| notes | text | free-form |
| ai_score | numeric | AI field |
| ai_score_source | text | model + prompt version |
| ai_score_confidence | numeric | 0–1 |
| ai_score_review_status | text | unreviewed / approved / rejected |
| created_at | timestamptz | default now() |

## touchpoints
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid | nullable |
| lead_id | uuid FK | → leads.id, cascade delete |
| channel | text | email / call / linkedin / twitter / in-person / other |
| summary | text | required |
| outcome | text | what happened next |
| occurred_at | timestamptz | user-supplied date |
| created_at | timestamptz | |

## payments
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid | nullable |
| email | text | required |
| stripe_session_id | text | |
| stripe_customer_id | text | |
| status | text | pending / paid / failed |
| tier | text | pro |
| amount_cents | integer | 2900 = $29 |
| paid_at | timestamptz | set by webhook |
| created_at | timestamptz | |

## audit_logs
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid | |
| table_name | text | |
| record_id | uuid | |
| action | text | insert / update / delete / checkout / score_update |
| old_data | jsonb | |
| new_data | jsonb | |
| created_at | timestamptz | |

## RLS
- v1: all tables have permissive read + write policies (demo-first)
- Lock-down sprint: replace with `auth.uid() = user_id` owner policies
