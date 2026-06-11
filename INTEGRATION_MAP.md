# Qnsult Integration Map
> Reference for wiring frontend ↔ agents ↔ databases.
> Last updated: 2026-06-09

---

## Architecture Overview

```
Gmail / Calendar
      │
      ▼
ADK Agents (Python · Google ADK · Gemini 2.5 Flash)
  ├── reads company/client data via MongoDB MCP server
  ├── writes structured results → MongoDB Atlas (consultiq db)
  └── writes user-facing data  → Supabase (via Python supabase-py)
                                         │
                              Next.js Frontend reads:
                              ├── Supabase JS client (user data, realtime)
                              └── /api/* routes → MongoDB Atlas (agent data)
```

---

## 1. MongoDB Atlas — `consultiq` database

Connection: `mongodb+srv://sgsahoo77_db_user:3FTaO3HMVTmxmSBs@cluster0.y3fu6zx.mongodb.net/consultiq`

### `clients` — master client registry (seeded, agents read only)
| Field | Type | Notes |
|---|---|---|
| `client_id` | string | PK e.g. `hcs-001` · unique index |
| `name` | string | Display name e.g. `Halcyon Systems` |
| `ticker` | string | 3-letter code e.g. `HCS` |
| `domain` | string | Client email domain · index |
| `industry` | string | e.g. Technology, Private Equity |
| `contact_name` | string | Primary contact + title |
| `contact_email` | string | |
| `exec_contacts` | array | Exec-level contact emails (added by AG-05) |
| `primary_contacts` | array | All tracked contacts (added by AG-05) |
| `company_size` | string | `<50` / `50-150` / `150+` |
| `revenue_contracted_usd` | number | Contract value in $K |
| `contract_end_date` | ISO string | Used by AG-08 for renewal timing |
| `engagement_start_date` | ISO string | Used by AG-06 for tenure calc |
| `current_service_type` | string | e.g. execution / advisory |
| `status` | string | `active` / `inactive` |

---

### `client_scores` — one row per client, incrementally written by specialist agents
| Field | Type | Writer | Notes |
|---|---|---|---|
| `client_id` | string | — | PK · unique index |
| `composite_score` | float | AG-12 | 0–10 · final score |
| `status` | string | AG-12 | Accelerating / On Track / Progressing / At Risk / Stalling |
| `score_delta` | float | AG-12 | vs previous run |
| `stall_score` | float | AG-04 (stall_detection) | 0–10 |
| `exec_cadence_label` | string | AG-04 / AG-05 | e.g. `Dark 49d` |
| `exec_dark_days` | int | AG-02 / AG-05 | Days since last exec contact |
| `relationship_score` | float | AG-05 (exec_mapper) | 0–10 (exec_accessibility_score / 10) |
| `goal_alignment_score` | float | AG-07 (goal_alignment) | 0–10 |
| `budget_deviation_pct` | float | AG-08 (renewal_risk) | % over/under contract |
| `displacement_pct` | float | AG-12 | AI displacement exposure % |
| `alert_text` | string | AG-04 | Human-readable stall alert |
| `agent_notes` | string | AG-08 | Risk summary sentence |
| `updated_at` | ISO string | last writer | |

**Composite score formula (AG-12):**
```
composite = (relationship_score × 0.30)
          + (goal_alignment_score × 0.25)
          + ((10 − stall_score) × 0.20)
          + (cadence_trend_score + 1) × 0.75   # maps −1..1 → 0..1.5
          + (position_score / 10) × 1.0
```
Clamped 1.0–10.0. Status bands: ≥8.0 Accelerating · ≥6.0 On Track · ≥4.0 Progressing · ≥2.0 At Risk · else Stalling.

---

### `momentum_history` — time series, always INSERT (never upsert)
| Field | Type | Writer |
|---|---|---|
| `client_id` | string | AG-12 |
| `score` | float | AG-12 |
| `recorded_at` | ISO string | AG-12 |

Indexes: `(client_id, recorded_at DESC)`, `recorded_at DESC`
Frontend: line chart on Portfolio Intelligence tab.

