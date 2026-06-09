"""
Portfolio Positioning AI — AG-04 Chat Interface
Conversational Gemini agent that answers questions about portfolio health,
client trajectory, risk signals, and strategic positioning.

Reads live data from Supabase and answers in natural language.
Exposed via the ADK server as part of the momentum_agent sub-agent tree.
"""
from dotenv import load_dotenv
from google.adk.agents import Agent
from agents.shared.supabase_tools import supabase_select

load_dotenv()


async def get_portfolio_summary() -> str:
    """
    Returns a live summary of all clients: their composite scores, statuses,
    stall scores, exec dark days, and health labels. Call this first to answer
    any general portfolio question.
    """
    rows = await supabase_select("client_scores", limit=50)
    if not rows:
        return (
            "No live data in Supabase yet — ADK agents have not run a full analysis. "
            "Using demo-mode context: 11 clients tracked. "
            "Halcyon Systems stall score 9.1 (critical). "
            "Drift Capital stall 7.8. Vantage Partners stall 5.4. "
            "Pinnacle Group composite 8.75 (Accelerating). "
            "Meridian Capital 8.00 (On Track). Portfolio composite avg ~5.8/10."
        )
    lines = []
    for r in sorted(rows, key=lambda x: -(x.get("composite_score") or 0)):
        lines.append(
            f"{r.get('client_id','?')} | score={r.get('composite_score','?')} "
            f"status={r.get('status','?')} stall={r.get('stall_score','?')} "
            f"exec_dark={r.get('exec_dark_days','?')}d "
            f"delta={r.get('score_delta','?')}"
        )
    return "LIVE CLIENT SCORES (sorted by composite score):\n" + "\n".join(lines)


async def get_engagement_health() -> str:
    """
    Returns engagement health records: project name, health label, score,
    alert text, and summary for each active engagement. Use this to answer
    questions about specific account health or project status.
    """
    rows = await supabase_select("engagements", limit=50)
    if not rows:
        return (
            "No live engagement data yet. Demo context: "
            "Halcyon Systems — Stalling, score 1.65, 'Stall score 9.1 — 3 missed milestones'. "
            "Drift Capital — Stalling, score 1.70, 'Billing −40% vs contract'. "
            "Pinnacle Group — Accelerating, score 8.75, Phase 3/4 AI integration. "
            "Meridian Capital — On Track, score 8.00, compliance expansion in progress."
        )
    lines = []
    for r in rows:
        lines.append(
            f"{r.get('client_id','?')} | project='{r.get('project_name','?')}' "
            f"health={r.get('health','?')} score={r.get('score','?')} "
            f"alert='{r.get('alert','none')}' summary='{r.get('summary','')[:120]}'"
        )
    return "LIVE ENGAGEMENTS:\n" + "\n".join(lines)


async def get_open_action_items() -> str:
    """
    Returns open (not completed) action items with urgency levels and owners.
    Use this to answer questions about what needs to be done, who owns what,
    or which clients need immediate attention.
    """
    rows = await supabase_select("action_items", filters={"completed": False}, limit=30)
    if not rows:
        return (
            "No live action items. Demo context: "
            "CRITICAL: Halcyon Systems — stall 9.1, immediate escalation (due 09 Jun). "
            "CRITICAL: Drift Capital — billing −40%, scope creep (due 08 Jun). "
            "HIGH: Vantage Partners — budget cycle opens Jul 1, expansion window. "
            "HIGH: Corestone Infra — no exec contact 28d, re-engage now."
        )
    lines = []
    for r in sorted(rows, key=lambda x: {"crit": 0, "high": 1, "medium": 2}.get(x.get("urgency", "medium"), 2)):
        lines.append(
            f"[{r.get('urgency','?').upper()}] {r.get('client_name','?')} — "
            f"{r.get('description','?')[:140]} (due {r.get('due_date','?')}, owner: {r.get('owner','?')})"
        )
    return "OPEN ACTION ITEMS:\n" + "\n".join(lines)


async def get_agent_status() -> str:
    """
    Returns the current status of all 12 ADK agents: running, idle, alerting,
    and their last recorded action. Use this to answer questions about which
    agents are active, what they found, or the last time they ran.
    """
    rows = await supabase_select("agent_status", limit=20)
    if not rows:
        return (
            "No live agent status data. Demo context: "
            "AG-03 Stall Detection — Alerting: Halcyon stall 9.1. "
            "AG-07 Relationship Intel — Analyzing. "
            "AG-12 Outreach Drafter — Idle. "
            "All other agents Idle (awaiting first run)."
        )
    lines = []
    for r in rows:
        lines.append(
            f"{r.get('agent_id','?')} {r.get('name','')} — "
            f"status={r.get('status','?')} last_action='{r.get('last_action','?')}'"
        )
    return "AGENT STATUS:\n" + "\n".join(lines)


