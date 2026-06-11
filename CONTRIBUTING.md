# Contributing to Qnsult

Thanks for your interest in contributing. This document covers how the repo is structured, how to get a local environment running, and how to submit changes.

---

## Repository layout

```
main branch          — Next.js frontend (this repo)
backend branch       — ADK agent backend (same repo, separate branch)
```

The two sides are deployed independently to separate Cloud Run services and can be developed independently. Most contributions will touch one or the other, not both.

---

## Local development

### Prerequisites

- Node.js 18+
- Python 3.12
- `npm install -g mongodb-mcp-server`
- A Google Cloud project with Gmail and Calendar APIs enabled
- MongoDB Atlas cluster with a `consultiq` database
- Supabase project

Full setup instructions are in the [README](README.md#local-setup).

### Frontend

```bash
git clone https://github.com/no-one-knows-gourav/qnsult.git
cd qnsult
npm install
cp .env.local.example .env.local   # fill in your credentials
npm run dev                         # http://localhost:3000
```

### ADK backend

```bash
git clone -b backend https://github.com/no-one-knows-gourav/qnsult.git qnsult-adk
cd qnsult-adk
pip install -r requirements.txt
# add agents/.env with your credentials
adk api_server agents --port 8000
```

Set `ADK_SERVER_URL=http://localhost:8000` in `.env.local` to point the frontend at your local backend.

---

## Making changes

### Branching

```
main          — production frontend
backend       — production backend
feature/*     — new features
fix/*         — bug fixes
```

Branch off `main` for frontend work, `backend` for agent work.

```bash
git checkout -b feature/your-feature-name
```

### Commits

Keep commits focused. One logical change per commit. Use the imperative mood in the subject line (`Add stall threshold config`, not `Added` or `Adding`).

### Pull requests

- Open PRs against `main` (frontend) or `backend` (agents)
- Include a short description of what changed and why
- If you changed agent logic, note which agent IDs are affected (e.g. `AG-04`, `AG-12`)
- If you changed a MongoDB collection schema, update `INTEGRATION_MAP.md`

---

## Agent development

Each agent lives in its own directory under `agents/`:

```
agents/ingestion/        AG-01, AG-02, AG-03
agents/layer1/           AG-04 through AG-10
agents/action/           AG-12b outreach_drafter
agents/orchestrator/     AG-12 momentum_agent, portfolio_chat
agents/shared/           mongo_tools.py, supabase_tools.py
```

### Rules for agent instructions

- Never ask Gemini to write Python code — only direct tool calls
- All timestamps must be literal ISO 8601 strings (e.g. `"2026-06-11T10:00:00Z"`)
- Every agent must upsert its own row in `agent_status` at start (`"Analyzing"`) and end (`"Idle"`)
- Use `mongo_find` / `mongo_insert` / `mongo_update` / `mongo_upsert` — never raw MCP tool names

### MongoDB writes → Supabase mirrors

If your agent writes to a collection that should be reflected in the frontend, add it to the appropriate mirror set in `agents/shared/mongo_tools.py`:

```python
_MIRROR_UPSERT = {"agent_status", "client_scores", "engagements"}
_MIRROR_INSERT = {"competitive_threats", "momentum_history", "dashboard_queue", "outreach_drafts"}
```

Any collection in `_MIRROR_INSERT` gets a corresponding `_mirror_insert()` handler — add one if you're introducing a new mirrored collection.

### Testing an agent locally

```bash
# Run a single agent via the ADK CLI
adk run agents --input '{"message": "analyse client hcs-001"}'

# Or start the API server and POST to it
adk api_server agents --port 8000
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{"appName":"agents","userId":"dev","sessionId":"test-1","newMessage":{"role":"user","parts":[{"text":"analyse client hcs-001"}]}}'
```

---

## Frontend development

The frontend is a Next.js 15 App Router project. API routes under `app/api/` are the only place that should talk to MongoDB directly — all agent data flows through those routes, not from client components.

### Data sources

| Data | Source | How |
|---|---|---|
| Agent pipeline data | MongoDB Atlas | `/api/*` server routes |
| User data, realtime events | Supabase | Supabase JS client + Realtime |
| Auth | Supabase Auth | `@supabase/ssr` middleware |

### Environment variables

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server routes that bypass RLS (delete, admin writes) |
| `ADK_SERVER_URL` | `/api/portfolio-chat` and `/api/run-analysis` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth sign-in |

---

## Reporting issues

Open a [GitHub Issue](https://github.com/no-one-knows-gourav/qnsult/issues) with:

- Which service is affected (frontend / ADK backend / both)
- Steps to reproduce
- What you expected vs what happened
- Relevant agent IDs or API routes if applicable

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