---

### `engagements` — one row per client, overall engagement health
| Field | Type | Writer | Notes |
|---|---|---|---|
| `client_id` | string | — | PK · unique index |
| `project_name` | string | seeded | Display name |
| `health` | string | AG-12 / AG-04 | mirrors `status` from client_scores |
| `score` | float | AG-12 | mirrors composite_score |
| `alert` | string | AG-12 / AG-04 | Current alert text |
| `summary` | string | AG-12 | 1–2 sentence account trajectory |
| `progress_pct` | int | AG-03 | % milestones complete |
| `missed_milestones` | int | AG-03 (meeting_intel) | Count of overdue commitments |
| `updated_at` | ISO string | last writer | |

---

### `commitments` — multi-row, one per tracked commitment/deliverable
| Field | Type | Writer |
|---|---|---|
| `client_id` | string | AG-03 (meeting_intel) |
| `commitment_text` | string | AG-03 |
| `owner` | string | AG-03 |
| `due_date` | ISO string | AG-03 |
| `status` | string | AG-03 · `open` / `completed` / `overdue` |
| `deliverable_type` | string | AG-03 · e.g. `code_review` / `documentation` / `audit` |
| `ai_exposure_pct` | int | AG-06 (value_chain) · 0–100 |
| `created_at` | ISO string | AG-03 |

Indexes: `(client_id, due_date)`, `status`, `(client_id, status)`
Frontend: Engagements tab milestones; AI Danger Zone exposure index.

---

### `cadence` — one row per client, meeting frequency data
| Field | Type | Writer |
|---|---|---|
| `client_id` | string | AG-02 (calendar_tracker) |
| `exec_dark_days` | int | AG-02 |
| `cadence_trend` | string | AG-02 · `increasing` / `stable` / `declining` |
| `days_since_last_exec_meeting` | int | AG-02 |
| `upcoming_meetings_14d` | int | AG-02 |
| `upcoming_exec_meetings` | int | AG-02 |
| `last_meeting_date` | ISO string | AG-02 |
| `updated_at` | ISO string | AG-02 |

---

### `signals` — multi-row per client, individual email/sentiment signals
| Field | Type | Writer |
|---|---|---|
| `client_id` | string | AG-01 (gmail_signal) |
| `type` | string | AG-01 · e.g. `sentiment` / `exec_engagement` |
| `sentiment` | string | AG-01 · `positive` / `neutral` / `negative` |
| `topic_category` | string | AG-01 · `delivery` / `strategic` / `commercial` |
| `exec_in_thread` | bool | AG-01 |
| `severity` | string | AG-01 |
| `thread_id` | string | AG-01 |
| `ts` | ISO string | AG-01 |

Indexes: `(client_id, ts DESC)`, `type`, `severity`, `ts`

---

### `competitive_threats` — multi-row, always INSERT per scan
| Field | Type | Writer |
|---|---|---|
| `client_id` | string | AG-09 (competitive_signal) |
| `competitor` | string | AG-09 · detected name or `Unknown` |
| `threat_type` | string | AG-09 · `rfp_bid` / `talent_poach` / `shadow_proposal` / `budget_window` |
| `severity` | string | AG-09 · `Critical` / `High` / `Medium` / `Low` |
| `signal_source` | string | AG-09 · which signals triggered |
| `flagged_text` | string | AG-09 · verbatim email excerpt |
| `defense_play` | string | AG-09 · e.g. `Exec Alignment Lock` |
| `status` | string | AG-09 · `Monitoring` / `Queued` / `Resolved` |
| `days_detected` | int | AG-09 · 0 on insert |
| `detected_at` | ISO string | AG-09 |
| `updated_at` | ISO string | AG-09 |

Frontend: Competitive Risk tab — Active Threat Matrix.

---

### `agent_status` — one row per agent, upserted by agent_id
| Field | Type | Writer |
|---|---|---|
| `agent_id` | string | each agent · `AG-01` … `AG-12` · unique |
| `name` | string | seeded |
| `status` | string | each agent · `Idle` / `Analyzing` / `Alerting` |
| `last_action` | string | each agent · human-readable description |
| `updated_at` | ISO string | each agent |