portfolio_chat_agent = Agent(
    name="portfolio_chat_agent",
    model="gemini-2.5-flash",
    tools=[get_portfolio_summary, get_engagement_health, get_open_action_items, get_agent_status],
    instruction="""
You are the Portfolio Positioning AI — the conversational intelligence interface for Qnsult's
12-agent consulting relationship management system.

You answer questions about client portfolio health, risk, trajectory, and strategic positioning.
You speak as a senior consulting strategist: concise, data-grounded, forward-looking.
Keep answers under 4 sentences unless depth is clearly needed. No bullet lists unless comparing.

═══════════════════════════════════════
FRAMEWORK — THE TWO-AXIS PORTFOLIO MAP
═══════════════════════════════════════

Every client is plotted on two axes:

  Y-axis — Value Chain Position (1–10):
    1–3: Execution / delivery work (AI-replaceable, commoditisation risk)
    4–6: Advisory / strategic work (mixed exposure)
    7–10: Embedded strategic partner (AI-resistant, high retention)

  X-axis — Relationship Health (1–10):
    1–3: Transactional (low contact, exec access weak)
    4–6: Engaged (regular cadence, some exec access)
    7–10: Embedded partnership (exec-sponsored, multi-stakeholder)

  The Project Wall sits at ~1.5 years of engagement on the X-axis.
  Accounts that cross it move into "strategic partnership zone" — top-right quadrant.
  Accounts stuck below/left face commoditisation or churn risk.

  Composite score = weighted blend of relationship + goal alignment + stall inverted + cadence + position.
  Thresholds: ≥8.0 Accelerating · ≥6.0 On Track · ≥4.0 Progressing · ≥2.0 At Risk · <2.0 Stalling

═══════════════════════════════════════
CLIENT CONTEXT (demo mode — override with live tool data)
═══════════════════════════════════════

Pinnacle Group (PNG):     score 8.75 · Accelerating · Phase 3/4 AI integration · $145K locked
                           McKinsey poaching 2 VP stakeholders — Stakeholder Anchor play queued
Meridian Capital (MRC):   score 8.00 · On Track · compliance expansion proposal pending
NovaTech Solutions (NTX): score 7.00 · On Track · Gartner event cycle approaching
Apex Dynamics (APX):      score 7.00 · On Track · exec alignment window open
Lumis Group (LMG):        score 5.00 · Progressing · mid-market, delivery phase
Stratford & Co (SFC):     score 5.00 · Progressing · legal vertical, advisory track
Corestone Infra (COR):    score 3.60 · At Risk · no exec contact 28d · AI exposure 78%
Vantage Partners (VTG):   score 3.60 · At Risk · budget cycle Jul 1 · expansion window
Redwood Advisors (RWA):   score 3.15 · At Risk · commoditisation risk · value chain score 3.1
Drift Capital (DRC):      score 1.70 · Stalling · billing −40% · scope creep +40% · 2 missed deliveries
Halcyon Systems (HCS):    score 1.65 · Stalling · stall 9.1/10 · CTO dark 49d · AI danger zone

═══════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════

1. If the question references live/current data ("what is", "who is", "how many"), call the
   relevant tool first to get fresh Supabase data before answering.

2. For questions about specific clients, call get_engagement_health() or get_portfolio_summary()
   to pull their current score and status.

3. For questions about urgent actions or what needs to be done, call get_open_action_items().

4. For questions about agent activity or what the system has detected, call get_agent_status().

5. Always ground your answer in data. Mention specific scores, deltas, or signals.

6. Reference relevant patterns when applicable:
   — Executive Bridge: re-engage dark executives (3–5 day play, 94% success)
   — Stakeholder Anchor: protect against talent poaching / key contact loss
   — Pre-emptive Scope Locking: prevent scope creep from derailing billing
   — Exec Alignment Lock: counter competitor RFP by securing exec sponsor
   — AI Governance Transition: pivot AI-risk accounts to strategic governance work

7. Never hallucinate client names, scores, or financial figures. If uncertain, call a tool.
""",
)
