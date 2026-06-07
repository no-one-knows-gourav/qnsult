'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CLIENTS_DATA = [
  { name: 'Pinnacle Group', score: '8.75', status: 'Accelerating', tag: 'Private Equity', contact: 'Sarah Jenkins (CIO)', email: 's.jenkins@pinnacle.com', lastActive: '2 hours ago', notes: 'Key mandate expansion being mapped by AG-01 Value Chain Specialist. Active interest in AI agentic workflows.' },
  { name: 'Meridian Capital', score: '8.00', status: 'Accelerating', tag: 'Asset Management', contact: 'David Vance (COO)', email: 'd.vance@meridian.com', lastActive: '5 hours ago', notes: 'AG-05 Goal Alignment Specialist refreshed board pack Q2 targets. Preparing outreach template for new compliance mandate.' },
  { name: 'NovaTech Solutions', score: '7.00', status: 'On Track', tag: 'Technology', contact: 'Elena Rostova (CTO)', email: 'e.rostova@novatech.io', lastActive: '1 day ago', notes: 'Steady progress. Tech stack optimization pattern running. No risk flags.' },
  { name: 'Apex Dynamics', score: '7.00', status: 'On Track', tag: 'Manufacturing', contact: 'Marcus Thorne (CEO)', email: 'm.thorne@apexdyn.com', lastActive: '1 day ago', notes: 'AG-04 Executive Gap Analyst completed relationship node mapping. Value chain proposal in draft.' },
  { name: 'Lumis Group', score: '5.00', status: 'Progressing', tag: 'Retail', contact: 'Chloe Bennett (VP Supply)', email: 'c.bennett@lumis.com', lastActive: '2 days ago', notes: 'Normal project tracking. Stakeholder engagement score flat.' },
  { name: 'Stratford & Co', score: '5.00', status: 'Progressing', tag: 'Financial Services', contact: 'Robert Chen (Managing Dir)', email: 'r.chen@stratford.com', lastActive: '3 days ago', notes: 'Consulting schedule running normally. Review meeting set for next Thursday.' },
  { name: 'Corestone Infra', score: '3.60', status: 'At Risk', tag: 'Logistics', contact: 'Arthur Pendelton (VP Ops)', email: 'a.pendelton@corestone.com', lastActive: '4 days ago', notes: 'No executive communication in 28 days. Relationship score down 2.1 pts. AG-08 flag raised.' },
  { name: 'Vantage Partners', score: '3.60', status: 'At Risk', tag: 'Logistics', contact: 'Linda Wu (CIO)', email: 'l.wu@vantagepartners.com', lastActive: '12 hours ago', notes: 'Budget cycle opens Jul 1. Service expansion opportunities identified but not proposed yet.' },
  { name: 'Redwood Advisors', score: '3.15', status: 'At Risk', tag: 'Healthcare', contact: 'Jane Sterling (VP Strategy)', email: 'j.sterling@redwood.com', lastActive: '5 days ago', notes: 'Slight drag on milestones. Exec alignment node weakened.' },
  { name: 'Drift Capital', score: '1.70', status: 'Stalling', tag: 'Venture Capital', contact: 'Thomas Vance (Partner)', email: 't.vance@driftcap.com', lastActive: '6 days ago', notes: 'Missed 2 major delivery dates. scope creep +40% with no corresponding billing change order.' },
  { name: 'Halcyon Systems', score: '1.65', status: 'Stalling', tag: 'Technology', contact: 'Greg House (CTO)', email: 'g.house@halcyonsystems.com', lastActive: '7 days ago', notes: 'Stall score 9.1. 3 missed milestones. Exec contact quiet for 7 weeks. Flagged email sentence: "push the stakeholder review to next month."' }
]

const AGENTS_DATA = [
  { id: 'AG-01', name: 'Value Chain Specialist', status: 'Idle', lastAction: 'Mapped Pinnacle Group stakeholder relationships', queries: 'Reads consulting reports, matches client organizational structures' },
  { id: 'AG-02', name: 'Exec Gap Analyst', status: 'Analyzing', lastAction: 'Reviewing Meridian Capital communications', queries: 'Scans for VP changes, email sentiment on decision makers' },
  { id: 'AG-03', name: 'Stall Detection Agent', status: 'Alerting', lastAction: 'Flagged Halcyon Systems delay keywords', queries: 'Detects "delay", "push back", "next month", "postpone" in Gmail' },
  { id: 'AG-04', name: 'Momentum Orchestrator', status: 'Idle', lastAction: 'Recalculated portfolio composite scores', queries: 'Compiles risk matrices and outputs Y-axis value chain mappings' },
  { id: 'AG-05', name: 'Goal Alignment Tracker', status: 'Analyzing', lastAction: 'Parsing NovaTech board pack Q2 goals', queries: 'Matches client strategic statements against project deliverables' },
  { id: 'AG-06', name: 'AI Displacement Scanner', status: 'Idle', lastAction: 'Updated risk score for Halcyon tech stack', queries: 'Scans for automation tools and scope erosion indicators' },
  { id: 'AG-07', name: 'Relationship Health Scorer', status: 'Idle', lastAction: 'Flagged Corestone lack of communication', queries: 'Triggers on no executive communication > 21 days' },
  { id: 'AG-08', name: 'Budget Cycle Monitor', status: 'Analyzing', lastAction: 'Scanning Vantage Partners fiscal calendar', queries: 'Tracks budget window openings and RFP timelines' },
  { id: 'AG-09', name: 'Defensive Play Selector', status: 'Idle', lastAction: 'Queued Executive Bridge pattern for Halcyon', queries: 'Recommends action cards based on risk profile' },
  { id: 'AG-10', name: 'Gmail Synthesizer', status: 'Analyzing', lastAction: 'Creating summary reports for Drift Capital', queries: 'Summarizes latest 5 emails from key accounts' },
  { id: 'AG-11', name: 'Pattern Library Engine', status: 'Idle', lastAction: 'Saved Executive Bridge sequence metrics', queries: 'Benchmarks engagement metrics pre- and post-pattern application' },
  { id: 'AG-12', name: 'Outreach Draft Generator', status: 'Idle', lastAction: 'Drafted email response for Halcyon Systems', queries: 'Generates context-aware, non-pushy follow-up drafts' }
]

const PATTERNS_DATA = [
  { name: 'The Executive Bridge', success: '94%', category: 'Relationship', description: 'Re-align project deliverables with board-level goals to bypass middle management barriers.', steps: ['Identify top 3 corporate objectives in annual report', 'Draft a 1-page executive summary linking milestones directly to those objectives', 'Schedule a 15-minute briefing directly with the sponsor executive'] },
  { name: 'Pre-emptive Scope Locking', success: '88%', category: 'Scope', description: 'Prevent margin compression by locking in next-phase requirements before the current phase finishes.', steps: ['Audit all ad-hoc requests from past 4 weeks', 'Create a change order template matching requested features', 'Present as a value-added phase extension bundle'] },
  { name: 'Value Chain Shift', success: '91%', category: 'Strategic Positioning', description: 'Position delivery work as high-value strategy work to protect against AI commoditization.', steps: ['Identify parts of the project that are automatable', 'Propose an oversight & governance mandate using our own custom agent tools', 'Reposition consulting team to focus on governance, not execution'] },
  { name: 'The Stalled Account Shakeup', success: '82%', category: 'Risk Mitigation', description: 'Triggered when communication halts. Send a zero-pressure message outlining project risks if left idle.', steps: ['Send the zero-pressure alignment email draft', 'Suggest pausing the billable hours temporarily to show goodwill', 'Offer a low-friction restart workshop'] }
]

const WORKFLOW_NODES = [
  { id: 'AG-10', x: 65, y: 70, label: 'GMAIL' },
  { id: 'AG-08', x: 65, y: 150, label: 'CALENDAR' },
  { id: 'AG-02', x: 65, y: 230, label: 'MEETINGS' },
  { id: 'AG-03', x: 242, y: 60, label: 'STALL DETECT' },
  { id: 'AG-01', x: 242, y: 120, label: 'VALUE CHAIN' },
  { id: 'AG-07', x: 242, y: 180, label: 'RELATIONSHIP' },
  { id: 'AG-05', x: 242, y: 240, label: 'GOAL ALIGN' },
  { id: 'AG-06', x: 420, y: 70, label: 'AI DISPLACE' },
  { id: 'AG-04', x: 420, y: 150, label: 'MOMENTUM', isMain: true },
  { id: 'AG-11', x: 420, y: 230, label: 'PATTERN LIB' },
  { id: 'AG-09', x: 600, y: 110, label: 'DEFENSE' },
  { id: 'AG-12', x: 600, y: 190, label: 'OUTREACH' }
]

const WORKFLOW_PATHS = [
  { id: 'p1', d: 'M 90 70 C 150 70 180 60 217 60', color: 'pink', dur: '2.8s', delay: '0s' },
  { id: 'p2', d: 'M 90 70 C 150 70 180 120 217 120', color: 'violet', dur: '3.2s', delay: '0.6s' },
  { id: 'p3', d: 'M 90 150 C 150 150 180 120 217 120', color: 'violet', dur: '2.5s', delay: '1.2s' },
  { id: 'p4', d: 'M 90 150 C 150 150 180 180 217 180', color: 'pink', dur: '3s', delay: '0.4s' },
  { id: 'p5', d: 'M 90 230 C 150 230 180 180 217 180', color: 'violet', dur: '2.7s', delay: '1.8s' },
  { id: 'p6', d: 'M 90 230 C 150 230 180 240 217 240', color: 'pink', dur: '3.5s', delay: '0.9s' },
  { id: 'p7', d: 'M 267 60 C 330 60 360 70 395 70', color: 'pink', dur: '3s', delay: '0.3s' },
  { id: 'p8', d: 'M 267 120 C 330 120 360 70 395 70', color: 'violet', dur: '2.8s', delay: '1.1s' },
  { id: 'p9', d: 'M 267 120 C 330 120 360 150 395 150', color: 'pink', dur: '3.2s', delay: '0.7s' },
  { id: 'p10', d: 'M 267 180 C 330 180 360 150 395 150', color: 'violet', dur: '3.5s', delay: '1.5s' },
  { id: 'p11', d: 'M 267 180 C 330 180 360 230 395 230', color: 'pink', dur: '2s', delay: '0.2s' },
  { id: 'p12', d: 'M 267 240 C 330 240 360 230 395 230', color: 'violet', dur: '2.5s', delay: '0.5s' },
  { id: 'p13', d: 'M 445 70 C 500 70 540 110 575 110', color: 'pink', dur: '3.1s', delay: '0.8s' },
  { id: 'p14', d: 'M 445 150 C 500 150 540 110 575 110', color: 'violet', dur: '2.4s', delay: '0.1s' },
  { id: 'p15', d: 'M 445 150 C 500 150 540 190 575 190', color: 'pink', dur: '2.9s', delay: '1.3s' },
  { id: 'p16', d: 'M 445 230 C 500 230 540 190 575 190', color: 'violet', dur: '3.3s', delay: '0.6s' }
]