Frontend: Agent Workflow tab node colors; Home System Status panel.

---

### Other collections (internal pipeline use, not directly surfaced to frontend)
| Collection | Written by | Read by | Purpose |
|---|---|---|---|
| `signals` | AG-01 | AG-04, AG-09 | Raw email signals |
| `exec_map` | AG-05 | AG-08, AG-10 | Exec accessibility data |
| `goal_scores` | AG-07 | AG-08, AG-10 | Client goal scoring |
| `whitespace` | AG-06 | AG-10 | Value chain position + opportunities |
| `risk_scores` | AG-08 | AG-10, AG-12 | Renewal probability |
| `expansion_ops` | AG-10 | AG-12 | Expansion briefs |
| `competitive_signals` | AG-09 | AG-08 | Internal threat assessment |
| `trajectory_scores` | AG-12 | — | Historical Y/X axis positions |
| `pattern_library` | AG-12 | AG-06, AG-10 | Successful move patterns |
| `engagement_log` | AG-03 | AG-04 | Append-only event log |
| `agent_events` | all agents | AG-12 | Pipeline audit trail |
| `dashboard_queue` (Mongo) | all agents | AG-12 | Notification staging before Supabase push |

---

## 2. Supabase — `qnsult` project (`sxxrwykfohktsnyscryr`)

Host: `db.sxxrwykfohktsnyscryr.supabase.co`
All public tables have RLS enabled. Service role key needed for ADK Python writes.

### Existing tables

#### `profiles` — auto-created on sign-up
| Field | Type |
|---|---|
| `id` | uuid · PK · FK → auth.users |
| `email` | text |
| `full_name` | text |
| `avatar_url` | text |
| `created_at` | timestamptz |

#### `user_tokens` — OAuth tokens stored after Google sign-in
| Field | Type |
|---|---|
| `id` | uuid · PK |
| `user_id` | uuid · FK → auth.users |
| `provider` | text · e.g. `google` |
| `access_token` | text |
| `refresh_token` | text |
| `updated_at` | timestamptz |

ADK agents read this table (using service role key, bypassing RLS) to get Gmail/Calendar tokens per user.

#### `dashboard_queue` — realtime notification stream ✅ wired
| Field | Type | Notes |
|---|---|---|
| `id` | uuid · PK | |
| `user_id` | uuid · FK → auth.users | nullable — broadcast to all if null |
| `agent_id` | text | e.g. `AG-04` |
| `event_type` | text | e.g. `stall_detected` |
| `payload` | jsonb | `{ client_id, action_text, urgency, source_agent, deadline }` |
| `read` | boolean | default false |
| `created_at` | timestamptz | |

Frontend subscribes via `postgres_changes` INSERT. Bell dropdown + Active Agent Actions feed.

---

### Tables to create

#### `gmail_threads` — email summaries (AG-01 writes, user reads)
| Field | Type | Notes |
|---|---|---|
| `id` | uuid · PK | |
| `user_id` | uuid · FK → auth.users | RLS: user sees own rows |
| `thread_id` | text | Gmail thread ID · unique per user |
| `client_id` | text | matched client_id |
| `subject` | text | |
| `sender` | text | |
| `preview` | text | 1–2 sentence extract |
| `summary` | text | AG-01 full summary |
| `sentiment` | text | positive / neutral / negative |
| `received_at` | timestamptz | original email time |
| `created_at` | timestamptz | default now() |

Frontend: Home → Mails & Updates subtab (replaces `MOCK_MAILS`).

#### `calendar_events` — calendar summaries (AG-02 writes, user reads)
| Field | Type | Notes |
|---|---|---|
| `id` | uuid · PK | |
| `user_id` | uuid · FK → auth.users | RLS |
| `event_id` | text | Google Calendar event ID · unique per user |
| `client_id` | text | matched client_id |
| `title` | text | |
| `start_time` | timestamptz | |
| `end_time` | timestamptz | |
| `platform` | text | Zoom / Teams / Meet / In-person |
| `prep_agent` | text | e.g. `AG-05` if prep note exists |
| `created_at` | timestamptz | default now() |

