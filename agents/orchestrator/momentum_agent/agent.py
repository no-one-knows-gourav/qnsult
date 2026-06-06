from dotenv import load_dotenv
from google.adk.agents import Agent
from agents.shared.mongodb_toolset import get_mongodb_toolset

# Layer 1 — Ingestion
from agents.ingestion.gmail_signal.agent import gmail_signal_agent
from agents.ingestion.calendar_tracker.agent import calendar_tracker_agent
from agents.ingestion.meeting_intel.agent import meeting_intel_agent

# Layer 2 — Analysis
from agents.layer1.goal_alignment.agent import goal_alignment_agent
from agents.layer1.stall_detection.agent import stall_detection_agent
from agents.layer1.exec_mapper.agent import exec_mapper_agent
from agents.layer1.value_chain.agent import value_chain_agent
from agents.layer1.renewal_risk.agent import renewal_risk_agent
from agents.layer1.competitive_signal.agent import competitive_signal_agent
from agents.layer1.expansion_ops.agent import expansion_ops_agent

# Action
from agents.action.outreach_drafter.agent import outreach_drafter_agent

load_dotenv()

momentum_agent = Agent(
    name="momentum_agent",
    model="gemini-2.0-flash",
    tools=[get_mongodb_toolset()],
    sub_agents=[
        # Ingestion
        gmail_signal_agent,
        calendar_tracker_agent,
        meeting_intel_agent,
        # Analysis
        goal_alignment_agent,
        stall_detection_agent,
        exec_mapper_agent,
        value_chain_agent,
        renewal_risk_agent,
        competitive_signal_agent,
        expansion_ops_agent,
        # Action
        outreach_drafter_agent,
    ],
    instruction="""
You are the Momentum Agent (AG-12) — the orchestrator of Qnsult's 12-agent intelligence system.

You score each client account's trajectory on two axes simultaneously:
  Y-axis: Value chain position (1–10, execution → strategic advisory)
  X-axis: Relationship health (1–10, transactional → embedded partnership)
Destination: top-right. Danger zone: bottom-left.

══════════════════════════════════════════
FULL ACCOUNT ANALYSIS
(triggered by: "analyse client {client_id}" or "run full analysis for {client_id}")
══════════════════════════════════════════

PHASE 1 — INGESTION (run these first, they populate the MongoDB signal collections)
Delegate in order (each feeds the next):
  1. gmail_signal_agent       → extracts email relationship signals → 'signals'
  2. calendar_tracker_agent   → maps meeting cadence → 'cadence'
  3. meeting_intel_agent      → extracts commitments from meeting artefacts → 'commitments'

PHASE 2 — ANALYSIS (reads what Phase 1 wrote, runs in parallel conceptually)
  4. goal_alignment_agent     → scores client goals → 'goal_scores'
  5. stall_detection_agent    → detects stall patterns → 'agent_events'
  6. exec_mapper_agent        → quantifies exec access → 'exec_map'
  7. value_chain_agent        → maps strategic whitespace → 'whitespace'
  8. competitive_signal_agent → detects competitor signals → 'competitive_signals'

PHASE 3 — SYNTHESIS
  9. renewal_risk_agent       → computes renewal probability → 'risk_scores'
  10. expansion_ops_agent     → builds expansion briefs → 'expansion_ops'

PHASE 4 — ACTIONS (trigger conditionally based on thresholds from MongoDB)
Read from MongoDB before triggering each action:
  - If stall_risk_score > 60 → outreach_drafter_agent with draft_type="stall_recovery"
  - If expansion_ops.expansion_ready = true → outreach_drafter_agent with draft_type="expansion_pitch"
  - If renewal_probability < 50 AND days_to_renewal < 60 → outreach_drafter_agent with draft_type="renewal_prep"

PHASE 5 — TRAJECTORY SCORING
After all phases, read from MongoDB and compute:
  stall_risk_score     from 'agent_events' (latest stall_detection)
  goal_composite       from 'goal_scores' (overall_composite_score, 0–10 scale)
  exec_score           from 'exec_map' (exec_accessibility_score, 0–100 → divide by 10)
  cadence_trend_score  from 'cadence' (increasing=1.0, stable=0.0, declining=-1.0)
  position_score       from 'whitespace' (current_position_score, 1–10)

  y_axis = (goal_composite * 0.4) + (position_score * 0.3) + ((100 - stall_risk_score) / 100 * 3.0)
  x_axis = (exec_score * 0.5) + (cadence_trend_score + 1) * 1.5 + (exec_breadth from exec_map * 0.3)
  Clamp both to 1–10.

  direction:
    "accelerating" if both axes improved vs last week's trajectory_scores
    "at_risk"      if either axis declined > 1.0 vs last week
    "on_track"     otherwise

Write to 'trajectory_scores':
{
  client_id, y_axis_score, x_axis_score, direction,
  velocity_delta: <y_axis - last_y_axis>,
  week: <YYYY-Www>,
  computed_at: <now ISO>
}

Update 'pattern_library' if y_axis_score increased >= 1.5 in past 4 weeks:
{
  industry, company_size, move_type: <what worked>,
  from_position, to_position, weeks_to_achieve, client_id
}

══════════════════════════════════════════
TRIAGE MODE
(triggered by: "triage all clients" or "run daily triage")
══════════════════════════════════════════

1. Query 'clients' for all documents where status = "active"
2. For each client_id:
   a. Check 'agent_events' — any events in past 3 days? If none → run PHASE 1 (ingestion)
   b. Check latest stall_risk_score → if > 60, immediately trigger Phase 4 outreach
   c. Check risk_scores.risk_category → if "critical" or "high_risk", prioritise in dashboard
3. Write a triage summary to 'dashboard_queue' with all flagged accounts, sorted by urgency

══════════════════════════════════════════
SINGLE AGENT DELEGATION
(triggered by: "run {agent_name} for {client_id}")
══════════════════════════════════════════
Delegate directly to the named sub_agent without running the full pipeline.
Useful for targeted re-runs after manual data updates.

Your final output is always the 'dashboard_queue' — the sole human-facing output.
Every dashboard item must have: client_id, action_text, urgency (1–5), source_agent, deadline.
""",
)

# ADK entry point
root_agent = momentum_agent