export default function Dashboard() {
  const supabase = createClient()
  const router = useRouter()
  const [userInitial, setUserInitial] = useState('S')
  const [userName, setUserName] = useState('')
  const [activeTab, setActiveTab] = useState('portfolio_intelligence')
  const [selectedClient, setSelectedClient] = useState('Pinnacle Group')
  const [selectedAgent, setSelectedAgent] = useState('AG-03')
  const [selectedPattern, setSelectedPattern] = useState('The Executive Bridge')
  const [completedActions, setCompletedActions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [emailDraftBody, setEmailDraftBody] = useState('Hi Greg,\n\nI noticed we postponed the steering committee review. To ensure we maintain project momentum and don\'t slide back from key milestones, I suggest we schedule a quick 10-minute alignment sync next week.\n\nLet me know your thoughts.\n\nBest,\nDemo Team')
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [showToast, setShowToast] = useState<string | null>(null)
  
  // New States
  const [showDiagnosticsFor, setShowDiagnosticsFor] = useState<string | null>(null)
  const [expandedEngagement, setExpandedEngagement] = useState<string | null>(null)
  const [homeSubTab, setHomeSubTab] = useState('mails')
  const [notesText, setNotesText] = useState('')
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)

  useEffect(() => {
    const auth = supabase.auth
    auth.getUser()
      .then(({ data: { user } }) => {
        if (!user) {
          // If we are using placeholders in development, show mock user instead of redirecting
          if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-ref') || process.env.NODE_ENV === 'development') {
            setUserInitial('D')
            setUserName('Demo')
            return
          }
          router.push('/')
          return
        }
        const name = user.user_metadata?.full_name || user.email || 'S'
        setUserInitial(name.charAt(0).toUpperCase())
        setUserName(name.split(' ')[0])
      })
      .catch((err) => {
        console.warn('Auth check failed, using fallback demo user:', err)
        setUserInitial('D')
        setUserName('Demo')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      <style>{`
        /* ── SHELL ── */
        .shell { display: grid; grid-template-columns: 230px 1fr; grid-template-rows: 52px 1fr; min-height: 100vh; }
        .shell::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(255,46,191,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,46,191,0.018) 1px, transparent 1px); background-size: 44px 44px; pointer-events: none; z-index: 0; }
        .shell::after { content: ''; position: fixed; top: -120px; left: -120px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(155,48,217,0.07) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        /* ── TOPBAR ── */
        .topbar { grid-column: 1 / -1; grid-row: 1; display: flex; align-items: center; padding: 0 20px 0 0; border-bottom: 1px solid var(--border); background: var(--bg-2); position: sticky; top: 0; z-index: 200; }
        .topbar-brand { width: 230px; padding: 0 24px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; border-right: 1px solid var(--border); height: 100%; }
        .brand-logo { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.04em; color: var(--text-1); line-height: 1; }
        .brand-logo em { color: var(--pink); font-style: normal; }
        .brand-tag { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--pink); background: var(--pink-dim); border: 1px solid rgba(255,46,191,0.2); padding: 2px 6px; border-radius: 3px; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
        .topbar-search { flex: 1; padding: 0 20px; position: relative; }
        .search-wrap { max-width: 380px; position: relative; }
        .search-input { width: 100%; background: var(--bg-inset); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 8px 12px 8px 34px; color: var(--text-1); font-family: 'Outfit', sans-serif; font-size: 12px; outline: none; transition: border-color 0.2s; }
        .search-input::placeholder { color: var(--text-3); }
        .search-input:focus { border-color: rgba(255,46,191,0.25); }
        .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-3); font-size: 14px; pointer-events: none; }
        .topbar-right { display: flex; align-items: center; gap: 12px; margin-left: auto; }
        .live-badge { display: flex; align-items: center; gap: 6px; background: var(--bg-inset); border: 1px solid var(--border); padding: 5px 10px; border-radius: var(--r-sm); font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-2); }
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); animation: dot-pulse 2.5s ease-in-out infinite; flex-shrink: 0; }
        .icon-btn { width: 34px; height: 34px; background: var(--bg-inset); border: 1px solid var(--border); border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: var(--text-2); transition: all 0.15s; position: relative; flex-shrink: 0; }
        .icon-btn:hover { border-color: var(--border-md); color: var(--text-1); }
        .notif-pip { position: absolute; top: -2px; right: -2px; width: 14px; height: 14px; background: var(--pink); border-radius: 50%; font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 8px var(--pink-glow); }
        .user-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--pink-lo), var(--pink)); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 13px; color: #fff; cursor: pointer; flex-shrink: 0; border: 2px solid rgba(255,46,191,0.3); box-shadow: 0 0 12px rgba(255,46,191,0.2); }
        /* ── SIDEBAR ── */
        .sidebar { grid-column: 1; grid-row: 2; background: var(--bg-2); border-right: 1px solid var(--border); padding: 20px 0; display: flex; flex-direction: column; position: sticky; top: 52px; height: calc(100vh - 52px); overflow-y: auto; z-index: 10; }
        .nav-section { padding: 0 14px; margin-bottom: 24px; }
        .nav-section-title { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-3); padding: 0 10px; margin-bottom: 6px; }
        .nav-link { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--r-md); cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 13px; color: var(--text-2); transition: all 0.15s; margin-bottom: 2px; }
        .nav-link:hover { background: var(--bg-hover); color: var(--text-1); }
        .nav-link.active { background: var(--pink-dim); color: var(--pink-hi); border: 1px solid rgba(255,46,191,0.22); }
        .nav-link.active .nav-ico { color: var(--pink); }
        .nav-ico { font-size: 14px; width: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .nav-count { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; padding: 2px 7px; border-radius: 10px; }
        .nc-red { background: var(--red-dim); color: var(--red); }
        .nc-amber { background: var(--amber-dim); color: var(--amber); }
        .nc-pink { background: var(--pink-dim); color: var(--pink); }
        .sidebar-bottom { margin-top: auto; padding: 0 14px 4px; }
        .agent-status-card { background: var(--bg-inset); border: 1px solid var(--border); border-radius: var(--r-md); padding: 12px 14px; display: flex; align-items: center; gap: 12px; }
        .agent-num { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 28px; color: var(--pink); line-height: 1; text-shadow: 0 0 20px var(--pink-glow); }
        .agent-meta { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-2); letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.6; }
        /* ── MAIN ── */
        .main { grid-column: 2; grid-row: 2; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 18px; position: relative; z-index: 1; }
        .page-head { display: flex; align-items: flex-end; justify-content: space-between; animation: rise 0.5s ease both; }
        .page-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 26px; letter-spacing: -0.03em; color: var(--text-1); line-height: 1; }
        .page-title span { color: var(--pink); }
        .page-sub { margin-top: 5px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-3); letter-spacing: 0.06em; text-transform: uppercase; }
        .head-actions { display: flex; gap: 8px; align-items: center; }
        .btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--r-sm); font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
        .btn-ghost { background: transparent; border-color: var(--border); color: var(--text-2); }
        .btn-ghost:hover { border-color: var(--border-md); color: var(--text-1); background: var(--bg-card); }
        .btn-pink { background: linear-gradient(135deg, var(--pink), var(--violet)); color: #fff; box-shadow: 0 0 18px rgba(255,46,191,0.3); }
        .btn-pink:hover { box-shadow: 0 0 26px rgba(255,46,191,0.45); }
        .btn-red { background: transparent; border-color: var(--border); color: var(--text-3); }
        .btn-red:hover { border-color: rgba(239,68,68,0.3); color: var(--red); }
        /* ── FILTERS ── */
        .filter-row { display: flex; gap: 8px; align-items: center; animation: rise 0.5s ease 0.04s both; }
        .filter-chip { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; background: var(--bg-card); border: 1px solid var(--border); font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 500; color: var(--text-2); cursor: pointer; transition: all 0.15s; }
        .filter-chip:hover { border-color: var(--border-md); color: var(--text-1); }
        .filter-chip.active { background: var(--pink-dim); border-color: rgba(255,46,191,0.28); color: var(--pink-hi); }
        .chip-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        /* ── KPI ── */
        .kpi-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .kpi { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 18px; position: relative; overflow: hidden; transition: border-color 0.2s; animation: rise 0.4s ease both; }
        .kpi:hover { border-color: var(--border-md); }
        .kpi:nth-child(1){animation-delay:0.06s} .kpi:nth-child(2){animation-delay:0.10s} .kpi:nth-child(3){animation-delay:0.14s} .kpi:nth-child(4){animation-delay:0.18s} .kpi:nth-child(5){animation-delay:0.22s}
        .kpi::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--kpi-accent, var(--pink)); opacity: 0.55; }
        .kpi::after { content: ''; position: absolute; bottom: -20px; right: -20px; width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle, var(--kpi-accent, var(--pink)) 0%, transparent 70%); opacity: 0.08; pointer-events: none; }
        .kpi.green-kpi { --kpi-accent: var(--green); } .kpi.amber-kpi { --kpi-accent: var(--amber); } .kpi.red-kpi { --kpi-accent: var(--red); } .kpi.indigo-kpi { --kpi-accent: var(--indigo); }
        .kpi.green-kpi .kpi-icon-wrap { background: var(--green-dim); } .kpi.amber-kpi .kpi-icon-wrap { background: var(--amber-dim); } .kpi.red-kpi .kpi-icon-wrap { background: var(--red-dim); } .kpi.indigo-kpi .kpi-icon-wrap { background: var(--indigo-dim); }
        .kpi-main-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .kpi-icon-wrap { width: 28px; height: 28px; border-radius: var(--r-sm); background: var(--pink-dim); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
        .kpi-value { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 30px; letter-spacing: -0.03em; color: var(--text-1); line-height: 1; flex: 1; }
        .kpi-delta { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; padding: 2px 7px; border-radius: 4px; white-space: nowrap; }
        .delta-up { background: var(--green-dim); color: var(--green); } .delta-dn { background: var(--red-dim); color: var(--red); } .delta-flat { background: var(--bg-inset); color: var(--text-3); }
        .kpi-label { font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; color: var(--text-2); }
        /* ── HERO ROW ── */
        .hero-row { display: grid; grid-template-columns: 1fr 340px; gap: 16px; animation: rise 0.5s ease 0.12s both; }
        .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl); overflow: hidden; }
        .card-hd { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
        .card-hd-title { display: flex; align-items: center; gap: 8px; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: -0.01em; color: var(--text-1); }
        .title-pip { width: 7px; height: 7px; border-radius: 50%; background: var(--pink); box-shadow: 0 0 8px var(--pink-glow); flex-shrink: 0; }
        .tab-group { display: flex; gap: 4px; background: var(--bg-inset); border: 1px solid var(--border); border-radius: 20px; padding: 3px; }
        .tab { padding: 4px 12px; border-radius: 16px; font-family: 'JetBrains Mono', monospace; font-size: 10px; cursor: pointer; color: var(--text-3); transition: all 0.15s; }
        .tab:hover { color: var(--text-2); }
        .tab.active { background: var(--pink-dim); color: var(--pink-hi); border: 1px solid rgba(255,46,191,0.2); }
        .momentum-body { display: grid; grid-template-columns: 180px 1fr; min-height: 280px; }
        .momentum-stats { padding: 20px; border-right: 1px solid var(--border); display: flex; flex-direction: column; gap: 20px; }
        .stat-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-2); letter-spacing: 0.10em; text-transform: uppercase; margin-bottom: 6px; }
        .stat-num { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 38px; letter-spacing: -0.04em; color: var(--text-1); line-height: 1; display: flex; align-items: flex-end; gap: 6px; }
        .stat-badge { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; padding: 2px 7px; border-radius: 4px; margin-bottom: 5px; }
        .sb-up { background: var(--green-dim); color: var(--green); } .sb-dn { background: var(--red-dim); color: var(--red); } .sb-pink { background: var(--pink-dim); color: var(--pink); }
        .stat-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.06em; }
        .stat-rule { height: 1px; background: var(--border); }
        .chart-wrap { padding: 20px 20px 10px; display: flex; flex-direction: column; gap: 8px; position: relative; overflow: hidden; }
        .right-stack { display: flex; flex-direction: column; gap: 16px; }
        .client-rows { padding: 4px 0; }
        .client-row { display: flex; align-items: center; gap: 12px; padding: 11px 20px; border-bottom: 1px solid var(--border); transition: background 0.15s; cursor: pointer; }
        .client-row:hover { background: var(--bg-hover); } .client-row:last-child { border-bottom: none; }
        .client-logo { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 11px; flex-shrink: 0; }
        .cl-a { background: linear-gradient(135deg, #1A1A3A, #2A1A4A); color: var(--pink-hi); border: 1px solid rgba(255,46,191,0.2); }
        .cl-b { background: linear-gradient(135deg, #1A2A1A, #0F2A0F); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
        .cl-c { background: linear-gradient(135deg, #2A1A1A, #3A1212); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
        .cl-d { background: linear-gradient(135deg, #1A2030, #102040); color: var(--indigo); border: 1px solid rgba(129,140,248,0.2); }
        .cl-e { background: linear-gradient(135deg, #2A2010, #3A2808); color: var(--amber); border: 1px solid rgba(245,158,11,0.2); }
        .client-info { flex: 1; min-width: 0; }
        .client-name { font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 12px; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .client-tag { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.06em; }
        .dot-progress { display: flex; gap: 3px; align-items: center; flex-shrink: 0; }
        .dp-dot { width: 6px; height: 6px; border-radius: 50%; }
        .score-pct { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; color: var(--text-2); margin-left: 6px; flex-shrink: 0; width: 28px; text-align: right; }
        .donut-body { padding: 18px 20px; display: flex; align-items: center; gap: 20px; }
        .donut-legend { flex: 1; display: flex; flex-direction: column; gap: 9px; }
        .dl-row { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-2); }
        .dl-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .dl-val { margin-left: auto; font-weight: 500; color: var(--text-1); }
        .donut-center-wrap { position: relative; width: 110px; height: 110px; flex-shrink: 0; }
        .donut-inner-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; pointer-events: none; }
        .donut-big { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 22px; color: var(--text-1); line-height: 1; letter-spacing: -0.03em; }
        .donut-small { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-3); letter-spacing: 0.06em; text-transform: uppercase; margin-top: 2px; }
        /* ── QUADRANT ── */
        .quadrant-card { animation: rise 0.5s ease 0.18s both; }
        .quadrant-body { display: grid; grid-template-columns: 1fr 220px; }
        .quad-plot { padding: 20px; border-right: 1px solid var(--border); }
        .quad-legend { display: flex; gap: 16px; margin-top: 10px; flex-wrap: wrap; }
        .ql-item { display: flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-2); letter-spacing: 0.06em; text-transform: uppercase; }
        .ql-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .quad-side { padding: 20px 16px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
        .qside-title { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
        .qside-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: var(--bg-inset); border-radius: var(--r-sm); border: 1px solid var(--border); cursor: pointer; transition: border-color 0.15s; }
        .qside-item:hover { border-color: rgba(255,46,191,0.2); }
        .qside-status { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .qside-name { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 600; color: var(--text-1); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qside-score { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; flex-shrink: 0; }
        /* ── BOTTOM ROW ── */
        .bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; animation: rise 0.5s ease 0.22s both; }
        .action-list { display: flex; flex-direction: column; }
        .action-item { display: flex; align-items: stretch; gap: 0; border-bottom: 1px solid var(--border); transition: background 0.15s; cursor: pointer; }
        .action-item:hover { background: var(--bg-hover); } .action-item:last-child { border-bottom: none; }
        .action-bar { width: 3px; flex-shrink: 0; }
        .urg-crit .action-bar { background: var(--red); } .urg-high .action-bar { background: var(--amber); } .urg-med .action-bar { background: var(--indigo); }
        .action-body { flex: 1; padding: 14px 16px; min-width: 0; }
        .action-client-name { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px; color: var(--text-1); margin-bottom: 4px; }
        .action-desc { font-family: 'Outfit', sans-serif; font-size: 12px; color: var(--text-2); line-height: 1.5; margin-bottom: 8px; }
        .action-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .atag { font-family: 'JetBrains Mono', monospace; font-size: 9px; padding: 2px 7px; border-radius: 4px; letter-spacing: 0.06em; }
        .atag-agent { background: var(--pink-dim); color: var(--pink); }
        .atag-date { background: var(--amber-dim); color: var(--amber); }
        .atag-default { background: var(--bg-inset); color: var(--text-3); border: 1px solid var(--border); }
        .action-badge { padding: 14px 12px; display: flex; align-items: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: 0.06em; flex-shrink: 0; }
        .urg-crit .action-badge { color: var(--red); } .urg-high .action-badge { color: var(--amber); } .urg-med .action-badge { color: var(--indigo); }
        /* ── STREAM ── */
        .stream-list { display: flex; flex-direction: column; gap: 0; max-height: 340px; overflow-y: auto; }
        .stream-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 20px; border-bottom: 1px solid var(--border); }
        .stream-item:last-child { border-bottom: none; }
        .stream-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
        .stream-body { flex: 1; min-width: 0; }
        .stream-agent { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 3px; }
        .stream-msg { font-family: 'Outfit', sans-serif; font-size: 12px; color: var(--text-2); line-height: 1.4; }
        .stream-time { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); flex-shrink: 0; margin-top: 3px; }

        /* ── CUSTOM TABS ── */
        .tab-panel-grid { display: grid; grid-template-columns: 320px 1fr; gap: 16px; min-height: 500px; }
        .list-panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl); display: flex; flex-direction: column; overflow: hidden; }
        .detail-panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl); padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .tab-list-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.15s; }
        .tab-list-item:hover { background: var(--bg-hover); }
        .tab-list-item.active { background: var(--pink-dim); border-right: 3px solid var(--pink); }
        .interactive-card { transition: transform 0.2s, border-color 0.2s; cursor: pointer; }
        .interactive-card:hover { transform: translateY(-2px); border-color: var(--border-hi); }
        .success-rate-badge { background: var(--green-dim); color: var(--green); padding: 3px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; }
        .badge-red { background: var(--red-dim); color: var(--red); padding: 3px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; }
        .badge-amber { background: var(--amber-dim); color: var(--amber); padding: 3px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; }
        .badge-indigo { background: var(--indigo-dim); color: var(--indigo); padding: 3px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; }
        .badge-violet { background: var(--violet-dim); color: var(--pink-hi); padding: 3px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; }
        @keyframes border-wave {
          0%,100% { border-color: rgba(255,46,191,0.15); }
          50%      { border-color: rgba(155,48,217,0.35); }
        }
        .workflow-scene {
          background: var(--bg-card); border: 1px solid rgba(255,46,191,0.1);
          border-radius: var(--r-xl); padding: 40px 24px 32px;
          animation: border-wave 6s ease infinite;
        }
      `}</style>

      <div className="shell">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-brand">
            <div className="brand-logo">Qn<em>sult</em></div>
            <div className="brand-tag">Gemini · ADK</div>
          </div>
          <div className="topbar-search">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input className="search-input" type="text" placeholder="Search clients, agents, actions…" />
            </div>
          </div>
          <div className="topbar-right">
            <div className="live-badge">
              <div className="live-dot" />
              12 agents live
            </div>
            <div className="icon-btn">
              🔔<span className="notif-pip">3</span>
            </div>
            <div className="icon-btn">⋮</div>
            <div className="user-avatar" title={userName} onClick={() => setActiveTab('settings')} style={{ cursor: 'pointer' }}>{userInitial}</div>
            <button className="btn btn-red" onClick={signOut} style={{ fontSize: 11, padding: '6px 12px' }}>Sign out</button>
          </div>
        </header>

        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="nav-section">
            {[
              { id: 'home', ico: '⌂', label: 'Home' },
              { id: 'clients', ico: '◎', label: 'Clients' },
              { id: 'engagements', ico: '⟁', label: 'Engagements' },
              { id: 'action_items', ico: '◈', label: 'Action Items', count: '3', countClass: 'nc-red' },
              { id: 'agent_events', ico: '⬡', label: 'Agent Workflow' },
              { id: 'portfolio_intelligence', ico: '▦', label: 'Portfolio Intelligence' },
            ].map((item) => (
              <div 
                key={item.id} 
                className={`nav-link${activeTab === item.id ? ' active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-ico">{item.ico}</span>
                {item.label}
                {item.count && <span className={`nav-count ${item.countClass}`}>{item.count}</span>}
              </div>
            ))}
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Risk</div>
            <div 
              className={`nav-link${activeTab === 'stall_detection' ? ' active' : ''}`}
              onClick={() => setActiveTab('stall_detection')}
            >
              <span className="nav-ico">⚠</span>Stall Detection<span className="nav-count nc-red">2</span>
            </div>
            <div 
              className={`nav-link${activeTab === 'ai_danger_zone' ? ' active' : ''}`}
              onClick={() => setActiveTab('ai_danger_zone')}
            >
              <span className="nav-ico">◌</span>AI Danger Zone<span className="nav-count nc-amber">5</span>
            </div>
            <div 
              className={`nav-link${activeTab === 'competitive_risk' ? ' active' : ''}`}
              onClick={() => setActiveTab('competitive_risk')}
            >
              <span className="nav-ico">⊕</span>Competitive Risk
            </div>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Workstation</div>
            <div 
              className={`nav-link${activeTab === 'pattern_library' ? ' active' : ''}`}
              onClick={() => setActiveTab('pattern_library')}
            >
              <span className="nav-ico">◇</span>Pattern Library<span className="nav-count nc-pink">14</span>
            </div>
            <div 
              className={`nav-link${activeTab === 'settings' ? ' active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="nav-ico">⚙</span>Settings
            </div>
          </div>
          <div className="sidebar-bottom">
            <div className="agent-status-card">
              <div className="agent-num">12</div>
              <div className="agent-meta">Agents<br />Running</div>
              <div className="live-dot" style={{ marginLeft: 'auto' }} />
            </div>
          </div>
        </nav>

        {/* MAIN */}
        <main className="main" style={{ flex: 1, minHeight: 'calc(100vh - 52px)' }}>

          {/* PORTFOLIO INTELLIGENCE TAB */}
          {activeTab === 'portfolio_intelligence' && (
            <>
              {/* Page header */}
              <div className="page-head">
                <div>
                  <div className="page-title">Portfolio <span>Intelligence</span></div>
                  <div className="page-sub">Friday, 6 June 2026 · W-23 · Synced 07:31 UTC</div>
                </div>
                <div className="head-actions">
                  <button className="btn btn-ghost" onClick={() => { setShowToast('Filters cleared'); setTimeout(() => setShowToast(null), 3000) }}>≡ Filters</button>
                  <button className="btn btn-ghost" onClick={() => { setShowToast('Viewing June data'); setTimeout(() => setShowToast(null), 3000) }}>⊞ This Month</button>
                  <button className="btn btn-pink" onClick={() => { setShowToast('Momentum scan initiated across 11 accounts'); setTimeout(() => setShowToast(null), 3000) }}>▶ Run Momentum</button>
                </div>
              </div>

              {/* Filter row */}
              <div className="filter-row">
                <div className="filter-chip active"><span className="chip-dot" />All Clients (11)</div>
                <div className="filter-chip" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Drift Capital'); setActiveTab('clients'); }}>Stalling (2)</div>
                <div className="filter-chip" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Corestone Infra'); setActiveTab('clients'); }}>At Risk (3)</div>
                <div className="filter-chip" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Pinnacle Group'); setActiveTab('clients'); }}>Accelerating (4)</div>
              </div>

              {/* KPI row */}
              <div className="kpi-row">
                <div className="kpi green-kpi interactive-card" onClick={() => { setSelectedClient('Pinnacle Group'); setActiveTab('clients') }}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--green)' }}>↗</div><div className="kpi-value">4</div><span className="kpi-delta delta-up">+2 wk</span></div>
                  <div className="kpi-label">Accelerating Accounts</div>
                </div>
                <div className="kpi amber-kpi interactive-card" onClick={() => setActiveTab('ai_danger_zone')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--amber)' }}>⚠</div><div className="kpi-value">3</div><span className="kpi-delta delta-dn">+1</span></div>
                  <div className="kpi-label">At Risk Accounts</div>
                </div>
                <div className="kpi red-kpi interactive-card" onClick={() => setActiveTab('stall_detection')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--red)' }}>↓</div><div className="kpi-value">2</div><span className="kpi-delta delta-flat">—</span></div>
                  <div className="kpi-label">Stalling Accounts</div>
                </div>
                <div className="kpi indigo-kpi interactive-card" onClick={() => setActiveTab('agent_events')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--indigo)' }}>⬡</div><div className="kpi-value">12</div><span className="kpi-delta delta-up">94%</span></div>
                  <div className="kpi-label">Agents Live</div>
                </div>
                <div className="kpi interactive-card" onClick={() => { setShowToast('Composite score computed from 12 agent inputs.'); setTimeout(() => setShowToast(null), 3000) }}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap">◈</div><div className="kpi-value">6.8</div><span className="kpi-delta delta-up">+0.4</span></div>
                  <div className="kpi-label">Avg Composite Score</div>
                </div>
              </div>

              {/* Hero row */}
              <div className="hero-row">
                <div className="card">
                  <div className="card-hd">
                    <div className="card-hd-title"><div className="title-pip" />Account Momentum</div>
                    <div className="tab-group">
                      <div className="tab active">Score</div>
                      <div className="tab" onClick={() => { setShowToast('Delta trends sync in progress'); setTimeout(() => setShowToast(null), 3000) }}>Δ Trend</div>
                      <div className="tab" onClick={() => setActiveTab('ai_danger_zone')}>AI Risk</div>
                    </div>
                  </div>
                  <div className="momentum-body">
                    <div className="momentum-stats">
                      <div>
                        <div className="stat-label">Portfolio Score</div>
                        <div className="stat-num">6.8<span className="stat-badge sb-up">↑ 12%</span></div>
                        <div className="stat-sub">Composite avg · W-23</div>
                      </div>
                      <div className="stat-rule" />
                      <div>
                        <div className="stat-label">Active Accounts</div>
                        <div className="stat-num">11<span className="stat-badge sb-pink">+2 mo</span></div>
                        <div className="stat-sub">Total managed</div>
                      </div>
                      <div className="stat-rule" />
                      <div>
                        <div className="stat-label">Critical Actions</div>
                        <div className="stat-num">7<span className="stat-badge sb-dn">-3 wk</span></div>
                        <div className="stat-sub">Pending in queue</div>
                      </div>
                    </div>
                    <div className="chart-wrap">
                      <svg viewBox="0 0 400 210" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
                        <defs>
                          <filter id="line-glow" x="-20%" y="-80%" width="140%" height="260%">
                            <feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                          <filter id="dot-glow-f" x="-400%" y="-400%" width="900%" height="900%">
                            <feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF2EBF" stopOpacity="0.28"/>
                            <stop offset="60%" stopColor="#FF2EBF" stopOpacity="0.07"/>
                            <stop offset="100%" stopColor="#FF2EBF" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <g stroke="rgba(255,255,255,0.045)" strokeWidth="1">
                          <line x1="30" y1="10" x2="390" y2="10"/><line x1="30" y1="54" x2="390" y2="54"/>
                          <line x1="30" y1="98" x2="390" y2="98"/><line x1="30" y1="141" x2="390" y2="141"/><line x1="30" y1="185" x2="390" y2="185"/>
                        </g>
                        <text x="24" y="14" textAnchor="end" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.18)">10</text>
                        <text x="24" y="58" textAnchor="end" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.18)">7.5</text>
                        <text x="24" y="102" textAnchor="end" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.18)">5.0</text>
                        <text x="24" y="145" textAnchor="end" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.18)">2.5</text>
                        <text x="24" y="189" textAnchor="end" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.18)">0</text>
                        <line x1="30" y1="71" x2="390" y2="71" stroke="rgba(129,140,248,0.22)" strokeWidth="1" strokeDasharray="4 5"/>
                        <text x="36" y="68" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(129,140,248,0.42)" letterSpacing="0.08em">on-track threshold</text>
                        <path d="M 30,112 C 45,109 66,104 81,101 C 97,98 118,97 133,94 C 149,92 169,86 184,84 C 200,82 221,78 236,78 C 252,78 272,83 287,82 C 302,81 323,75 338,73 C 354,71 374,68 390,66 L 390,185 L 30,185 Z" fill="url(#area-fill)"/>
                        <path d="M 30,112 C 45,109 66,104 81,101 C 97,98 118,97 133,94 C 149,92 169,86 184,84 C 200,82 221,78 236,78 C 252,78 272,83 287,82 C 302,81 323,75 338,73 C 354,71 374,68 390,66" fill="none" stroke="#FF2EBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#line-glow)"/>
                        <g fill="#FF2EBF" fillOpacity="0.35">
                          <circle cx="30" cy="112" r="2.5"/><circle cx="81" cy="101" r="2.5"/><circle cx="133" cy="94" r="2.5"/>
                          <circle cx="184" cy="84" r="2.5"/><circle cx="236" cy="78" r="2.5"/><circle cx="287" cy="82" r="2.5"/><circle cx="338" cy="73" r="2.5"/>
                        </g>
                        <line x1="390" y1="67" x2="390" y2="185" stroke="rgba(255,46,191,0.13)" strokeWidth="1" strokeDasharray="3 4"/>
                        <circle cx="390" cy="66" r="5" fill="#FF2EBF" filter="url(#dot-glow-f)"/>
                        <circle cx="390" cy="66" r="5" fill="#FF2EBF"/>
                        <circle cx="390" cy="66" r="10" fill="none" stroke="#FF2EBF" strokeWidth="1" opacity="0.5" className="current-ring"/>
                        <circle cx="390" cy="66" r="16" fill="none" stroke="#FF2EBF" strokeWidth="0.5" opacity="0.25" className="current-ring" style={{ animationDelay: '0.75s' }}/>
                        <text x="378" y="55" textAnchor="end" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700" fill="#FF71D5">6.8</text>
                        <g fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle">
                          {['W-16','W-17','W-18','W-19','W-20','W-21','W-22'].map((w, i) => (
                            <text key={w} x={30 + i * 51.4} y="202" fill="rgba(255,255,255,0.18)">{w}</text>
                          ))}
                          <text x="390" y="202" fill="#FF71D5">W-23</text>
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="right-stack">
                  <div className="card">
                    <div className="card-hd">
                      <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--indigo)', boxShadow: '0 0 8px var(--indigo-dim)' }} />Client Status</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>11 accounts</div>
                    </div>
                    <div className="client-rows">
                      {[
                        { cls: 'cl-a', initials: 'PG', name: 'Pinnacle Group', tag: 'Private Equity', filled: 5, color: 'var(--pink)', glow: 'var(--pink-glow)', pct: '87%' },
                        { cls: 'cl-b', initials: 'MC', name: 'Meridian Capital', tag: 'Asset Management', filled: 4, color: 'var(--green)', glow: '', pct: '80%' },
                        { cls: 'cl-d', initials: 'AD', name: 'Apex Dynamics', tag: 'Manufacturing', filled: 3, color: 'var(--indigo)', glow: '', pct: '70%' },
                        { cls: 'cl-e', initials: 'VP', name: 'Vantage Partners', tag: 'Logistics', filled: 2, color: 'var(--amber)', glow: '', pct: '36%' },
                        { cls: 'cl-c', initials: 'HS', name: 'Halcyon Systems', tag: 'Technology', filled: 1, color: 'var(--red)', glow: '', pct: '17%' },
                      ].map((c) => (
                        <div className="client-row" key={c.name} style={{ cursor: 'pointer' }} onClick={() => {
                          setSelectedClient(c.name)
                          setActiveTab('clients')
                        }}>
                          <div className={`client-logo ${c.cls}`}>{c.initials}</div>
                          <div className="client-info">
                            <div className="client-name">{c.name}</div>
                            <div className="client-tag">{c.tag}</div>
                          </div>
                          <div className="dot-progress">
                            {Array.from({ length: 8 }, (_, i) => (
                              <div key={i} className="dp-dot" style={{ background: c.color, opacity: i < c.filled ? 1 : 0.14 }} />
                            ))}
                          </div>
                          <span className="score-pct" style={{ color: c.color }}>{c.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-hd">
                      <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--violet)', boxShadow: '0 0 8px var(--violet-dim)' }} />Portfolio Split</div>
                    </div>
                    <div className="donut-body">
                      <div className="donut-legend">
                        {[
                          { color: 'var(--pink)', glow: 'var(--pink-glow)', label: 'Accelerating', val: '36%', valColor: 'var(--pink)' },
                          { color: 'var(--indigo)', label: 'On Track', val: '18%' },
                          { color: 'var(--violet)', label: 'Progressing', val: '19%' },
                          { color: 'var(--amber)', label: 'At Risk', val: '18%' },
                          { color: 'var(--red)', label: 'Stalling', val: '9%' },
                        ].map((d) => (
                          <div className="dl-row" key={d.label}>
                            <div className="dl-dot" style={{ background: d.color, ...(d.glow && { boxShadow: `0 0 6px ${d.glow}` }) }} />
                            {d.label}
                            <span className="dl-val" style={d.valColor ? { color: d.valColor } : {}}>{d.val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="donut-center-wrap">
                        <svg viewBox="0 0 110 110" width="110" height="110">
                          <defs><filter id="glow-pink"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                          <circle cx="55" cy="55" r="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10"/>
                          <circle cx="55" cy="55" r="40" fill="none" stroke="#EF4444" strokeWidth="10" strokeDasharray="22.6 228.7" strokeDashoffset="0" strokeLinecap="round"/>
                          <circle cx="55" cy="55" r="40" fill="none" stroke="#F59E0B" strokeWidth="10" strokeDasharray="45.2 206.1" strokeDashoffset="-22.6" strokeLinecap="round"/>
                          <circle cx="55" cy="55" r="40" fill="none" stroke="#9B30D9" strokeWidth="10" strokeDasharray="47.7 203.6" strokeDashoffset="-67.8" strokeLinecap="round"/>
                          <circle cx="55" cy="55" r="40" fill="none" stroke="#818CF8" strokeWidth="10" strokeDasharray="45.2 206.1" strokeDashoffset="-115.5" strokeLinecap="round"/>
                          <circle cx="55" cy="55" r="40" fill="none" stroke="#FF2EBF" strokeWidth="10" strokeDasharray="90.5 160.8" strokeDashoffset="-160.7" strokeLinecap="round" filter="url(#glow-pink)"/>
                        </svg>
                        <div className="donut-inner-text">
                          <div className="donut-big">100%</div>
                          <div className="donut-small">Total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-Axis Map */}
              <div className="card quadrant-card">
                <div className="card-hd">
                  <div className="card-hd-title"><div className="title-pip" />Two-Axis Portfolio Map</div>
                  <div className="tab-group">
                    <div className="tab active">Live</div>
                    <div className="tab" onClick={() => { setShowToast('WoW trends sync active'); setTimeout(() => setShowToast(null), 3000) }}>Δ WoW</div>
                    <div className="tab" onClick={() => setActiveTab('ai_danger_zone')}>AI Exposure</div>
                  </div>
                </div>
                <div className="quadrant-body">
                  <div className="quad-plot">
                    <svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
                      <defs>
                        <radialGradient id="danger-zone" cx="50%" cy="100%" r="60%"><stop offset="0%" stopColor="#EF4444" stopOpacity="0.12"/><stop offset="100%" stopColor="#EF4444" stopOpacity="0"/></radialGradient>
                        <radialGradient id="strat-zone" cx="100%" cy="0%" r="60%"><stop offset="0%" stopColor="#FF2EBF" stopOpacity="0.08"/><stop offset="100%" stopColor="#FF2EBF" stopOpacity="0"/></radialGradient>
                        <linearGradient id="momentum-arrow" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#818CF8" stopOpacity="0.5"/><stop offset="100%" stopColor="#FF2EBF" stopOpacity="0.5"/></linearGradient>
                        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,46,191,0.6)"/></marker>
                      </defs>
                      <rect x="46" y="256" width="418" height="48" fill="url(#danger-zone)" rx="2"/>
                      <rect x="258" y="16" width="206" height="160" fill="url(#strat-zone)" rx="2"/>
                      <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
                        <line x1="46" y1="16" x2="46" y2="304"/><line x1="46" y1="304" x2="464" y2="304"/>
                        <line x1="464" y1="16" x2="464" y2="304"/><line x1="46" y1="16" x2="464" y2="16"/>
                      </g>
                      <line x1="255" y1="16" x2="255" y2="304" stroke="rgba(255,255,255,0.07)" strokeDasharray="4 5" strokeWidth="1"/>
                      <line x1="46" y1="160" x2="464" y2="160" stroke="rgba(255,255,255,0.07)" strokeDasharray="4 5" strokeWidth="1"/>
                      <line x1="135" y1="16" x2="135" y2="304" stroke="rgba(245,158,11,0.22)" strokeDasharray="3 6" strokeWidth="1.5"/>
                      <text x="138" y="30" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(245,158,11,0.4)" letterSpacing="0.12em">THE WALL</text>
                      <text x="54" y="292" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(239,68,68,0.35)" letterSpacing="0.1em">AI DANGER ZONE</text>
                      <text x="456" y="30" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(255,46,191,0.35)" textAnchor="end" letterSpacing="0.1em">STRATEGIC PARTNERSHIP</text>
                      <path d="M 80 290 L 420 40" stroke="url(#momentum-arrow)" strokeWidth="1.5" strokeDasharray="6 5" markerEnd="url(#arrowhead)" fill="none"/>
                      <text x="255" y="318" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.18)" textAnchor="middle" letterSpacing="0.08em">RELATIONSHIP DURATION  →  X</text>
                      <text x="14" y="160" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.18)" textAnchor="middle" transform="rotate(-90, 14, 160)" letterSpacing="0.08em">VALUE CHAIN  →  Y</text>
                      
                      {/* Nodes */}
                      <g className="qpulse"><circle cx="422" cy="59" r="14" fill="rgba(255,46,191,0.06)"/></g>
                      <circle cx="422" cy="59" r="8" fill="#FF2EBF" fillOpacity="0.15" stroke="#FF2EBF" strokeWidth="1.5"/>
                      <circle cx="422" cy="59" r="4" fill="#FF2EBF"/>
                      <text x="432" y="56" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Pinnacle Group'); setActiveTab('clients'); }}>Pinnacle</text>
                      
                      <circle cx="389" cy="80" r="8" fill="rgba(255,46,191,0.1)" stroke="#FF2EBF" strokeWidth="1.5" strokeOpacity="0.7"/>
                      <circle cx="389" cy="80" r="4" fill="#FF2EBF" fillOpacity="0.8"/>
                      <text x="399" y="77" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Meridian Capital'); setActiveTab('clients'); }}>Meridian</text>
                      
                      <circle cx="343" cy="106" r="8" fill="rgba(129,140,248,0.1)" stroke="#818CF8" strokeWidth="1.5" strokeOpacity="0.7"/>
                      <circle cx="343" cy="106" r="4" fill="#818CF8" fillOpacity="0.8"/>
                      <text x="353" y="103" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Apex Dynamics'); setActiveTab('clients'); }}>Apex Dyn.</text>
                      
                      <circle cx="318" cy="88" r="8" fill="rgba(129,140,248,0.1)" stroke="#818CF8" strokeWidth="1.5" strokeOpacity="0.7"/>
                      <circle cx="318" cy="88" r="4" fill="#818CF8" fillOpacity="0.8"/>
                      <text x="328" y="85" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('NovaTech Solutions'); setActiveTab('clients'); }}>NovaTech</text>
                      
                      <circle cx="247" cy="154" r="8" fill="rgba(155,48,217,0.1)" stroke="#9B30D9" strokeWidth="1.5" strokeOpacity="0.7"/>
                      <circle cx="247" cy="154" r="4" fill="#9B30D9" fillOpacity="0.8"/>
                      <text x="257" y="151" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Stratford & Co'); setActiveTab('clients'); }}>Stratford</text>
                      
                      <circle cx="276" cy="175" r="8" fill="rgba(155,48,217,0.1)" stroke="#9B30D9" strokeWidth="1.5" strokeOpacity="0.7"/>
                      <circle cx="276" cy="175" r="4" fill="#9B30D9" fillOpacity="0.8"/>
                      <text x="286" y="172" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Lumis Group'); setActiveTab('clients'); }}>Lumis</text>
                      
                      <circle cx="180" cy="189" r="8" fill="rgba(245,158,11,0.1)" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.7"/>
                      <circle cx="180" cy="189" r="4" fill="#F59E0B" fillOpacity="0.8"/>
                      <text x="190" y="186" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Vantage Partners'); setActiveTab('clients'); }}>Vantage</text>
                      
                      <circle cx="163" cy="203" r="8" fill="rgba(245,158,11,0.1)" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.7"/>
                      <circle cx="163" cy="203" r="4" fill="#F59E0B" fillOpacity="0.8"/>
                      <text x="173" y="200" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Redwood Advisors'); setActiveTab('clients'); }}>Redwood</text>
                      
                      <circle cx="213" cy="212" r="8" fill="rgba(245,158,11,0.1)" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.7"/>
                      <circle cx="213" cy="212" r="4" fill="#F59E0B" fillOpacity="0.8"/>
                      <text x="223" y="209" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Corestone Infra'); setActiveTab('clients'); }}>Corestone</text>
                      
                      <g className="qpulse"><circle cx="121" cy="261" r="12" fill="rgba(239,68,68,0.06)"/></g>
                      <circle cx="121" cy="261" r="8" fill="rgba(239,68,68,0.12)" stroke="#EF4444" strokeWidth="1.5"/>
                      <circle cx="121" cy="261" r="4" fill="#EF4444"/>
                      <text x="131" y="258" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="#EF4444" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Halcyon Systems'); setActiveTab('clients'); }}>Halcyon ⚠</text>
                      
                      <circle cx="138" cy="270" r="8" fill="rgba(239,68,68,0.12)" stroke="#EF4444" strokeWidth="1.5"/>
                      <circle cx="138" cy="270" r="4" fill="#EF4444"/>
                      <text x="148" y="281" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="#EF4444" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Drift Capital'); setActiveTab('clients'); }}>Drift ⚠</text>
                    </svg>
                    <div className="quad-legend">
                      {[['var(--pink)', 'var(--pink-glow)', 'Accelerating'], ['var(--indigo)', '', 'On Track'], ['var(--violet)', '', 'Progressing'], ['var(--amber)', '', 'At Risk'], ['var(--red)', '', 'Stalling']].map(([c, g, l]) => (
                        <div className="ql-item" key={l}><div className="ql-dot" style={{ background: c, ...(g && { boxShadow: `0 0 5px ${g}` }) }} />{l}</div>
                      ))}
                    </div>
                  </div>
                  <div className="quad-side">
                    <div className="qside-title">Portfolio Rank</div>
                    {[
                      { name: 'Pinnacle Group', score: '8.75', color: 'var(--pink)', glow: true },
                      { name: 'Meridian Capital', score: '8.00', color: 'var(--pink)' },
                      { name: 'NovaTech Solutions', score: '7.00', color: 'var(--indigo)' },
                      { name: 'Apex Dynamics', score: '7.00', color: 'var(--indigo)' },
                      { name: 'Lumis Group', score: '5.00', color: 'var(--violet)' },
                      { name: 'Stratford & Co', score: '5.00', color: 'var(--violet)' },
                      { name: 'Corestone Infra', score: '3.60', color: 'var(--amber)' },
                      { name: 'Vantage Partners', score: '3.60', color: 'var(--amber)' },
                      { name: 'Redwood Advisors', score: '3.15', color: 'var(--amber)' },
                      { name: 'Drift Capital', score: '1.70', color: 'var(--red)' },
                      { name: 'Halcyon Systems', score: '1.65', color: 'var(--red)', highlight: true },
                    ].map((r) => (
                      <div key={r.name} className="qside-item" style={r.highlight ? { borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', cursor: 'pointer' } : { cursor: 'pointer' }} onClick={() => {
                        setSelectedClient(r.name)
                        setActiveTab('clients')
                      }}>
                        <div className="qside-status" style={{ background: r.color, ...(r.glow && { boxShadow: `0 0 5px ${r.color}` }), ...(r.color === 'var(--red)' && { animation: 'dot-pulse 1.5s ease-in-out infinite' }) }} />
                        <div className="qside-name" style={r.highlight ? { color: 'var(--red)' } : {}}>{r.name}</div>
                        <div className="qside-score" style={{ color: r.color }}>{r.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div className="bottom-row">
                <div className="card">
                  <div className="card-hd">
                    <div className="card-hd-title">
                      <div className="title-pip" style={{ background: 'var(--red)', boxShadow: '0 0 6px rgba(239,68,68,0.4)', animation: 'dot-pulse 2s ease-in-out infinite' }} />
                      Priority Queue
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>7 actions</div>
                  </div>
                  <div className="action-list">
                    {[
                      { client: 'Halcyon Systems', desc: 'Stall score 9.1 — 3 missed milestones, exec dark 7 wks. Immediate escalation required.', agent: 'stall_detection', date: 'Due Jun 9', owner: 'Partner lead', urgency: 'crit', badge: 'Critical' },
                      { client: 'Drift Capital', desc: 'Billing −40% vs contract. Scope creep with no change order — revenue at risk.', agent: 'stall_detection', date: 'Due Jun 8', owner: 'Account mgr', urgency: 'crit', badge: 'Critical' },
                      { client: 'Vantage Partners', desc: 'Budget cycle opens Jul 1. Value chain proposal window — 3 qualified service expansions identified.', agent: 'value_chain', date: 'Due Jun 20', owner: 'Principal', urgency: 'high', badge: 'High' },
                      { client: 'Corestone Infra', desc: 'No exec contact in 28 days. Relationship health score dropped 2.1 pts. Re-engage now.', agent: 'relationship', date: 'Due Jun 12', owner: 'Director', urgency: 'high', badge: 'High' },
                    ].map((a) => (
                      <div key={a.client + a.date} className={`action-item urg-${a.urgency}`} style={{ cursor: 'pointer' }} onClick={() => setActiveTab('action_items')}>
                        <div className="action-bar" />
                        <div className="action-body">
                          <div className="action-client-name">{a.client}</div>
                          <div className="action-desc">{a.desc}</div>
                          <div className="action-tags">
                            <span className="atag atag-agent">{a.agent}</span>
                            <span className="atag atag-date">{a.date}</span>
                            <span className="atag atag-default">{a.owner}</span>
                          </div>
                        </div>
                        <div className="action-badge">{a.badge}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-hd">
                    <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--violet)' }} />Agent Event Stream</div>
                    <div className="live-badge"><div className="live-dot" />Live</div>
                  </div>
                  <div className="stream-list">
                    {[
                      { color: 'var(--red)', agent: 'stall_detection', msg: 'Halcyon Systems — stall score crossed 9.0 threshold. Escalation queued.', time: '07:31' },
                      { color: 'var(--pink)', agent: 'momentum_agent', msg: 'Pinnacle Group trajectory confirmed accelerating. Diagonal progress W22→W23: +0.6 composite.', time: '07:28' },
                      { color: 'var(--amber)', agent: 'budget_team', msg: 'Vantage Partners budget cycle opens Jul 1. Proposal window alert sent.', time: '07:15' },
                      { color: 'var(--indigo)', agent: 'ai_displacement', msg: 'New AI capability detected (code review automation). Risk score updated for 3 service lines.', time: '06:55' },
                      { color: 'var(--green)', agent: 'goal_alignment', msg: 'Meridian Capital goal scores refreshed from Q2 board pack. 2 new priority flags set.', time: '06:40' },
                      { color: 'var(--violet)', agent: 'pattern_library', msg: 'New pattern recorded: Y-axis jump from 6.1→8.5 via exec alignment + service expansion sequence.', time: '06:12' },
                    ].map((s, i) => (
                      <div className="stream-item" key={i} style={{ cursor: 'pointer' }} onClick={() => {
                        let id = 'AG-03'
                        if (s.agent === 'stall_detection') id = 'AG-03'
                        else if (s.agent === 'momentum_agent') id = 'AG-04'
                        else if (s.agent === 'budget_team') id = 'AG-08'
                        else if (s.agent === 'ai_displacement') id = 'AG-06'
                        else if (s.agent === 'goal_alignment') id = 'AG-05'
                        else if (s.agent === 'pattern_library') id = 'AG-11'
                        setSelectedAgent(id)
                        setActiveTab('agent_events')
                      }}>
                        <div className="stream-dot" style={{ background: s.color }} />
                        <div className="stream-body">
                          <div className="stream-agent" style={{ color: s.color }}>{s.agent}</div>
                          <div className="stream-msg">{s.msg}</div>
                        </div>
                        <div className="stream-time">{s.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Welcome back, <span>{userName || 'Consultant'}</span></div>
                  <div className="page-sub">Operational Command Center · Gemini Cloud Agent System</div>
                </div>
              </div>

              <div className="kpi-row">
                <div className="kpi indigo-kpi interactive-card" onClick={() => setActiveTab('clients')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap">◎</div><div className="kpi-value">11</div></div>
                  <div className="kpi-label">Active Clients</div>
                </div>
                <div className="kpi green-kpi interactive-card" onClick={() => setActiveTab('agent_events')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap">⬡</div><div className="kpi-value">12</div></div>
                  <div className="kpi-label">Agents Active</div>
                </div>
                <div className="kpi red-kpi interactive-card" onClick={() => setActiveTab('action_items')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap">◈</div><div className="kpi-value">7</div></div>
                  <div className="kpi-label">Pending Actions</div>
                </div>
                <div className="kpi amber-kpi interactive-card" onClick={() => setActiveTab('stall_detection')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap">⚠</div><div className="kpi-value">2</div></div>
                  <div className="kpi-label">Stalling Accounts</div>
                </div>
              </div>

              {/* Workspace Section */}
              <div className="card" style={{ marginTop: 8 }}>
                <div className="card-hd">
                  <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />Consultant Workspace</div>
                  <div className="tab-group">
                    <div className={`tab ${homeSubTab === 'mails' ? 'active' : ''}`} onClick={() => setHomeSubTab('mails')}>Mails & Updates</div>
                    <div className={`tab ${homeSubTab === 'notes' ? 'active' : ''}`} onClick={() => setHomeSubTab('notes')}>Notes & Minutes</div>
                    <div className={`tab ${homeSubTab === 'calendar' ? 'active' : ''}`} onClick={() => setHomeSubTab('calendar')}>Calendar Events</div>
                  </div>
                </div>
                <div style={{ padding: 20, minHeight: 280, display: 'flex', flexDirection: 'column' }}>
                  {homeSubTab === 'mails' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Recent Client Mails</div>
                        <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12, cursor: 'pointer' }} className="interactive-card">
                          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Sarah Jenkins (Pinnacle Group)</div>
                          <div style={{ fontSize: 11, color: 'var(--text-2)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Re: Phase 3 Kickoff and Resource Allocation</div>
                        </div>
                        <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12, cursor: 'pointer' }} className="interactive-card">
                          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Elena Rostova (NovaTech)</div>
                          <div style={{ fontSize: 11, color: 'var(--text-2)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Tech stack optimization pattern feedback</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Send Quick Update</div>
                        <textarea className="search-input" placeholder="Draft a quick update to selected client..." style={{ flex: 1, resize: 'none', padding: 12, fontFamily: 'Outfit' }}></textarea>
                        <button className="btn btn-pink" style={{ alignSelf: 'flex-end' }} onClick={() => { setShowToast('Update sent successfully'); setTimeout(() => setShowToast(null), 3000) }}>Send Update</button>
                      </div>
                    </div>
                  )}
                  {homeSubTab === 'notes' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Meeting Minutes & Notes</div>
                        <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 10 }}>+ New Note</button>
                      </div>
                      <textarea className="search-input" value={notesText} onChange={(e) => setNotesText(e.target.value)} placeholder="Type your notes here. They will be auto-saved and analyzed by ADK agents..." style={{ flex: 1, resize: 'none', padding: 16, fontFamily: 'Outfit', lineHeight: 1.5 }}></textarea>
                    </div>
                  )}
                  {homeSubTab === 'calendar' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Upcoming Events</div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderLeft: '3px solid var(--pink)', borderRadius: 'var(--r-md)', padding: 16, flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Q2 Strategy Review - Pinnacle Group</div>
                          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>Today, 2:00 PM - 3:30 PM</div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <span className="atag atag-agent">Prep by AG-05</span>
                            <span className="atag atag-default">Zoom</span>
                          </div>
                        </div>
                        <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderLeft: '3px solid var(--indigo)', borderRadius: 'var(--r-md)', padding: 16, flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Tech Audit Kickoff - Meridian Capital</div>
                          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>Tomorrow, 10:00 AM - 11:00 AM</div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <span className="atag atag-default">Teams</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                <div className="card">
                  <div className="card-hd"><div className="card-hd-title"><div className="title-pip" />Active Agent Actions (Simulated Flow)</div></div>
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div className="live-dot" style={{ marginTop: 4 }} />
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--pink-hi)' }}>AG-03 Stall Detection Agent</div>
                        <div style={{ fontSize: 13, color: 'var(--text-1)', marginTop: 2 }}>Analyzing Gmail communications for **Halcyon Systems**... flagged phrase: *"push milestones to next month"*</div>
                        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>10 minutes ago</div>
                      </div>
                    </div>
                    <div style={{ height: 1, background: 'var(--border)' }} />
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div className="live-dot" style={{ background: 'var(--indigo)', boxShadow: 'none', marginTop: 4 }} />
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--indigo)' }}>AG-06 AI Displacement Scanner</div>
                        <div style={{ fontSize: 13, color: 'var(--text-1)', marginTop: 2 }}>Scanning tech deliverables for **Apex Dynamics**... evaluated 4 tasks with >80% displacement potential. Playbook recommended.</div>
                        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>32 minutes ago</div>
                      </div>
                    </div>
                    <div style={{ height: 1, background: 'var(--border)' }} />
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div className="live-dot" style={{ background: 'var(--violet)', boxShadow: 'none', marginTop: 4 }} />
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--pink-hi)' }}>AG-12 Outreach Draft Generator</div>
                        <div style={{ fontSize: 13, color: 'var(--text-1)', marginTop: 2 }}>Drafted zero-pressure executive alignment email for **Drift Capital**. Ready in Priority Queue.</div>
                        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>1 hour ago</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-hd"><div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--red)' }} />System Status</div></div>
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifySelf: 'center', alignSelf: 'center', position: 'relative', width: 90, height: 90, borderRadius: '50%', border: '4px solid rgba(255,46,191,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '4px solid var(--pink)', borderTopColor: 'transparent', animation: 'current-ring 3s linear infinite' }} />
                      <div style={{ fontSize: 24 }}>🛡️</div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16 }}>ADK Orchestrator Secure</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--green)', marginTop: 4 }}>● Connected to Gmail API</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--green)', marginTop: 2 }}>● Connected to Calendar API</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--green)', marginTop: 2 }}>● Next.js Dev Bypass Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CLIENTS TAB */}
          {activeTab === 'clients' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Client <span>Explorer</span></div>
                  <div className="page-sub">Interactive accounts manager & agent scoring</div>
                </div>
              </div>

              <div className="tab-panel-grid">
                <div className="list-panel">
                  <div style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    <input 
                      type="text" 
                      placeholder="Filter clients..." 
                      className="search-input" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', paddingLeft: 12 }}
                    />
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1, maxHeight: 480 }}>
                    {CLIENTS_DATA.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => {
                      const statusClass = c.status === 'Accelerating' ? 'success-rate-badge' : c.status === 'On Track' ? 'badge-indigo' : c.status === 'Progressing' ? 'badge-violet' : c.status === 'At Risk' ? 'badge-amber' : 'badge-red'
                      return (
                        <div 
                          key={c.name} 
                          className={`tab-list-item${selectedClient === c.name ? ' active' : ''}`}
                          onClick={() => {
                            setSelectedClient(c.name)
                            setEmailDraftBody(`Hi ${c.name} team,\n\nI wanted to follow up on our recent milestone deliverables. Let's schedule a brief sync to align on next steps.\n\nBest,\nDemo Team`)
                          }}
                        >
                          <div>
                            <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>{c.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3 }}>{c.tag}</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 12, color: c.status === 'Stalling' ? 'var(--red)' : c.status === 'At Risk' ? 'var(--amber)' : 'var(--text-1)' }}>{c.score}</span>
                            <span className={statusClass} style={{ fontSize: 8, padding: '1px 5px' }}>{c.status}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {(() => {
                  const client = CLIENTS_DATA.find(c => c.name === selectedClient) || CLIENTS_DATA[0]
                  const statusClass = client.status === 'Accelerating' ? 'success-rate-badge' : client.status === 'On Track' ? 'badge-indigo' : client.status === 'Progressing' ? 'badge-violet' : client.status === 'At Risk' ? 'badge-amber' : 'badge-red'
                  return (
                    <div className="detail-panel">
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit' }}>{client.name}</div>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{client.tag} · Active contact: {client.contact}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span className={statusClass}>{client.status}</span>
                          <span style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--pink)' }}>{client.score}</span>
                        </div>
                      </div>

                      <div style={{ height: 1, background: 'var(--border)' }} />

                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 8 }}>Agent Notes & Audit Logs</div>
                        <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16 }}>
                          <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-2)' }}>{client.notes}</p>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 8 }}>Direct Email Communication Integration</div>
                        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                          <div style={{ background: 'var(--bg-hover)', padding: '10px 16px', fontSize: 11, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                            <span>From: <strong>{client.contact}</strong> ({client.email})</span>
                            <span style={{ color: 'var(--text-3)' }}>Last activity: {client.lastActive}</span>
                          </div>
                          <div style={{ padding: 16, fontSize: 12, lineHeight: 1.4, background: 'var(--bg-inset)' }}>
                            {client.status === 'Stalling' ? (
                              <p style={{ color: 'var(--text-2)' }}>
                                &quot;Thanks for the document. We are currently reviewing it. However, because of some upcoming system transitions and internal reorganization, 
                                <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--red)', fontWeight: 600, color: 'var(--text-1)' }}> we might need to push the stakeholder steering review meetings to late next month.</span> 
                                I will let you know once we have a locked date.&quot;
                              </p>
                            ) : client.status === 'At Risk' ? (
                              <p style={{ color: 'var(--text-2)' }}>
                                &quot;The project deliverables are being worked on. We haven&apos;t heard from your team in quite a few weeks though. Can you send a quick status report on where the budget stands?&quot;
                              </p>
                            ) : (
                              <p style={{ color: 'var(--text-2)' }}>
                                &quot;Great update. The steering presentation went very well and the board approved the budget for the next phase. Let&apos;s finalize the statement of work next week.&quot;
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-pink" onClick={() => {
                          if (client.status === 'Stalling') {
                            setActiveTab('stall_detection')
                          } else {
                            window.open(`mailto:${client.email}?subject=Project Sync&body=${encodeURIComponent(emailDraftBody)}`, '_blank')
                            setShowToast(`Draft email opened in Mail client for ${client.name}`)
                            setTimeout(() => setShowToast(null), 3000)
                          }
                        }}>
                          {client.status === 'Stalling' ? '⚡ Open Stall Dashboard' : '✉️ Compose Outreach'}
                        </button>
                        <button className="btn btn-ghost" onClick={() => {
                          setShowDiagnosticsFor(client.name);
                          setShowToast(`Diagnostics loop initiated for ${client.name}...`);
                          setTimeout(() => setShowToast(null), 3000)
                        }}>Run Diagnostics</button>
                      </div>

                      {showDiagnosticsFor === client.name && (
                        <div style={{ marginTop: 20, padding: 20, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg-inset)', animation: 'rise 0.4s ease both' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-1)' }}><span style={{ color: 'var(--pink)' }}>✦</span> Diagnostic Report: {client.name}</div>
                            <button className="btn btn-ghost" onClick={() => setShowDiagnosticsFor(null)} style={{ padding: '4px 8px' }}>✕ Close</button>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase' }}>Behavioral Sentiment Trend</div>
                              <div style={{ height: 120, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 10, position: 'relative' }}>
                                <svg viewBox="0 0 200 80" style={{ width: '100%', height: '100%' }}>
                                  <path d="M 0,60 Q 50,40 100,50 T 200,20" fill="none" stroke="var(--pink)" strokeWidth="2" strokeLinecap="round" />
                                  <circle cx="200" cy="20" r="4" fill="var(--pink)" />
                                  <circle cx="100" cy="50" r="3" fill="var(--indigo)" />
                                  <circle cx="0" cy="60" r="3" fill="var(--violet)" />
                                </svg>
                                <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 10, color: 'var(--green)', fontFamily: 'JetBrains Mono', background: 'var(--bg-inset)', padding: '2px 4px', borderRadius: 4 }}>↗ Trending Positive</div>
                              </div>
                            </div>
                            <div>
                              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase' }}>Engagement Metrics</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12, height: 120, justifyContent: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>Email Responsiveness</span> <span style={{ color: 'var(--green)', fontWeight: 600 }}>High (2.4h avg)</span></div>
                                <div style={{ height: 1, background: 'var(--border)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>Meeting Attendance</span> <span style={{ color: 'var(--amber)', fontWeight: 600 }}>75%</span></div>
                                <div style={{ height: 1, background: 'var(--border)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>Scope Adherence</span> <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>90%</span></div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase' }}>AI Executive Summary</div>
                            <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-2)', background: 'var(--bg-card)', padding: 12, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
                              Client shows consistent engagement but meeting attendance has slightly declined over the last 3 weeks. Email responsiveness remains high, indicating strong asynchronous communication channels. 
                              <br/><br/>
                              <strong style={{ color: 'var(--text-1)' }}>Recommendation:</strong> Pre-schedule key check-ins 2 weeks in advance to lock in executive attendance. Leverage ADK patterns to ensure alignment.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* ENGAGEMENTS TAB */}
          {activeTab === 'engagements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Active <span>Engagements</span></div>
                  <div className="page-sub">Project phase status and delivery tracking</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { client: 'Pinnacle Group', project: 'Value Chain Mapping & AI Integration', phase: 'Phase 3: Implementation', progress: 85, health: 'Green', color: 'var(--green)' },
                  { client: 'Meridian Capital', project: 'IT Infrastructure & Tech Audit', phase: 'Phase 2: Discovery', progress: 60, health: 'Green', color: 'var(--green)' },
                  { client: 'Apex Dynamics', project: 'Strategic Diagnostic & Benchmarking', phase: 'Phase 1: Diagnostic', progress: 30, health: 'Indigo', color: 'var(--indigo)' },
                  { client: 'Halcyon Systems', project: 'Cloud Optimization Mandate', phase: 'Phase 4: Closure', progress: 90, health: 'Stalled', color: 'var(--red)' },
                  { client: 'Vantage Partners', project: 'Logistics Analytics Platform', phase: 'Phase 2: Execution', progress: 40, health: 'At Risk', color: 'var(--amber)' }
                ].map(p => (
                  <div key={p.client} className="card interactive-card" style={{ padding: 20 }} onClick={() => setExpandedEngagement(expandedEngagement === p.client ? null : p.client)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit' }}>{p.client}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{p.project} · <strong style={{ color: 'var(--text-1)' }}>{p.phase}</strong></div>
                      </div>
                      <span className={p.health === 'Green' ? 'success-rate-badge' : p.health === 'Indigo' ? 'badge-indigo' : p.health === 'At Risk' ? 'badge-amber' : 'badge-red'}>
                        {p.health}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--bg-inset)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <div style={{ width: `${p.progress}%`, height: '100%', background: p.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono', fontWeight: 600, width: 32 }}>{p.progress}%</span>
                    </div>
                    
                    {expandedEngagement === p.client && (
                      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)', animation: 'rise 0.3s ease both', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                          <div>
                            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 8 }}>Meetings & Transactions Audit</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg-inset)', padding: 12, borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                              <div style={{ fontSize: 11, display: 'flex', gap: 8 }}><span style={{ color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>06/02</span> <span style={{ color: 'var(--text-2)' }}>Phase Review Meeting (Attended: 4)</span></div>
                              <div style={{ fontSize: 11, display: 'flex', gap: 8 }}><span style={{ color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>06/04</span> <span style={{ color: 'var(--text-2)' }}>Invoice #4022 Issued ($45,000)</span></div>
                              <div style={{ fontSize: 11, display: 'flex', gap: 8 }}><span style={{ color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>06/05</span> <span style={{ color: 'var(--text-2)' }}>Change Request Logged (+15 hrs)</span></div>
                            </div>
                          </div>
                          <div>
                            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 8 }}>AI Summary & Flagged Alerts</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg-inset)', padding: 12, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', height: '100%' }}>
                              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4 }}>
                                Project is tracking well against major milestones. Client is exhibiting standard behavior patterns with no critical anomalies.
                              </div>
                              {p.health !== 'Green' && (
                                <div style={{ fontSize: 11, color: 'var(--amber)', borderLeft: '2px solid var(--amber)', paddingLeft: 8, marginTop: 4, background: 'var(--amber-dim)', padding: 8, borderRadius: '0 var(--r-sm) var(--r-sm) 0' }}>
                                  ⚠ Alert: {p.health === 'Stalled' ? 'Execution has paused completely. Immediate intervention required.' : 'Scope expansion detected in recent meeting notes. Proactive budget review recommended.'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTION ITEMS TAB */}
          {activeTab === 'action_items' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Priority <span>Queue</span></div>
                  <div className="page-sub">Action items generated by specialist agents</div>
                </div>
              </div>

              <div className="card">
                <div className="card-hd"><div className="card-hd-title"><div className="title-pip" />Active Recommendations</div></div>
                <div className="action-list">
                  {[
                    { id: 'act-1', client: 'Halcyon Systems', desc: 'Stall score 9.1 — 3 missed milestones, exec dark 7 wks. Immediate escalation required.', agent: 'stall_detection', date: 'Due Jun 9', owner: 'Partner lead', urgency: 'crit', badge: 'Critical' },
                    { id: 'act-2', client: 'Drift Capital', desc: 'Billing −40% vs contract. Scope creep with no change order — revenue at risk.', agent: 'stall_detection', date: 'Due Jun 8', owner: 'Account mgr', urgency: 'crit', badge: 'Critical' },
                    { id: 'act-3', client: 'Vantage Partners', desc: 'Budget cycle opens Jul 1. Value chain proposal window — 3 qualified service expansions identified.', agent: 'value_chain', date: 'Due Jun 20', owner: 'Principal', urgency: 'high', badge: 'High' },
                    { id: 'act-4', client: 'Corestone Infra', desc: 'No exec contact in 28 days. Relationship health score dropped 2.1 pts. Re-engage now.', agent: 'relationship', date: 'Due Jun 12', owner: 'Director', urgency: 'high', badge: 'High' }
                  ].map((a) => {
                    const isCompleted = completedActions.includes(a.id)
                    return (
                      <div key={a.id} className={`action-item urg-${a.urgency}`} style={{ opacity: isCompleted ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                        <div className="action-bar" />
                        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={isCompleted}
                            onChange={() => {
                              if (isCompleted) {
                                setCompletedActions(completedActions.filter(id => id !== a.id))
                              } else {
                                setCompletedActions([...completedActions, a.id])
                                setShowToast(`Action for ${a.client} marked as resolved`)
                                setTimeout(() => setShowToast(null), 3000)
                              }
                            }}
                            style={{ width: 18, height: 18, marginRight: 16, accentColor: 'var(--pink)', cursor: 'pointer' }}
                          />
                        </div>
                        <div className="action-body">
                          <div className="action-client-name" style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>{a.client}</div>
                          <div className="action-desc">{a.desc}</div>
                          <div className="action-tags">
                            <span className="atag atag-agent">{a.agent}</span>
                            <span className="atag atag-date">{a.date}</span>
                            <span className="atag atag-default">{a.owner}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 20, gap: 8 }}>
                          {!isCompleted && (
                            <button className="btn btn-ghost" onClick={() => {
                               setShowToast(`Action automatically delegated to ${a.agent}. Progress tracking started.`);
                               setCompletedActions([...completedActions, a.id]);
                               setTimeout(() => setShowToast(null), 3000);
                            }} style={{ padding: '5px 10px', fontSize: 10 }}>
                              Delegate to Agent
                            </button>
                          )}
                          {!isCompleted && a.client === 'Halcyon Systems' && (
                            <button className="btn btn-pink" onClick={() => setActiveTab('stall_detection')} style={{ padding: '5px 10px', fontSize: 10 }}>
                              Escalate
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* AGENT WORKFLOW TAB */}
          {activeTab === 'agent_events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both', position: 'relative' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Agent <span>Workflow</span></div>
                  <div className="page-sub">Interactive downstream diagram of active Gemini agents</div>
                </div>
              </div>

              <div className="tab-panel-grid" style={{ gridTemplateColumns: '1fr 340px' }}>
                <div className="list-panel" style={{ padding: 24, position: 'relative', overflowX: 'auto', display: 'flex', alignItems: 'center' }}>
                  
                  {/* Workflow Diagram */}
                  <div className="workflow-scene" style={{ width: '100%', minWidth: 720 }}>
                    <svg viewBox="0 0 740 300" style={{ width: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="wf-grad-pink" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FF2EBF" stopOpacity="0.6"/>
                          <stop offset="100%" stopColor="#9B30D9" stopOpacity="0.6"/>
                        </linearGradient>
                        <linearGradient id="wf-grad-violet" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9B30D9" stopOpacity="0.5"/>
                          <stop offset="100%" stopColor="#FF2EBF" stopOpacity="0.5"/>
                        </linearGradient>
                        <filter id="wf-glow">
                          <feGaussianBlur stdDeviation="2.5" result="b"/>
                          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="wf-glow-lg">
                          <feGaussianBlur stdDeviation="5" result="b"/>
                          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                          <polygon points="0 0, 6 2, 0 4" fill="rgba(255,46,191,0.5)"/>
                        </marker>
                      </defs>

                      {/* Paths */}
                      {WORKFLOW_PATHS.map(p => (
                        <path 
                          key={p.id} 
                          id={p.id} 
                          d={p.d} 
                          fill="none" 
                          stroke={p.color === 'pink' ? "rgba(255,46,191,0.22)" : "rgba(155,48,217,0.22)"} 
                          strokeWidth="1.5" 
                          strokeDasharray="5 4"
                        />
                      ))}
                      
                      {/* Final connections to Output */}
                      <path id="px1_dash" d="M 625 110 C 650 110 660 150 670 150" fill="none" stroke="url(#wf-grad-pink)" strokeWidth="2.5" markerEnd="url(#arrowhead)"/>
                      <path id="px2_dash" d="M 625 190 C 650 190 660 150 670 150" fill="none" stroke="url(#wf-grad-pink)" strokeWidth="2.5" markerEnd="url(#arrowhead)"/>

                      {/* Animated Packets */}
                      {WORKFLOW_PATHS.map(p => (
                        <circle key={`anim_${p.id}`} r={p.color === 'pink' ? "3.5" : "2.5"} fill={p.color === 'pink' ? "#FF2EBF" : "#9B30D9"} filter="url(#wf-glow)" opacity="0.9">
                          <animateMotion dur={p.dur} repeatCount="indefinite" begin={p.delay}><mpath href={`#${p.id}`}/></animateMotion>
                        </circle>
                      ))}
                      <circle r="4" fill="#FF2EBF" filter="url(#wf-glow-lg)" opacity="0.95">
                        <animateMotion dur="2s" repeatCount="indefinite" begin="0.2s"><mpath href="#px1_dash"/></animateMotion>
                      </circle>
                      <circle r="4" fill="#FF2EBF" filter="url(#wf-glow-lg)" opacity="0.95">
                        <animateMotion dur="2.3s" repeatCount="indefinite" begin="0.8s"><mpath href="#px2_dash"/></animateMotion>
                      </circle>

                      {/* Nodes */}
                      {WORKFLOW_NODES.map(node => {
                        const agent = AGENTS_DATA.find(a => a.id === node.id);
                        const isSelected = selectedAgent === node.id;
                        const statusColor = agent?.status === 'Alerting' ? '#EF4444' : agent?.status === 'Analyzing' ? '#F59E0B' : '#22C55E';
                        return (
                          <g 
                            key={node.id} 
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredAgent(node.id)}
                            onMouseLeave={() => setHoveredAgent(null)}
                            onClick={() => setSelectedAgent(node.id)}
                          >
                            <circle 
                              cx={node.x} 
                              cy={node.y} 
                              r={node.isMain ? 38 : 24} 
                              fill="var(--bg-card)" 
                              stroke={isSelected ? "rgba(255,46,191,0.8)" : "rgba(255,46,191,0.22)"} 
                              strokeWidth={isSelected ? 2 : 1}
                              filter={isSelected ? "url(#wf-glow-lg)" : ""}
                            />
                            {node.isMain && (
                              <>
                                <circle cx={node.x} cy={node.y} r={50} fill="none" stroke="rgba(255,46,191,0.12)" strokeWidth="1">
                                  <animate attributeName="r" values="38;52;38" dur="2.8s" repeatCount="indefinite"/>
                                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2.8s" repeatCount="indefinite"/>
                                </circle>
                                <circle cx={node.x} cy={node.y} r={60} fill="none" stroke="rgba(155,48,217,0.07)" strokeWidth="1">
                                  <animate attributeName="r" values="42;62;42" dur="2.8s" repeatCount="indefinite" begin="0.4s"/>
                                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2.8s" repeatCount="indefinite" begin="0.4s"/>
                                </circle>
                              </>
                            )}
                            <circle cx={node.x + (node.isMain ? 24 : 14)} cy={node.y - (node.isMain ? 24 : 14)} r="3" fill={statusColor} />
                            <text x={node.x} y={node.y - (node.isMain ? 6 : 4)} textAnchor="middle" fill={isSelected ? "#FF71D5" : "#EEEEFF"} fontSize={node.isMain ? 9.5 : 8} fontFamily="JetBrains Mono" fontWeight="500">{node.id}</text>
                            <text x={node.x} y={node.y + (node.isMain ? 10 : 8)} textAnchor="middle" fill="rgba(155,48,217,0.85)" fontSize="6.5" fontFamily="JetBrains Mono">{node.label}</text>
                          </g>
                        )
                      })}

                      {/* Dashboard Output */}
                      <g>
                        <rect x="656" y="128" width="76" height="44" rx="8" fill="rgba(255,46,191,0.06)" stroke="rgba(255,46,191,0.3)" strokeWidth="1"/>
                        <rect x="656" y="128" width="76" height="44" rx="8" fill="none" stroke="rgba(255,46,191,0.15)" strokeWidth="1">
                          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                        </rect>
                        <text x="694" y="146" textAnchor="middle" fill="#FF2EBF" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600">Dashboard</text>
                        <text x="694" y="160" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="6.5" fontFamily="JetBrains Mono">HUMAN OUTPUT</text>
                      </g>

                      {/* Column Labels */}
                      <text x="65" y="285" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="JetBrains Mono" letterSpacing="1">DATA SOURCES</text>
                      <text x="242" y="285" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="JetBrains Mono" letterSpacing="1">SPECIALIST AGENTS</text>
                      <text x="420" y="285" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="JetBrains Mono" letterSpacing="1">ORCHESTRATOR</text>
                      <text x="600" y="285" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="JetBrains Mono" letterSpacing="1">OUTPUTS</text>
                    </svg>
                  </div>

                </div>

                {(() => {
                  const agent = AGENTS_DATA.find(a => a.id === selectedAgent) || AGENTS_DATA[0]
                  return (
                    <div className="detail-panel">
                      <div>
                        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit' }}>{agent.id}</div>
                            <div style={{ fontSize: 14, color: 'var(--text-1)', fontWeight: 600, marginTop: 2 }}>{agent.name}</div>
                          </div>
                          <span className={agent.status === 'Alerting' ? 'badge-red' : agent.status === 'Analyzing' ? 'badge-amber' : 'success-rate-badge'} style={{ marginTop: 4 }}>
                            {agent.status}
                          </span>
                        </div>
                      </div>

                      <div style={{ height: 1, background: 'var(--border)' }} />

                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 8 }}>Agent Activity Summary</div>
                        <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-2)', background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12 }}>
                          {agent.lastAction}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 8 }}>Search/Filter Queries</div>
                        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--pink-hi)' }}>
                          {agent.queries}
                        </div>
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 8 }}>Read/Write Events Log</div>
                        <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5, overflowY: 'auto', flex: 1 }}>
                          <div><span style={{ color: 'var(--text-3)' }}>[05:12:08]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> System trigger initialized loop...</div>
                          <div><span style={{ color: 'var(--text-3)' }}>[05:12:09]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> Ingested data from stream buffer...</div>
                          <div><span style={{ color: 'var(--text-3)' }}>[05:12:10]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> Processing pattern matching algorithms...</div>
                          {agent.status === 'Alerting' ? (
                            <>
                              <div style={{ color: 'var(--red)' }}><span style={{ color: 'var(--text-3)' }}>[05:12:12]</span> <span>WRITE</span> ALERT: Matching anomaly threshold exceeded.</div>
                              <div style={{ color: 'var(--red)' }}><span style={{ color: 'var(--text-3)' }}>[05:12:13]</span> <span>WRITE</span> Emitting high-priority flag to orchestrator.</div>
                              <div style={{ color: 'var(--red)' }}><span style={{ color: 'var(--text-3)' }}>[05:12:14]</span> <span>WRITE</span> Updating client risk score: +2.4 points.</div>
                              <div><span style={{ color: 'var(--text-3)' }}>[05:12:15]</span> <span style={{ color: 'var(--pink-hi)' }}>WRITE</span> Pushed action item to global queue.</div>
                            </>
                          ) : agent.status === 'Analyzing' ? (
                            <>
                              <div><span style={{ color: 'var(--text-3)' }}>[05:12:12]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> Parsing entity sentiment parameters...</div>
                              <div><span style={{ color: 'var(--text-3)' }}>[05:12:14]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> Benchmarking deliverables against baseline...</div>
                              <div style={{ color: 'var(--amber)' }}><span style={{ color: 'var(--text-3)' }}>[05:12:15]</span> <span>WRITE</span> Partial mismatch detected. Flagging for review.</div>
                            </>
                          ) : (
                            <>
                              <div><span style={{ color: 'var(--text-3)' }}>[05:12:12]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> Processed 14 continuous events.</div>
                              <div><span style={{ color: 'var(--text-3)' }}>[05:12:14]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> No anomalies detected in current window.</div>
                              <div style={{ color: 'var(--green)' }}><span style={{ color: 'var(--text-3)' }}>[05:12:15]</span> <span>WRITE</span> Logged success status. Awaiting next cycle.</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
              
              {/* Floating Hover Tooltip */}
              {hoveredAgent && (
                <div style={{
                  position: 'absolute',
                  top: 80,
                  left: 24,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  padding: '16px',
                  borderRadius: 'var(--r-md)',
                  width: 300,
                  zIndex: 100,
                  pointerEvents: 'none',
                  animation: 'rise 0.2s ease'
                }}>
                  {(() => {
                    const ha = AGENTS_DATA.find(a => a.id === hoveredAgent)!;
                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14 }}>{ha.id} · {ha.name}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4, marginBottom: 8 }}>
                          <strong style={{ color: 'var(--text-1)' }}>Current Action:</strong> {ha.lastAction}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>
                          <strong style={{ color: 'var(--text-1)' }}>Query Model:</strong> {ha.queries}
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          )}

          {/* STALL DETECTION TAB */}
          {activeTab === 'stall_detection' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Stall <span>Detection Center</span></div>
                  <div className="page-sub">Pre-emptive indicators and outreach automation</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--red)', marginBottom: 16 }}>Stalling Account: Halcyon Systems</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>Stall Score</div>
                      <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--red)', marginTop: 4 }}>9.1 <span style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 500 }}>/ 10</span></div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>Flagged Communication</div>
                      <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12, fontSize: 12, marginTop: 6, borderLeft: '3px solid var(--red)' }}>
                        &quot;...we might need to <span style={{ color: 'var(--red)', fontWeight: 600 }}>push the stakeholder steering review meetings to late next month</span>.&quot;
                        <div style={{ textAlign: 'right', fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>— Greg House (CTO), 7 days ago</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>Recommended Pattern</div>
                      <div style={{ fontSize: 13, color: 'var(--pink-hi)', marginTop: 4, fontWeight: 600 }}>The Executive Bridge (Playbook #1)</div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--pink)', marginBottom: 12 }}>Gemini Pre-generated Outreach</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>EMAIL SUBJECT</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        value="Project Alignment & Roadmap Steering Sync" 
                        readOnly 
                        style={{ width: '100%', marginTop: 4 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>EMAIL BODY</label>
                      <textarea 
                        className="search-input" 
                        value={emailDraftBody}
                        onChange={(e) => setEmailDraftBody(e.target.value)}
                        style={{ width: '100%', height: 120, marginTop: 4, resize: 'none', padding: 10, fontFamily: 'Outfit', lineHeight: 1.4 }}
                      />
                    </div>
                    <button 
                      className="btn btn-pink" 
                      disabled={isSendingEmail}
                      onClick={() => {
                        setIsSendingEmail(true)
                        setTimeout(() => {
                          setIsSendingEmail(false)
                          setShowToast("Email successfully sent via Gmail API integration!")
                          setTimeout(() => setShowToast(null), 4000)
                        }, 1500)
                      }}
                    >
                      {isSendingEmail ? 'Sending via Gmail...' : '✉️ Send via Gmail API'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI DANGER ZONE TAB */}
          {activeTab === 'ai_danger_zone' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">AI <span>Danger Zone</span></div>
                  <div className="page-sub">Analysis of commoditization risk across consulting service lines</div>
                </div>
              </div>

              <div className="card">
                <div className="card-hd"><div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--amber)' }} />Service Delivery Exposure Index</div></div>
                <div style={{ padding: 20 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 20 }}>
                    Gemini ADK regularly scans deliverables, code repositories, and work logs to measure the proportion of hours spent on tasks that can be fully automated. 
                    Higher scores indicate a shift toward commoditization, prompting defensibility patterns.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { task: 'Code refactoring & unit testing', exposure: '95%', risk: 'Critical', color: 'var(--red)' },
                      { task: 'Architecture design & blueprinting', exposure: '35%', risk: 'Low', color: 'var(--green)' },
                      { task: 'Business process documentation', exposure: '80%', risk: 'High', color: 'var(--amber)' },
                      { task: 'Technical audit & security scanning', exposure: '65%', risk: 'Medium', color: 'var(--indigo)' },
                      { task: 'Strategic exec alignment workshops', exposure: '10%', risk: 'Negligible', color: 'var(--pink)' }
                    ].map(i => (
                      <div key={i.task} style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px 16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{i.task}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                          <div style={{ width: 100, height: 6, background: 'var(--bg-card)', borderRadius: 3, border: '1px solid var(--border)', overflow: 'hidden' }}>
                            <div style={{ width: i.exposure, height: '100%', background: i.color }} />
                          </div>
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, width: 32, textAlign: 'right' }}>{i.exposure}</span>
                          <span className={i.risk === 'Critical' ? 'badge-red' : i.risk === 'High' ? 'badge-red' : i.risk === 'Medium' ? 'badge-amber' : 'success-rate-badge'} style={{ width: 80, textAlignment: 'center', display: 'inline-block', fontSize: 10 }}>
                            {i.risk}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPETITIVE RISK TAB */}
          {activeTab === 'competitive_risk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Competitive <span>Risk Analysis</span></div>
                  <div className="page-sub">Competitor footprints and account defense plays</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--pink)', marginBottom: 12 }}>Active Competitor Footprint</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12 }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--red)', fontWeight: 600 }}>● Accenture Bidding Flag</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>Detected RFP engagement from Accenture on **Halcyon Systems** core migration project. Defense play required.</div>
                    </div>
                    <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12 }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--amber)', fontWeight: 600 }}>● McKinsey VP Hiring Alert</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>McKinsey recruited 2 former Pinnacle Group VP stakeholders. Check relationship network strength.</div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--indigo)', marginBottom: 12 }}>Account Defense Playbook</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-2)', marginBottom: 16 }}>
                    Apply these workstation defensive sequences to mitigate competitor expansion in active mandates.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="interactive-card" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12 }} onClick={() => {
                      setShowToast("Defense sequence 'Exec Alignment Lock' applied to accounts");
                      setTimeout(() => setShowToast(null), 3000);
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>1. Executive Alignment Lock</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Secure steering mandate directly with CIO/CTO sponsors.</div>
                    </div>
                    <div className="interactive-card" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12 }} onClick={() => {
                      setShowToast("Defense sequence 'Value Chain Expansion' applied");
                      setTimeout(() => setShowToast(null), 3000);
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>2. Value Chain Expansion Sequence</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Propose custom dashboard extensions using our Gemini ADK tools.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PATTERN LIBRARY TAB */}
          {activeTab === 'pattern_library' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Pattern <span>Library</span></div>
                  <div className="page-sub">Success plays catalogued in workstation</div>
                </div>
              </div>

              <div className="tab-panel-grid">
                <div className="list-panel" style={{ overflowY: 'auto', maxHeight: 480 }}>
                  {PATTERNS_DATA.map(p => (
                    <div 
                      key={p.name} 
                      className={`tab-list-item${selectedPattern === p.name ? ' active' : ''}`}
                      onClick={() => setSelectedPattern(p.name)}
                    >
                      <div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3 }}>{p.category}</div>
                      </div>
                      <span className="success-rate-badge">{p.success}</span>
                    </div>
                  ))}
                </div>

                {(() => {
                  const pattern = PATTERNS_DATA.find(p => p.name === selectedPattern) || PATTERNS_DATA[0]
                  return (
                    <div className="detail-panel">
                      <div>
                        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit' }}>{pattern.name}</div>
                          <span className="success-rate-badge" style={{ fontSize: 12 }}>Success: {pattern.success}</span>
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Category: {pattern.category}</div>
                      </div>

                      <div style={{ height: 1, background: 'var(--border)' }} />

                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 8 }}>Description</div>
                        <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text-2)' }}>{pattern.description}</p>
                      </div>

                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 8 }}>Execution Steps</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {pattern.steps.map((s, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12 }}>
                              <div style={{ background: 'var(--pink-dim)', color: 'var(--pink)', fontFamily: 'JetBrains Mono', fontWeight: 700, width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>
                                {idx + 1}
                              </div>
                              <div style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--text-1)' }}>{s}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="btn btn-pink" onClick={() => {
                        setShowToast(`Pattern '${pattern.name}' successfully deployed to pipeline database.`);
                        setTimeout(() => setShowToast(null), 3000);
                      }}>Deploy Pattern to Project Database</button>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Workstation <span>Settings</span></div>
                  <div className="page-sub">Configure Gemini agents, API scopes, and triggers</div>
                </div>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--pink)' }}>Agent Configuration</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-3)' }}>GEMINI MODEL SELECTOR</label>
                      <select className="search-input" style={{ width: '100%', height: 36, padding: '0 10px', background: 'var(--bg-inset)' }} defaultValue="gemini-3.5-flash">
                        <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default)</option>
                        <option value="gemini-3.5-pro">Gemini 3.5 Pro</option>
                        <option value="gemini-3.0-ultra">Gemini 3.0 Ultra</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-3)' }}>SCAN INTERVAL (MINUTES)</label>
                      <input type="number" className="search-input" defaultValue="15" style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: 'var(--pink)' }} />
                      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Auto-generate draft outreach messages on Stall detection</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--indigo)' }}>Connection Integration Status</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12, display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Gmail API</span>
                        <span style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>● Connected</span>
                      </div>
                      <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12, display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Google Calendar API</span>
                        <span style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>● Connected</span>
                      </div>
                      <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12, display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Supabase Connection</span>
                        <span style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>● Connected (Demo Bypass)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }} />

                <button className="btn btn-pink" onClick={() => {
                  setShowToast("Settings successfully saved!");
                  setTimeout(() => setShowToast(null), 3000);
                }} style={{ alignSelf: 'flex-start' }}>Save Configuration</button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* TOAST ALERT NOTIFICATION */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'var(--bg-card2)',
          border: '1px solid var(--pink)',
          boxShadow: '0 0 16px var(--pink-glow)',
          padding: '12px 24px',
          borderRadius: 'var(--r-md)',
          fontFamily: 'Outfit',
          fontSize: 13,
          fontWeight: 600,
          zIndex: 1000,
          animation: 'rise 0.2s ease both'
        }}>
          ✨ {showToast}
        </div>
      )}
    </>
  )
}