Frontend: Home → Calendar Events subtab.

#### `meeting_notes` — freeform operator notes (user writes, agents can read)
| Field | Type | Notes |
|---|---|---|
| `id` | uuid · PK | |
| `user_id` | uuid · FK → auth.users | RLS |
| `client_id` | text | optional — links note to client |
| `content` | text | freeform textarea value |
| `updated_at` | timestamptz | auto-update on save |
| `created_at` | timestamptz | default now() |

Frontend: Home → Notes & Minutes subtab (`notesText` state → persisted here).

#### `email_drafts` — outreach drafts generated by AG-12
| Field | Type | Notes |
|---|---|---|
| `id` | uuid · PK | |
| `user_id` | uuid · FK → auth.users | RLS |
| `client_id` | text | target client |
| `subject` | text | |
| `body` | text | draft email body |
| `draft_type` | text | `stall_recovery` / `expansion_pitch` / `renewal_prep` |
| `status` | text | `pending` / `sent` / `dismissed` |
| `created_at` | timestamptz | |
| `sent_at` | timestamptz | nullable |

Frontend: surfaced in Priority Queue / outreach action flows.

#### `action_items` — agent-generated actions, user checks off
| Field | Type | Notes |
|---|---|---|
| `id` | text · PK | e.g. `act-1` (or uuid) |
| `user_id` | uuid · FK → auth.users | RLS |
| `client_id` | text | |
| `description` | text | e.g. "Stall score 9.1 — escalation required" |
| `source_agent` | text | e.g. `stall_detection` |
| `urgency` | text | `crit` / `high` / `medium` |
| `due_date` | date | |
| `owner` | text | e.g. `Partner lead` |
| `completed` | boolean | default false |
| `completed_at` | timestamptz | nullable |
| `created_at` | timestamptz | |

Frontend: Priority Queue tab — replaces hardcoded array + `completedActions` state.

#### `user_settings` — per-operator configuration
| Field | Type | Notes |
|---|---|---|
| `user_id` | uuid · PK · FK → auth.users | one row per user |
| `gemini_model` | text | default `gemini-2.5-flash` |
| `scan_interval_min` | int | default 15 |
| `auto_draft_on_stall` | boolean | default true |
| `updated_at` | timestamptz | |

Frontend: Settings tab — replaces `defaultValue` props with live reads.

---

## 3. Agent I/O Summary

| Agent | ID | Reads from | Writes to |
|---|---|---|---|
| gmail_signal | AG-01 | Gmail API (MCP) | `signals`, `client_scores.last_active`, `agent_status`, **Supabase `gmail_threads`** |
| calendar_tracker | AG-02 | Calendar API (MCP) | `cadence`, `client_scores.exec_dark_days`, `agent_status`, **Supabase `calendar_events`** |
| meeting_intel | AG-03 | Google Drive / Meet (MCP) | `commitments`, `engagements.missed_milestones`, `agent_status` |
| stall_detection | AG-04 | `cadence`, `engagements`, `signals` | `client_scores` (stall_score, exec_cadence_label, alert_text), `engagements` (health, alert), `dashboard_queue`, `agent_events`, `agent_status` |
| exec_mapper | AG-05 | Gmail/Calendar (MCP), `clients` | `exec_map`, `client_scores` (relationship_score, exec_dark_days, exec_cadence_label), `agent_status` |
| value_chain | AG-06 | `goal_scores`, `clients`, `signals`, `exec_map`, `pattern_library` | `whitespace`, `dashboard_queue`, `agent_events`, `agent_status` |
| goal_alignment | AG-07 | Gmail/Calendar (MCP), `clients` | `goal_scores`, `client_scores.goal_alignment_score`, `agent_events`, `agent_status` |
| renewal_risk | AG-08 | `agent_events`, `exec_map`, `goal_scores`, `cadence`, `whitespace`, `competitive_signals`, `clients` | `risk_scores`, `client_scores` (budget_deviation_pct, agent_notes), `dashboard_queue`, `agent_events`, `agent_status` |
| competitive_signal | AG-09 | Gmail (MCP), `clients`, `signals` | `competitive_signals`, `competitive_threats` (INSERT), `dashboard_queue`, `agent_events`, `agent_status` |
| expansion_ops | AG-10 | `whitespace`, `exec_map`, `goal_scores`, `cadence`, `risk_scores` | `expansion_ops`, `dashboard_queue`, `agent_events`, `agent_status` |
| pattern_library | AG-11 | `trajectory_scores` | `pattern_library` |
| momentum_agent | AG-12 | All specialist outputs from MongoDB | `client_scores` (composite_score, status, score_delta), `momentum_history` (INSERT), `engagements`, `trajectory_scores`, `pattern_library`, `agent_status`, **Supabase `action_items`**, **Supabase `email_drafts`** (via outreach_drafter) |
| outreach_drafter | AG-12b | `client_scores`, `risk_scores`, `expansion_ops` | **Supabase `email_drafts`** |

> **Bold Supabase writes** require the Python `supabase-py` client with the service role key in `.env`.

---

## 4. Frontend ↔ Data Source Map

| UI Element | Tab | Source | How |
|---|---|---|---|
| KPI cards (Accelerating/At Risk/Stalling/Agents/Score) | Portfolio Intelligence | MongoDB `client_scores` | `/api/portfolio-kpis` |
| Account Momentum line chart | Portfolio Intelligence | MongoDB `momentum_history` | `/api/momentum-history?client_id=` |
| Portfolio map 2D scatter | Portfolio Intelligence | MongoDB `client_scores` | `/api/client-scores` |
| Client list cards | Clients | MongoDB `clients` + `client_scores` | `/api/clients` |
| Client detail panel | Clients | MongoDB `client_scores` + `engagements` | `/api/client/:id` |
| Engagement cards | Engagements | MongoDB `engagements` | `/api/engagements` |
| Milestones list | Engagements | MongoDB `commitments` | `/api/commitments?client_id=` |
| Agent node status | Agent Workflow | MongoDB `agent_status` | `/api/agent-status` (poll or SSE) |
| Stall Risk Matrix | Stall Detection | MongoDB `client_scores` + `cadence` | `/api/stall-matrix` |
| AI Exposure Index | AI Danger Zone | MongoDB `commitments` | `/api/ai-exposure` |
| Active Threat Matrix | Competitive Risk | MongoDB `competitive_threats` | `/api/competitive-threats` |
| Pattern Library cards | Pattern Library | MongoDB `pattern_library` | `/api/pattern-library` |
| Active Agent Actions feed | Home | Supabase `dashboard_queue` | Realtime subscription ✅ |
| Bell notification dropdown | Nav | Supabase `dashboard_queue` | Realtime subscription ✅ |
| Mails & Updates | Home | Supabase `gmail_threads` | Supabase JS client |
| Calendar Events | Home | Supabase `calendar_events` | Supabase JS client |
| Notes textarea | Home | Supabase `meeting_notes` | Supabase JS client (debounced upsert) |
| Priority Queue actions | Action Items | Supabase `action_items` | Supabase JS client |
| Email drafts | Outreach | Supabase `email_drafts` | Supabase JS client |
| Settings | Settings | Supabase `user_settings` | Supabase JS client |
| User profile / auth | Nav header | Supabase `auth.users` + `profiles` | Supabase Auth ✅ |

---

## 5. Environment Variables

### Next.js (`/my-project/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://sxxrwykfohktsnyscryr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

### ADK Backend (`/consultiq/agents/.env`)
```
SUPABASE_URL=https://sxxrwykfohktsnyscryr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # bypasses RLS for agent writes
MONGODB_URI=mongodb+srv://sgsahoo77_db_user:3FTaO3HMVTmxmSBs@cluster0.y3fu6zx.mongodb.net/consultiq
```
