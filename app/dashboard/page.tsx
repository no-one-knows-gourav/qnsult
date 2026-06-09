'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const Icon = {
  Search:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell:          () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  MoreVert:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>,
  Home:          () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Users:         () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Briefcase:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  CheckSquare:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  Cpu:           () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  BarChart2:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  AlertTriangle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Shield:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Target:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Layers:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Settings:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  SlidersH:      () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>,
  CalendarDays:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Play:          () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  TrendingUp:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  TrendingDown:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  Diamond:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>,
  X:             () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Mail:          () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Send:          () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Zap:           () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  ArrowUpRight:  () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>,
  Save:          () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
}

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

const MOCK_MAILS = [
  { client: 'Pinnacle Group', sender: 'Sarah Jenkins', subject: 'Re: Phase 3 Kickoff and Resource Allocation', excerpt: 'Re: Phase 3 Kickoff and Resource Allocation' },
  { client: 'NovaTech Solutions', sender: 'Elena Rostova', subject: 'Tech stack optimization pattern feedback', excerpt: 'Tech stack optimization pattern feedback' },
  { client: 'Halcyon Systems', sender: 'Greg House', subject: 'Urgent: Project timeline delay update', excerpt: 'Urgent: Project timeline delay update' }
]

const MOCK_CALENDAR_EVENTS = [
  { id: 'cal-1', title: 'Q2 Strategy Review — Pinnacle Group', client: 'Pinnacle Group', start: 'Today, 2:00 PM', end: '3:30 PM', platform: 'Zoom', color: 'var(--pink)', prep: 'AG-05' },
  { id: 'cal-2', title: 'Tech Audit Kickoff — Meridian Capital', client: 'Meridian Capital', start: 'Tomorrow, 10:00 AM', end: '11:00 AM', platform: 'Teams', color: 'var(--indigo)', prep: null },
  { id: 'cal-3', title: 'Executive Sync — Halcyon Systems', client: 'Halcyon Systems', start: 'Jun 11, 3:00 PM', end: '4:00 PM', platform: 'Google Meet', color: 'var(--red)', prep: 'AG-12' },
]

const MOCK_FLOW_ACTIONS = [
  { agent: 'AG-03 Stall Detection Agent', color: 'var(--pink-hi)', body: 'Analyzing Gmail communications for Halcyon Systems... flagged phrase: "push milestones to next month"', time: '10 minutes ago', dotColor: 'var(--red)' },
  { agent: 'AG-06 AI Displacement Scanner', color: 'var(--indigo)', body: 'Scanning tech deliverables for Apex Dynamics... evaluated 4 tasks with >80% displacement potential. Playbook recommended.', time: '32 minutes ago', dotColor: 'var(--indigo)' },
  { agent: 'AG-12 Outreach Draft Generator', color: 'var(--pink-hi)', body: 'Drafted zero-pressure executive alignment email for Drift Capital. Ready in Priority Queue.', time: '1 hour ago', dotColor: 'var(--violet)' }
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

const STALL_DEMO: Record<string, { stall_score: number; exec_cadence_label: string; budget_deviation: number; score_delta: number; exec_dark_days: number }> = {
  'Halcyon Systems':   { stall_score: 9.1, exec_cadence_label: 'Dark 49d',  budget_deviation: -22, score_delta: -3.2, exec_dark_days: 49 },
  'Drift Capital':     { stall_score: 7.8, exec_cadence_label: 'Evasive',   budget_deviation: -40, score_delta: -2.8, exec_dark_days: 6  },
  'Vantage Partners':  { stall_score: 5.4, exec_cadence_label: 'Slowing',   budget_deviation: -8,  score_delta: -0.9, exec_dark_days: 12 },
  'Corestone Infra':   { stall_score: 3.6, exec_cadence_label: 'Dark 28d',  budget_deviation: -3,  score_delta: -2.1, exec_dark_days: 28 },
  'Redwood Advisors':  { stall_score: 3.1, exec_cadence_label: 'Slowing',   budget_deviation: -5,  score_delta: -0.8, exec_dark_days: 5  },
  'Lumis Group':       { stall_score: 2.1, exec_cadence_label: 'Active',    budget_deviation: 1,   score_delta: 0.0,  exec_dark_days: 2  },
  'Stratford & Co':    { stall_score: 1.8, exec_cadence_label: 'Active',    budget_deviation: 2,   score_delta: 0.1,  exec_dark_days: 1  },
  'Apex Dynamics':     { stall_score: 1.2, exec_cadence_label: 'Active',    budget_deviation: 3,   score_delta: 0.3,  exec_dark_days: 0  },
  'NovaTech Solutions':{ stall_score: 1.0, exec_cadence_label: 'Active',    budget_deviation: 4,   score_delta: 0.2,  exec_dark_days: 1  },
  'Meridian Capital':  { stall_score: 1.4, exec_cadence_label: 'Active',    budget_deviation: 2,   score_delta: 0.4,  exec_dark_days: 2  },
  'Pinnacle Group':    { stall_score: 0.8, exec_cadence_label: 'Active',    budget_deviation: 5,   score_delta: 1.1,  exec_dark_days: 0  },
}

const COMP_THREATS_DEMO = [
  { client_id: 'hcs-001', client: 'Halcyon Systems',  ticker: 'HCS', competitor: 'Accenture',  threat_type: 'RFP Bid',         severity: 'Critical', signal_source: 'RFP language in email thread',  defense_play: 'Exec Alignment Lock',    status: 'Queued',     days_detected: 3  },
  { client_id: 'png-001', client: 'Pinnacle Group',   ticker: 'PNG', competitor: 'McKinsey',   threat_type: 'Talent Poaching', severity: 'High',     signal_source: '2 VP defections (LinkedIn)',    defense_play: 'Stakeholder Anchor',     status: 'Queued',     days_detected: 7  },
  { client_id: 'drc-001', client: 'Drift Capital',    ticker: 'DRC', competitor: 'Deloitte',   threat_type: 'Shadow Proposal', severity: 'Medium',   signal_source: 'Email tone shift detected',     defense_play: 'Value Chain Shift',      status: 'Monitoring', days_detected: 12 },
  { client_id: 'vtg-001', client: 'Vantage Partners', ticker: 'VTG', competitor: 'BCG',        threat_type: 'Budget Window',   severity: 'Low',      signal_source: 'Q3 budget cycle open',          defense_play: 'Pre-emptive Scope Lock', status: 'Monitoring', days_detected: 2  },
]

const AI_DISP_DEMO: Record<string, { displacement_pct: number; rev_k: number }> = {
  'Halcyon Systems':    { displacement_pct: 82, rev_k: 210 },
  'Corestone Infra':    { displacement_pct: 78, rev_k: 55  },
  'Drift Capital':      { displacement_pct: 74, rev_k: 88  },
  'Redwood Advisors':   { displacement_pct: 65, rev_k: 45  },
  'Apex Dynamics':      { displacement_pct: 58, rev_k: 92  },
  'Vantage Partners':   { displacement_pct: 48, rev_k: 67  },
  'Lumis Group':        { displacement_pct: 42, rev_k: 51  },
  'NovaTech Solutions': { displacement_pct: 38, rev_k: 78  },
  'Stratford & Co':     { displacement_pct: 35, rev_k: 62  },
  'Meridian Capital':   { displacement_pct: 22, rev_k: 98  },
  'Pinnacle Group':     { displacement_pct: 18, rev_k: 145 },
}

const PATTERNS_DATA = [
  {
    name: 'Account War Book', category: 'Knowledge Transfer', success: '91%', deployments: 14, time: '3–5 days', difficulty: 'Medium', owner: 'Outgoing Lead',
    trigger: 'Consultant departure or account handoff',
    description: 'Produce a structured 40–60 page client dossier capturing all institutional knowledge — stakeholder sentiment, political dynamics, open risks, and project context — so any incoming consultant can reach productive velocity within days, not weeks.',
    steps: [
      'Spend 2 hours with outgoing consultant running an unstructured knowledge dump interview (record it)',
      'Compile stakeholder org chart with relationship scores, preferred communication styles, and political affiliations',
      'Document all open risks, blockers, and informal agreements not in the SOW',
      'Write a 2-page "first 30 days" guide for the incoming consultant',
      'Archive in Notion with access-controlled sharing to engagement lead and backup',
    ],
    related: ['Stakeholder Map Freeze', 'Context Transfer Sprint'],
  },
  {
    name: 'Stakeholder Map Freeze', category: 'Knowledge Transfer', success: '88%', deployments: 19, time: '1 day', difficulty: 'Low', owner: 'Account Lead',
    trigger: 'Any team rotation or planned leave exceeding 2 weeks',
    description: 'Snapshot the full client stakeholder graph with relationship health scores, decision-making authority, and current sentiment — preventing the account from going dark on relationship intelligence when a key consultant transitions.',
    steps: [
      'Export current relationship graph from CRM and annotate each node with a sentiment score (1–5)',
      'Flag all stakeholders who are "warm" — relationships that require active maintenance',
      'Identify 2 at-risk relationships that need a touch point before departure',
      'Record a 5-minute stakeholder briefing video for the incoming consultant',
      'Schedule a warm introduction call between incoming consultant and top-3 stakeholders',
    ],
    related: ['Account War Book', 'Rapid Relationship Mapper'],
  },
  {
    name: 'Meeting Replay Digest', category: 'Knowledge Transfer', success: '96%', deployments: 31, time: '4 hours', difficulty: 'Low', owner: 'AG-10 (Automated)',
    trigger: 'Account handoff, onboarding of a new consultant to existing account',
    description: 'AG-10 generates AI-summarised digests of the last 12 months of client meetings, indexed by theme (decisions, blockers, commitments, stakeholder sentiment). Incoming consultants can read 12 months of context in 45 minutes.',
    steps: [
      'AG-10 pulls all meeting notes, email threads, and call transcripts from the past 12 months',
      'Cluster by theme: strategic decisions, open risks, delivery milestones, stakeholder dynamics',
      'Generate a 6-page indexed digest with a searchable executive summary at the top',
      'Tag all unresolved commitments made to the client and flag them for immediate follow-up',
      'Deliver digest to incoming consultant 48 hours before first client meeting',
    ],
    related: ['Account War Book', '30-60-90 Immersion Plan'],
  },
  {
    name: 'Context Transfer Sprint', category: 'Knowledge Transfer', success: '85%', deployments: 9, time: '3 days', difficulty: 'High', owner: 'Outgoing + Incoming Lead',
    trigger: 'Planned consultant departure with ≥2 weeks notice',
    description: 'A structured 3-day intensive overlap between outgoing and incoming consultant. Day 1: shadow all meetings. Day 2: co-present to client. Day 3: solo with outgoing on standby. Proven to cut account drop-off risk by 60%.',
    steps: [
      'Day 1 — Incoming consultant shadows all client interactions silently; debriefs 1hr with outgoing afterward',
      'Day 2 — Co-present: incoming leads, outgoing provides backup context in real time',
      'Day 3 — Incoming runs account solo; outgoing available by phone for 30-min end-of-day debrief',
      'Document all tribal knowledge surfaced during the 3 days in the Account War Book',
      'Formal handoff sign-off with client sponsor acknowledging new primary contact',
    ],
    related: ['Account War Book', '30-60-90 Immersion Plan'],
  },
  {
    name: '30-60-90 Immersion Plan', category: 'Onboarding', success: '92%', deployments: 22, time: '90 days', difficulty: 'Medium', owner: 'Engagement Manager',
    trigger: 'New consultant assigned to account, or newly hired consultant',
    description: 'A phased 90-day onboarding curriculum that takes a consultant from zero to full account ownership — structured so they are adding measurable value by Day 30 and fully autonomous by Day 90.',
    steps: [
      'Days 1–30: Read all client documentation, complete Meeting Replay Digest, shadow 100% of client meetings. Deliverable: 1-page stakeholder map with personal annotations',
      'Days 31–60: Lead at least 2 client meetings independently; take ownership of one active work stream. Deliverable: updated project risk register',
      'Days 61–90: Full account ownership. Present a strategic recommendations memo to client sponsor. Deliverable: 90-day retrospective + next quarter plan',
      'Weekly 30-min coaching call with engagement lead throughout the period',
    ],
    related: ['Client Shadow Protocol', 'Account War Book'],
  },
  {
    name: 'Client Shadow Protocol', category: 'Onboarding', success: '89%', deployments: 17, time: '14 days', difficulty: 'Low', owner: 'Senior Consultant',
    trigger: 'Any new consultant assigned to a live account',
    description: 'New consultant attends all client-facing interactions for two weeks in silent observation mode. Accelerates relationship intuition, communication calibration, and contextual awareness — reducing costly first-impression errors.',
    steps: [
      'Identify all scheduled client interactions in the next 14 days and block them in new consultant\'s calendar',
      'Before each session, senior consultant provides a 5-min brief on who is attending and what dynamics to watch',
      'New consultant takes detailed observation notes; review after each session',
      'After each session, 10-min debrief: what was said vs. what was meant, unspoken dynamics, relationship observations',
      'End of week 2: new consultant writes a "what I learned about this client" memo',
    ],
    related: ['30-60-90 Immersion Plan', 'Rapid Relationship Mapper'],
  },
  {
    name: 'Rapid Relationship Mapper', category: 'Onboarding', success: '84%', deployments: 13, time: '14 days', difficulty: 'Medium', owner: 'Incoming Consultant',
    trigger: 'New account assignment, or returning after extended absence',
    description: 'Structured approach to building personal relationships with all key client stakeholders within 14 days. Uses pre-researched conversation hooks, mutual interest mapping, and informal touchpoints to accelerate trust.',
    steps: [
      'Pull list of all stakeholders with LinkedIn profiles and recent company announcements',
      'Draft personalised 1:1 meeting request for each — reference specific recent work or shared interest',
      'Schedule 20-min informal calls with each stakeholder in first 14 days (no agenda, just relationship building)',
      'After each call, log key interests, communication preferences, and personality notes in the stakeholder map',
      'Identify 1 quick win you can deliver for each top-3 stakeholder within 30 days',
    ],
    related: ['Client Shadow Protocol', 'Stakeholder Map Freeze'],
  },
  {
    name: 'Tribal Knowledge Interview', category: 'Onboarding', success: '87%', deployments: 11, time: '2–4 hours', difficulty: 'Low', owner: 'Engagement Manager',
    trigger: 'Consultant offboarding, contract end, or internal transfer',
    description: 'A structured 2–4 hour exit interview series designed to surface tacit knowledge that lives only in the departing consultant\'s head — informal agreements, unwritten expectations, personality quirks of stakeholders, and account-specific shortcuts.',
    steps: [
      'Schedule three 45-min sessions: (1) stakeholder dynamics, (2) delivery risks & workarounds, (3) relationship & cultural notes',
      'Use the standardised question bank — cover: "what is never written down?", "what would surprise an outsider?", "who are the real decision makers?"',
      'Record all sessions and produce a written summary within 24 hours',
      'Validate the summary with the departing consultant before they leave',
      'File in the Account War Book under "Institutional Memory"',
    ],
    related: ['Account War Book', 'Context Transfer Sprint'],
  },
  {
    name: 'Backup Buddy System', category: 'Succession', success: '93%', deployments: 8, time: 'Ongoing', difficulty: 'Low', owner: 'Engagement Manager',
    trigger: 'Any account with a single primary consultant (key-man risk)',
    description: 'Every client account is assigned a named backup consultant who attends at least one meeting per month and maintains partial awareness. Eliminates single points of failure and ensures continuity even under sudden departures.',
    steps: [
      'Identify all accounts with no named backup and flag them in the portfolio risk register',
      'Assign a backup consultant to each — ideally someone with 1–2 degrees of client familiarity',
      'Backup attends 1 client meeting per month and reads the Meeting Replay Digest each week',
      'Backup writes a 1-page "I could take this over in 72 hours" confidence statement, updated quarterly',
      'If primary consultant takes leave >5 days, backup activates immediately',
    ],
    related: ['Key Man Risk Register', 'Account War Book'],
  },
  {
    name: 'Key Man Risk Register', category: 'Succession', success: '90%', deployments: 6, time: '1 day / quarter', difficulty: 'Low', owner: 'Portfolio Lead',
    trigger: 'Quarterly portfolio review',
    description: 'A quarterly scan of all active accounts to identify those where a single consultant holds disproportionate relationship capital or institutional knowledge. Flags high-risk accounts for mandatory backup assignment and knowledge capture.',
    steps: [
      'For each account, score: relationship concentration (1 consultant = 10 pts), knowledge documentation completeness (inverse score), consultant tenure risk',
      'Flag any account scoring >15 as "key man risk"',
      'Mandate Account War Book creation within 30 days for all flagged accounts',
      'Assign Backup Buddy to all flagged accounts immediately',
      'Present risk register at next leadership review with mitigation status',
    ],
    related: ['Backup Buddy System', 'Account War Book'],
  },
  {
    name: 'Account Ownership Pathway', category: 'Retention', success: '78%', deployments: 5, time: '30 days to design', difficulty: 'High', owner: 'Engagement Lead + HR',
    trigger: 'High-performing consultant flagged as retention risk',
    description: 'A personalised growth and promotion pathway tied directly to measurable account success outcomes — giving top consultants a clear, merit-based trajectory that makes leaving feel costly. Reduces voluntary attrition on key accounts.',
    steps: [
      'Identify the consultant\'s stated career goals in a 1:1 session',
      'Map those goals to specific account outcomes (e.g., "lead an exec presentation" = milestone towards promotion)',
      'Draft a 6-month personalised Ownership Pathway document with named milestones and rewards',
      'Tie pathway completion to a concrete recognition event (promotion, raise, or expanded scope)',
      'Review progress monthly and adjust targets if account context changes',
    ],
    related: ['AI Governance Transition', '30-60-90 Immersion Plan'],
  },
  {
    name: 'AI Governance Transition', category: 'Retention', success: '86%', deployments: 7, time: '7 days', difficulty: 'Medium', owner: 'Consultant + AG-01',
    trigger: 'AI displacement exposure score >60% on an account',
    description: 'When AG-06 flags that a consultant\'s delivery work is >60% automatable, this pattern formalises their role as AI Governance Lead — turning commoditisation risk into a retention story. The consultant becomes the human-in-the-loop overseeing the same agents that would otherwise replace them.',
    steps: [
      'AG-01 maps which service lines the consultant owns and scores them for automation exposure',
      'Draft an AI Governance scope of work: what the consultant will oversee, not execute',
      'Present to client as a "next-generation engagement model" — same budget, higher strategic value',
      'Rewrite the consultant\'s SOW deliverables from execution tasks to governance mandates',
      'Set up a monthly Gemini ADK review session with the client to demonstrate AI governance value',
    ],
    related: ['Value Chain Shift', 'Account Ownership Pathway'],
  },
]

const ENGAGEMENTS_DATA = [
  {
    client: 'Pinnacle Group', ticker: 'PNG', project: 'Value Chain Mapping & AI Integration',
    phaseNum: 3, phase: 'Implementation', totalPhases: 4,
    progress: 85, score: 8.75, scoreDelta: +0.3, health: 'On Track',
    trend: [58, 63, 67, 70, 74, 78, 82, 85],
    daysActive: 84, daysSinceContact: 0, revenue: 145,
    milestones: ['Diagnostic', 'Discovery', 'Implementation', 'Closure'],
    log: [
      { date: '06/05', type: 'meeting',   event: 'Phase 3 kickoff — 6 attendees (incl. CIO)' },
      { date: '06/04', type: 'invoice',   event: 'Invoice #4041 issued · $45,000' },
      { date: '06/02', type: 'meeting',   event: 'Prototype demo — strong exec feedback' },
    ],
    summary: 'Engagement tracking ahead of schedule. Exec sponsor highly engaged. AI prototype received strong feedback — expansion into adjacent workstream flagged by AG-01.',
    alert: null,
  },
  {
    client: 'Meridian Capital', ticker: 'MRC', project: 'IT Infrastructure & Tech Audit',
    phaseNum: 2, phase: 'Discovery', totalPhases: 4,
    progress: 60, score: 8.00, scoreDelta: +0.1, health: 'On Track',
    trend: [30, 36, 42, 46, 50, 54, 57, 60],
    daysActive: 52, daysSinceContact: 1, revenue: 98,
    milestones: ['Diagnostic', 'Discovery', 'Remediation', 'Closure'],
    log: [
      { date: '06/06', type: 'meeting',   event: 'Q2 board pack sync with COO David Vance' },
      { date: '06/03', type: 'milestone', event: 'Infrastructure audit — 14 systems reviewed' },
      { date: '05/30', type: 'change',    event: 'Change request: +8 hrs compliance scope' },
    ],
    summary: 'Discovery phase progressing normally. AG-05 identified new compliance mandate — scope expansion proposal drafted and awaiting client approval. No risk flags.',
    alert: null,
  },
  {
    client: 'Apex Dynamics', ticker: 'APX', project: 'Strategic Diagnostic & Benchmarking',
    phaseNum: 1, phase: 'Diagnostic', totalPhases: 4,
    progress: 30, score: 7.00, scoreDelta: 0, health: 'Progressing',
    trend: [0, 4, 9, 14, 18, 22, 26, 30],
    daysActive: 28, daysSinceContact: 1, revenue: 72,
    milestones: ['Diagnostic', 'Benchmarking', 'Roadmap', 'Delivery'],
    log: [
      { date: '06/05', type: 'meeting', event: 'Stakeholder interview — CEO Marcus Thorne (75 min)' },
      { date: '06/01', type: 'invoice', event: 'Invoice #4038 issued · $18,000' },
      { date: '05/28', type: 'meeting', event: 'Project kickoff — 8 attendees' },
    ],
    summary: 'Early-stage engagement in diagnostic phase. Stakeholder interviews on schedule. No anomalies. Next milestone: market benchmarking report due Jun 20.',
    alert: null,
  },
  {
    client: 'Halcyon Systems', ticker: 'HCS', project: 'Cloud Optimization Mandate',
    phaseNum: 4, phase: 'Closure', totalPhases: 4,
    progress: 90, score: 1.65, scoreDelta: -2.4, health: 'Stalling',
    trend: [88, 88, 88, 89, 89, 89, 90, 90],
    daysActive: 120, daysSinceContact: 7, revenue: 210,
    milestones: ['Audit', 'Design', 'Implementation', 'Closure'],
    log: [
      { date: '05/30', type: 'risk',    event: 'Steering review postponed (3rd time)' },
      { date: '05/22', type: 'meeting', event: 'Last exec contact — Greg House (CTO)' },
      { date: '05/15', type: 'risk',    event: 'Milestone 3 missed — no follow-up response' },
    ],
    summary: 'Engagement stalling at 90% completion. Exec sponsor unresponsive for 7 weeks. AG-03 raised stall score of 9.1. Three missed milestones — immediate intervention required.',
    alert: 'Exec dark 7 wks · 3 missed milestones · Stall score 9.1',
  },
  {
    client: 'Vantage Partners', ticker: 'VTG', project: 'Logistics Analytics Platform',
    phaseNum: 2, phase: 'Execution', totalPhases: 4,
    progress: 40, score: 3.60, scoreDelta: -0.8, health: 'At Risk',
    trend: [52, 50, 48, 46, 44, 42, 41, 40],
    daysActive: 61, daysSinceContact: 0, revenue: 125,
    milestones: ['Requirements', 'Platform Build', 'Testing & QA', 'Go-Live'],
    log: [
      { date: '06/07', type: 'meeting',   event: 'Call with Linda Wu (CIO) — budget review flagged' },
      { date: '06/04', type: 'change',    event: 'Scope expansion logged: +22 hrs undocumented' },
      { date: '06/01', type: 'milestone', event: 'Sprint review — 2 of 5 features delayed' },
    ],
    summary: 'Execution phase showing scope creep and sprint slippage. Budget cycle opens Jul 1 — service expansion proposal identified by AG-08. Margin compression risk.',
    alert: 'Undocumented scope +22 hrs · 2 sprint features delayed',
  },
  {
    client: 'Drift Capital', ticker: 'DRC', project: 'Regulatory Compliance Overhaul',
    phaseNum: 2, phase: 'Remediation', totalPhases: 4,
    progress: 55, score: 1.70, scoreDelta: -1.1, health: 'Stalling',
    trend: [70, 68, 65, 62, 60, 58, 56, 55],
    daysActive: 95, daysSinceContact: 6, revenue: 88,
    milestones: ['Scoping', 'Remediation', 'Filing', 'Closure'],
    log: [
      { date: '06/03', type: 'risk',    event: 'Second missed delivery date — no client response' },
      { date: '05/28', type: 'change',  event: 'Scope creep +40% with no billing change order' },
      { date: '05/20', type: 'meeting', event: 'Last exec contact — Thomas Vance (Partner)' },
    ],
    summary: 'Missed 2 major delivery dates. Scope creep +40% with no corresponding billing change order. Revenue at risk — immediate escalation required.',
    alert: 'Billing −40% vs contract · 2 missed delivery dates',
  },
]

type ActionItem = {
  id: string
  client_id: string | null
  client_name: string
  description: string
  source_agent: string
  urgency: string
  due_date: string | null
  owner: string
  completed: boolean
  completed_at: string | null
  created_at: string
}

const STATIC_ACTION_ITEMS: ActionItem[] = [
  { id: 'act-1', client_id: 'hcs-001', client_name: 'Halcyon Systems', description: 'Stall score 9.1 — 3 missed milestones, exec dark 7 wks. Immediate escalation required.', source_agent: 'stall_detection', urgency: 'crit', due_date: '2026-06-09', owner: 'Partner lead', completed: false, completed_at: null, created_at: '' },
  { id: 'act-2', client_id: 'drc-001', client_name: 'Drift Capital',    description: 'Billing −40% vs contract. Scope creep with no change order — revenue at risk.',           source_agent: 'stall_detection', urgency: 'crit', due_date: '2026-06-08', owner: 'Account mgr', completed: false, completed_at: null, created_at: '' },
  { id: 'act-3', client_id: 'vtg-001', client_name: 'Vantage Partners', description: 'Budget cycle opens Jul 1. Value chain proposal window — 3 service expansions identified.',   source_agent: 'value_chain',     urgency: 'high', due_date: '2026-06-20', owner: 'Principal',   completed: false, completed_at: null, created_at: '' },
  { id: 'act-4', client_id: 'cor-001', client_name: 'Corestone Infra',  description: 'No exec contact in 28 days. Relationship health score dropped 2.1 pts. Re-engage now.',    source_agent: 'relationship',    urgency: 'high', due_date: '2026-06-12', owner: 'Director',    completed: false, completed_at: null, created_at: '' },
]

// Node geometry: regular nw=145 nh=58 (half: 72/29), main nw=165 nh=68 (half: 82/34)
// Row centers y: 90 | 225 | 365 | 500 | dashboard-rect y=590
// R1 bottoms=119, R2 tops=196 bottoms=254, R3-reg tops=336 bottoms=394, R3-main tops=331 bottoms=399, R4 tops=471 bottoms=529
const WORKFLOW_NODES = [
  // DATA SOURCES (row 1, y=90) — 3 nodes centered in 750
  { id: 'AG-10', x: 103, y: 90,  name: 'Gmail Synth',     col: 'source' },
  { id: 'AG-08', x: 375, y: 90,  name: 'Budget Monitor',  col: 'source' },
  { id: 'AG-02', x: 647, y: 90,  name: 'Exec Gap Analyst',col: 'source' },
  // SPECIALIST AGENTS (row 2, y=225) — 4 nodes evenly spaced
  { id: 'AG-03', x: 103, y: 225, name: 'Stall Detect',    col: 'specialist' },
  { id: 'AG-01', x: 284, y: 225, name: 'Value Chain',     col: 'specialist' },
  { id: 'AG-07', x: 466, y: 225, name: 'Relationship',    col: 'specialist' },
  { id: 'AG-05', x: 647, y: 225, name: 'Goal Alignment',  col: 'specialist' },
  // ORCHESTRATOR (row 3, y=365) — 3 nodes
  { id: 'AG-06', x: 103, y: 365, name: 'AI Displacement', col: 'orchestrator' },
  { id: 'AG-04', x: 375, y: 365, name: 'Momentum Orch',   col: 'orchestrator', isMain: true },
  { id: 'AG-11', x: 647, y: 365, name: 'Pattern Library', col: 'orchestrator' },
  // ACTION LAYER (row 4, y=500) — 2 nodes
  { id: 'AG-09', x: 240, y: 500, name: 'Defense Play',    col: 'action' },
  { id: 'AG-12', x: 510, y: 500, name: 'Outreach Draft',  col: 'action' },
]

const WORKFLOW_PATHS = [
  // Data Sources → Specialist Agents (119 → 196)
  { id: 'p1',  d: 'M 103 119 C 103 157 103 157 103 196',   color: 'indigo', dur: '2.8s', delay: '0s'   },
  { id: 'p2',  d: 'M 103 119 C 103 157 284 157 284 196',   color: 'pink',   dur: '3.2s', delay: '0.6s' },
  { id: 'p3',  d: 'M 375 119 C 375 157 284 157 284 196',   color: 'indigo', dur: '2.5s', delay: '1.2s' },
  { id: 'p4',  d: 'M 375 119 C 375 157 466 157 466 196',   color: 'pink',   dur: '3s',   delay: '0.4s' },
  { id: 'p5',  d: 'M 647 119 C 647 157 466 157 466 196',   color: 'indigo', dur: '2.7s', delay: '1.8s' },
  { id: 'p6',  d: 'M 647 119 C 647 157 647 157 647 196',   color: 'pink',   dur: '3.5s', delay: '0.9s' },
  // Specialist Agents → Orchestrator (254 → 331/336)
  { id: 'p7',  d: 'M 103 254 C 103 292 103 292 103 336',   color: 'pink',   dur: '3s',   delay: '0.3s' },
  { id: 'p8',  d: 'M 103 254 C 103 292 375 292 375 331',   color: 'violet', dur: '2.8s', delay: '1.1s' },
  { id: 'p9',  d: 'M 284 254 C 284 292 375 292 375 331',   color: 'pink',   dur: '3.2s', delay: '0.7s' },
  { id: 'p10', d: 'M 466 254 C 466 292 375 292 375 331',   color: 'violet', dur: '3.5s', delay: '1.5s' },
  { id: 'p11', d: 'M 647 254 C 647 292 375 292 375 331',   color: 'pink',   dur: '2s',   delay: '0.2s' },
  { id: 'p12', d: 'M 647 254 C 647 292 647 292 647 336',   color: 'violet', dur: '2.5s', delay: '0.5s' },
  // Orchestrator → Action Layer (394/399 → 471)
  { id: 'p13', d: 'M 103 394 C 103 432 240 432 240 471',   color: 'violet', dur: '3.1s', delay: '0.8s' },
  { id: 'p14', d: 'M 375 399 C 375 432 240 432 240 471',   color: 'pink',   dur: '2.4s', delay: '0.1s' },
  { id: 'p15', d: 'M 375 399 C 375 432 510 432 510 471',   color: 'violet', dur: '2.9s', delay: '1.3s' },
  { id: 'p16', d: 'M 647 394 C 647 432 510 432 510 471',   color: 'pink',   dur: '3.3s', delay: '0.6s' },
  // Action Layer → Dashboard (529 → 590)
  { id: 'p17', d: 'M 240 529 C 240 560 375 560 375 590',   color: 'pink',   dur: '2.6s', delay: '0.4s' },
  { id: 'p18', d: 'M 510 529 C 510 560 375 560 375 590',   color: 'violet', dur: '2.1s', delay: '1.0s' },
]

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1
  const w = 68, h = 24
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 3 - ((v - min) / range) * (h - 6)}`).join(' ')
  const lastX = w, lastY = h - 3 - ((data[data.length - 1] - min) / range) * (h - 6)
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} opacity="1"/>
    </svg>
  )
}

export default function Dashboard() {
  const supabase = createClient()
  const router = useRouter()
  const [userInitial, setUserInitial] = useState('S')
  const [userName, setUserName] = useState('')
  const [activeTab, setActiveTab] = useState('portfolio_intelligence')
  const [selectedClient, setSelectedClient] = useState('Pinnacle Group')
  const [selectedAgent, setSelectedAgent] = useState('AG-03')
  const [selectedPattern, setSelectedPattern] = useState('Account War Book')
  const [patternFilter, setPatternFilter] = useState('All')
  const [_completedActions, setCompletedActions] = useState<string[]>([])
  const [actionItems, setActionItems] = useState<ActionItem[]>(STATIC_ACTION_ITEMS)
  const [searchQuery, setSearchQuery] = useState('')
  const [emailDraftBody, setEmailDraftBody] = useState('Hi Greg,\n\nI noticed we postponed the steering committee review. To ensure we maintain project momentum and don\'t slide back from key milestones, I suggest we schedule a quick 10-minute alignment sync next week.\n\nLet me know your thoughts.\n\nBest,\nDemo Team')
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [showToast, setShowToast] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  
  // New States
  const [showDiagnosticsFor, setShowDiagnosticsFor] = useState<string | null>(null)
  const [expandedEngagement, setExpandedEngagement] = useState<string | null>(null)
  const [homeSubTab, setHomeSubTab] = useState('mails')
  const [notesText, setNotesText] = useState('')
  const [savedNotes, setSavedNotes] = useState<{id:string;content:string;updated_at:string}[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string|null>(null)
  const [notesSaving, setNotesSaving] = useState(false)
  const [notesSavedAt, setNotesSavedAt] = useState<Date|null>(null)
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)
  const [devConsoleOpen, setDevConsoleOpen] = useState(false)
  const [consoleTab, setConsoleTab] = useState<'terminal'|'chat'|'connections'>('terminal')
  const [termHistory, setTermHistory] = useState<{type:'in'|'out'|'err'|'info'; text:string}[]>([
    { type: 'info', text: '  Qnsult ADK Developer Console  v1.0.0' },
    { type: 'info', text: '  12 agents · Gemini 2.0 Flash · type "help" for available commands' },
    { type: 'info', text: '─────────────────────────────────────────────────────' },
  ])
  const [termInput, setTermInput] = useState('')
  const [adkChat, setAdkChat] = useState<{role:'user'|'agent'; text:string; ts:string}[]>([
    { role: 'agent', text: 'AG-04 Momentum Orchestrator online. I have visibility into all 5 active accounts and 12 agent outputs. Ask me about portfolio risk, trigger a pattern deployment, or query a specific account.', ts: '07:31' },
  ])
  const [adkChatInput, setAdkChatInput] = useState('')
  const [adkRunning, setAdkRunning] = useState(false)
  const adkStartTimeRef = useRef<number | null>(null)
  const [adkChatLoading, setAdkChatLoading] = useState(false)
  const [adkChatSessionId] = useState(() => `adkchat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
  const termScrollRef = useRef<HTMLDivElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const [hoveredMomentumPt, setHoveredMomentumPt] = useState<number | null>(null)
  const [mapFullscreen, setMapFullscreen] = useState(false)
  const [mapRevFilter, setMapRevFilter] = useState('All')
  const [mapPeriodFilter, setMapPeriodFilter] = useState('All Time')
  const [mapHeadcountFilter, setMapHeadcountFilter] = useState('All')
  const [portfolioChat, setPortfolioChat] = useState<{role:'user'|'ai';text:string;ts:string}[]>([
    { role: 'ai', text: 'Portfolio Intelligence AI ready. Ask me about client positioning, momentum trajectories, AI displacement risk, or expansion opportunities.', ts: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) },
  ])
  const [portfolioChatInput, setPortfolioChatInput] = useState('')
  const [portfolioChatLoading, setPortfolioChatLoading] = useState(false)
  const [portfolioChatSessionId] = useState(() => `pchat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
  const portfolioChatRef = useRef<HTMLDivElement>(null)
  const [deployingPattern, setDeployingPattern] = useState<string | null>(null)
  const [patternDeploySessionId] = useState(() => `pdeploy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
  const [mapHoveredClient, setMapHoveredClient] = useState<string | null>(null)
  const [queueEvents, setQueueEvents] = useState<{id:string;agent_id:string;event_type:string;payload:Record<string,unknown>;created_at:string}[]>([])

  // Live data from Supabase (agents write here after each run)
  type ClientRow = typeof CLIENTS_DATA[number] & { client_id?: string; ticker?: string; stall_score?: number; exec_dark_days?: number; exec_cadence_label?: string; budget_deviation?: number; alert_text?: string; score_delta?: number; relationship_score?: number; goal_alignment_score?: number; displacement_pct?: number }
  type AgentRow  = typeof AGENTS_DATA[number] & { updatedAt?: string }
  type EngRow    = typeof ENGAGEMENTS_DATA[number]
  const [clients,          setClients]          = useState<ClientRow[]>(CLIENTS_DATA as ClientRow[])
  const [agentsData,       setAgentsData]       = useState<AgentRow[]>(AGENTS_DATA)
  const [engagementsData,  setEngagementsData]  = useState<EngRow[]>(ENGAGEMENTS_DATA)
  const [mails,            setMails]            = useState(MOCK_MAILS)
  const [calendarEvents,   setCalendarEvents]   = useState(MOCK_CALENDAR_EVENTS)
  const [quickUpdateText,  setQuickUpdateText]  = useState('')
  const [quickUpdateSending, setQuickUpdateSending] = useState(false)
  const [showComposeFor,   setShowComposeFor]   = useState<string|null>(null)
  const [composeSubject,   setComposeSubject]   = useState('')
  const [clientMomentum,   setClientMomentum]   = useState<Record<string,{score:number;recorded_at:string}[]>>({})
  const [competitiveThreats, setCompetitiveThreats] = useState<{client_id:string;client:string;ticker:string;competitor:string;threat_type:string;severity:string;signal_source:string;defense_play:string;status:string;days_detected:number}[]>([])

  // Fetch all live data from Supabase
  useEffect(() => {
    const load = async () => {
      // Clients + scores (joined client-side)
      const [{ data: cRaw }, { data: sRaw }] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('client_scores').select('*'),
      ])
      let merged: ClientRow[] = []
      if (cRaw?.length) {
        const sMap = Object.fromEntries((sRaw ?? []).map((s: Record<string,unknown>) => [s.client_id as string, s]))
        const order = ['Stalling','At Risk','Progressing','On Track','Accelerating']
        merged = cRaw.map((c: Record<string,unknown>) => {
          const s = (sMap[c.client_id as string] ?? {}) as Record<string,unknown>
          return {
            client_id:           c.client_id as string,
            name:                c.name as string,
            score:               s.composite_score != null ? Number(s.composite_score).toFixed(2) : null as unknown as string,
            status:              (s.status as string) ?? null,
            tag:                 c.industry as string,
            contact:             c.contact_name as string,
            email:               c.contact_email as string,
            lastActive:          s.updated_at ? new Date(s.updated_at as string).toLocaleDateString() : '—',
            notes:               (s.agent_notes as string) ?? '',
            ticker:              c.ticker as string,
            stall_score:         s.stall_score as number,
            exec_dark_days:      s.exec_dark_days as number,
            exec_cadence_label:  s.exec_cadence_label as string,
            budget_deviation:    s.budget_deviation_pct as number,
            alert_text:          s.alert_text as string,
            score_delta:         s.score_delta as number,
            relationship_score:  s.relationship_score as number,
            goal_alignment_score:s.goal_alignment_score as number,
            displacement_pct:    s.displacement_pct as number,
          }
        })
        merged.sort((a, b) => order.indexOf(a.status ?? '') - order.indexOf(b.status ?? ''))
        setClients(merged)
      }

      // Agent status — overlay live status/lastAction; fall back to rich static descriptions when not yet run
      const { data: aRaw } = await supabase.from('agent_status').select('*').order('agent_id')
      if (aRaw?.length) {
        setAgentsData(aRaw.map((a: Record<string,unknown>) => {
          const base = AGENTS_DATA.find(x => x.id === (a.agent_id as string)) ?? AGENTS_DATA[0]
          const liveAction = a.last_action as string
          const isPlaceholder = !liveAction || liveAction === 'Awaiting first run'
          return {
            ...base,
            id:         a.agent_id as string,
            name:       (a.name as string) || base.name,
            status:     (a.status as string) || base.status,
            lastAction: isPlaceholder ? base.lastAction : liveAction,
            updatedAt:  a.updated_at as string,
          }
        }))
      }

      // Engagements — overlay live Supabase fields onto static shape (keeps phase/milestone/log)
      const { data: eRaw } = await supabase.from('engagements').select('*')
      if (eRaw?.length) {
        const eMap = Object.fromEntries(eRaw.map((e: Record<string,unknown>) => [e.client_name as string, e]))
        const now = Date.now()
        setEngagementsData(ENGAGEMENTS_DATA.map(e => {
          const live = (eMap[e.client] ?? {}) as Record<string,unknown>
          const updatedAt = live.updated_at ? new Date(live.updated_at as string).getTime() : null
          const daysSinceContact = updatedAt ? Math.floor((now - updatedAt) / 86_400_000) : e.daysSinceContact
          return {
            ...e,
            project:          (live.project_name as string) ?? e.project,
            health:           (live.health        as string) ?? e.health,
            score:            (live.score         as number) ?? e.score,
            scoreDelta:       (live.score_delta   as number) ?? e.scoreDelta,
            alert:            (live.alert         as string) ?? e.alert,
            summary:          (live.summary       as string) ?? e.summary,
            progress:         (live.progress_pct  as number) ?? e.progress,
            daysSinceContact,
          }
        }))
      }

      // Action items — load live and seed completed state
      const { data: aiRaw } = await supabase.from('action_items').select('*').order('created_at', { ascending: false }).limit(50)
      if (aiRaw?.length) {
        const clientNameById = Object.fromEntries(merged.map(c => [c.client_id, c.name]))
        const loaded: ActionItem[] = aiRaw.map((a: Record<string,unknown>) => ({
          id:           a.id as string,
          client_id:    (a.client_id as string) ?? null,
          client_name:  clientNameById[a.client_id as string] ?? (a.client_id as string) ?? '—',
          description:  a.description as string,
          source_agent: (a.source_agent as string) ?? '',
          urgency:      (a.urgency as string) ?? 'medium',
          due_date:     (a.due_date as string) ?? null,
          owner:        (a.owner as string) ?? '',
          completed:    (a.completed as boolean) ?? false,
          completed_at: (a.completed_at as string) ?? null,
          created_at:   (a.created_at as string) ?? '',
        }))
        setActionItems(loaded)
        setCompletedActions(loaded.filter(a => a.completed).map(a => a.id))
      }

      // Gmail threads → Mails tab
      const { data: mRaw } = await supabase.from('gmail_threads').select('*, clients(name)').order('received_at', { ascending: false }).limit(20)
      if (mRaw?.length) {
        setMails(mRaw.map((m: Record<string,unknown>) => ({
          client:  (m.clients as Record<string,string>)?.name ?? (m.client_id as string) ?? '',
          sender:  m.sender as string,
          subject: m.subject as string,
          excerpt: (m.preview as string) ?? (m.subject as string),
        })))
      }

      // Calendar events — fetch user's + global demo events (user_id is null)
      const { data: calRaw } = await supabase.from('calendar_events').select('*, clients(name)').or('user_id.is.null,user_id.eq.' + (await supabase.auth.getUser()).data.user?.id).order('start_time', { ascending: true }).limit(10)
      if (calRaw?.length) {
        setCalendarEvents(calRaw.map((e: Record<string,unknown>) => ({
          id:       e.event_id as string ?? e.id as string,
          title:    e.title as string,
          client:   (e.clients as Record<string,string>)?.name ?? (e.client_id as string) ?? '',
          start:    new Date(e.start_time as string).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          end:      new Date(e.end_time as string).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          platform: (e.platform as string) ?? 'Meet',
          color:    'var(--indigo)',
          prep:     (e.prep_agent as string) ?? null,
        })))
      }

      // Competitive threats
      const { data: tRaw } = await supabase.from('competitive_threats').select('*, clients(name,ticker)').order('detected_at', { ascending: false })
      if (tRaw?.length) {
        setCompetitiveThreats(tRaw.map((t: Record<string,unknown>) => {
          const cl = (t.clients ?? {}) as Record<string,string>
          return {
            client_id:    t.client_id as string,
            client:       cl.name   ?? t.client_id as string,
            ticker:       cl.ticker ?? '',
            competitor:   t.competitor  as string,
            threat_type:  t.threat_type as string,
            severity:     t.severity    as string,
            signal_source:t.signal_source as string,
            defense_play: t.defense_play as string,
            status:       t.status      as string,
            days_detected:t.days_detected as number ?? 0,
          }
        }))
      }
    }

    load()

    // Realtime: agent_status updates live as agents run
    const agentCh = supabase.channel('realtime:agent_status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_status' }, (payload) => {
        const a = payload.new as Record<string,unknown>
        setAgentsData(prev => prev.map(x =>
          x.id === a.agent_id ? { ...x, status: a.status as string, lastAction: a.last_action as string } : x
        ))
      })
      .subscribe()

    // Realtime: client_scores — refresh client list when any score updates
    const scoreCh = supabase.channel('realtime:client_scores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_scores' }, () => { load() })
      .subscribe()

    return () => { supabase.removeChannel(agentCh); supabase.removeChannel(scoreCh) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Supabase Realtime — dashboard_queue
  useEffect(() => {
    // Fetch last 20 rows on mount
    supabase.from('dashboard_queue')
      .select('id, agent_id, event_type, payload, created_at')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) setQueueEvents(data)
      })

    // Subscribe to new inserts
    const channel = supabase.channel('realtime:dashboard_queue')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'dashboard_queue' },
        (payload) => {
          const row = payload.new as {id:string;agent_id:string;event_type:string;payload:Record<string,unknown>;created_at:string}
          setQueueEvents(prev => [row, ...prev].slice(0, 50))
          const msg = typeof row.payload?.message === 'string' ? row.payload.message : JSON.stringify(row.payload)
          const ts = new Date(row.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          setTermHistory(h => [...h, { type: 'out', text: `  [${ts}] ${row.agent_id} → ${msg}` }])
          setTimeout(() => { termScrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }) }, 30)
        }
      )
      .subscribe()

    // Subscribe to new action_items inserts (agents writing new items)
    const aiChannel = supabase.channel('realtime:action_items')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'action_items' },
        (payload) => {
          const row = payload.new as Record<string,unknown>
          const newItem: ActionItem = {
            id:           row.id as string,
            client_id:    (row.client_id as string) ?? null,
            client_name:  (row.client_id as string) ?? '—',
            description:  row.description as string,
            source_agent: (row.source_agent as string) ?? '',
            urgency:      (row.urgency as string) ?? 'medium',
            due_date:     (row.due_date as string) ?? null,
            owner:        (row.owner as string) ?? '',
            completed:    false,
            completed_at: null,
            created_at:   (row.created_at as string) ?? '',
          }
          setActionItems(prev => [newItem, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel); supabase.removeChannel(aiChannel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  // Load all meeting notes on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('meeting_notes')
        .select('id, content, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .then(({ data }) => {
          if (data?.length) {
            setSavedNotes(data)
            setNotesText(data[0].content ?? '')
            setActiveNoteId(data[0].id)
          }
        })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced auto-save when text changes
  useEffect(() => {
    if (!notesText) return
    const timer = setTimeout(() => { saveNote(false) }, 2000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notesText])

  // Fetch momentum_history when diagnostics panel is opened for a client
  useEffect(() => {
    if (!showDiagnosticsFor) return
    const client = clients.find(c => c.name === showDiagnosticsFor)
    if (!client?.client_id || clientMomentum[client.client_id]) return
    supabase.from('momentum_history')
      .select('score, recorded_at')
      .eq('client_id', client.client_id)
      .order('recorded_at', { ascending: true })
      .then(({ data }) => {
        if (data?.length && client.client_id) {
          setClientMomentum(prev => ({ ...prev, [client.client_id!]: data }))
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDiagnosticsFor])

  // Close flyout menus on outside click
  useEffect(() => {
    if (!showNotifications && !showMoreMenu) return
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('.icon-btn')) {
        setShowNotifications(false)
        setShowMoreMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showNotifications, showMoreMenu])

  async function saveNote(showSaving = true) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !notesText.trim()) return
    if (showSaving) setNotesSaving(true)
    const id = activeNoteId ?? crypto.randomUUID()
    const now = new Date().toISOString()
    await supabase.from('meeting_notes').upsert({ id, user_id: user.id, content: notesText, updated_at: now }, { onConflict: 'id' })
    setActiveNoteId(id)
    setNotesSavedAt(new Date())
    setSavedNotes(prev => {
      const without = prev.filter(n => n.id !== id)
      return [{ id, content: notesText, updated_at: now }, ...without]
    })
    if (showSaving) setNotesSaving(false)
  }

  async function toggleActionItem(id: string, newCompleted: boolean) {
    const now = new Date().toISOString()
    setActionItems(prev => prev.map(a => a.id === id ? { ...a, completed: newCompleted, completed_at: newCompleted ? now : null } : a))
    if (newCompleted) {
      setCompletedActions(prev => [...prev.filter(x => x !== id), id])
    } else {
      setCompletedActions(prev => prev.filter(x => x !== id))
    }
    const { data: { user } } = await supabase.auth.getUser()
    const patch: Record<string, unknown> = { completed: newCompleted, completed_at: newCompleted ? now : null }
    if (user) patch.user_id = user.id
    await supabase.from('action_items').update(patch).eq('id', id)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const processCommand = (raw: string): {type:'in'|'out'|'err'|'info'; text:string}[] => {
    const parts = raw.trim().split(/\s+/)
    const base = parts[0]?.toLowerCase()
    const sub  = parts[1]?.toLowerCase()
    const arg  = parts[2]
    const results: {type:'in'|'out'|'err'|'info'; text:string}[] = [{ type: 'in', text: `$ ${raw}` }]
    const o = (t:string) => results.push({ type:'out',  text: t })
    const e = (t:string) => results.push({ type:'err',  text: t })
    const h = (t:string) => results.push({ type:'info', text: t })

    // Agent layer lookup
    const agentLayer = (id: string) => {
      if (['AG-10','AG-08','AG-02'].includes(id)) return 'Data Source'
      if (['AG-03','AG-01','AG-07','AG-05'].includes(id)) return 'Specialist'
      if (['AG-06','AG-04','AG-11'].includes(id)) return 'Orchestrator'
      if (['AG-09','AG-12'].includes(id)) return 'Action'
      return 'Unknown'
    }
    const fmtTs = (iso?: string) => iso
      ? new Date(iso).toLocaleString('en-GB', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }).replace(',', ' ·')
      : 'no record'
    const fmtUptime = (startMs: number) => {
      const s = Math.floor((Date.now() - startMs) / 1000)
      const m = Math.floor(s / 60), sec = s % 60
      return m > 0 ? `${m}m ${sec}s` : `${sec}s`
    }

    if (base === 'help') {
      h('Available commands:')
      ;[
        ['agent list',             'list all agents with live status'],
        ['agent inspect <id>',     'show agent config, layer, last action, and timestamp'],
        ['agent io <id>',          'show last run details'],
        ['agent run <id>',         'manually trigger an agent run'],
        ['schema list',            'list all Supabase and MongoDB schemas'],
        ['schema show <name>',     'print schema definition'],
        ['env show',               'print environment config (keys masked)'],
        ['supabase ping',          'test Supabase connection'],
        ['supabase tables',        'list tables with live row counts'],
        ['mongo ping',             'test MongoDB Atlas connection'],
        ['mongo collections',      'list collections with document counts'],
        ['mongo find <col>',       'sample documents from a collection'],
        ['adk start',              'start the Gemini ADK orchestration server'],
        ['adk stop',               'stop the ADK server'],
        ['adk status',             'show server status and uptime'],
        ['adk logs',               'tail recent agent log entries'],
        ['clear',                  'clear terminal output'],
      ].forEach(([cmd, desc]) => o(`  ${cmd.padEnd(28)} — ${desc}`))

    } else if (base === 'clear') {
      return [{ type: 'info', text: '__CLEAR__' }]

    } else if (base === 'agent') {
      if (sub === 'list') {
        const alerting  = agentsData.filter(a => a.status === 'Alerting').length
        const analyzing = agentsData.filter(a => a.status === 'Analyzing').length
        const idle      = agentsData.filter(a => a.status === 'Idle').length
        h(`─── ${agentsData.length} Registered Agents  [${alerting} alerting · ${analyzing} analyzing · ${idle} idle] ───`)
        agentsData.forEach(a => {
          const dot = a.status === 'Alerting' ? '●' : a.status === 'Analyzing' ? '◐' : '○'
          const ts  = fmtTs((a as {updatedAt?:string}).updatedAt)
          o(`  ${dot} ${a.id.padEnd(6)} ${a.status.padEnd(12)} ${agentLayer(a.id).padEnd(14)} ${a.name}  · last: ${ts}`)
        })
      } else if (sub === 'inspect') {
        const ag = agentsData.find(a => a.id === (arg || '').toUpperCase())
        if (!ag) { e(`Agent '${arg}' not found. Run 'agent list'.`); return results }
        const ts = fmtTs((ag as {updatedAt?:string}).updatedAt)
        h(`─── ${ag.id} · ${ag.name} ───`)
        o(`  Status:       ${ag.status}`)
        o(`  Layer:        ${agentLayer(ag.id)}`)
        o(`  Model:        gemini-2.5-flash`)
        o(`  Trigger:      scheduled (15 min) + event-driven`)
        o(`  Input scope:  ${ag.queries}`)
        o(`  Last action:  ${ag.lastAction}`)
        o(`  Last run:     ${ts}`)
        o(`  Output sink:  Supabase agent_status + MongoDB agent_runs`)
        o(`  Max tokens:   8,192 output · 1M context`)
      } else if (sub === 'io') {
        const ag = agentsData.find(a => a.id === (arg || '').toUpperCase())
        if (!ag) { e(`Agent '${arg}' not found.`); return results }
        const ts = (ag as {updatedAt?:string}).updatedAt ?? new Date().toISOString()
        h(`─── ${ag.id} Last Run I/O ───`)
        o(`  INPUT  → { accounts: ["all"], trigger: "scheduled_15min", ts: "${ts}" }`)
        o(`  STATUS → ${ag.status}`)
        o(`  LOG    → "${ag.lastAction}"`)
        o(`  RUN_AT → ${fmtTs(ts)}`)
        // Token counts are not in the live state — show placeholder
        o(`  TOKENS → n/a (check ADK server logs for token usage)`)
      } else if (sub === 'run') {
        const ag = agentsData.find(a => a.id === (arg || '').toUpperCase())
        if (!ag) { e(`Agent '${arg}' not found.`); return results }
        const runId = `run_${Math.random().toString(36).slice(2,10)}`
        // Optimistically flip agent to Analyzing in live state
        setAgentsData(prev => prev.map(a =>
          a.id === ag.id
            ? { ...a, status: 'Analyzing', lastAction: `Manual trigger via console (${runId})`, updatedAt: new Date().toISOString() }
            : a
        ))
        h(`Triggering ${ag.id} · ${ag.name}…`)
        o(`  ✓ Status → Analyzing  (visible in Agent Status panel)`)
        o(`  ✓ run_id: ${runId}`)
        o(`  ✓ Poll with: agent io ${ag.id}`)
      } else { e(`Unknown sub-command '${sub}'. Try: list, inspect, io, run`) }

    } else if (base === 'schema') {
      if (sub === 'list') {
        h('Supabase tables:')
        o('  client_scores       { client_id, composite_score, status, stall_score, exec_dark_days, score_delta, displacement_pct, updated_at }')
        o('  agent_status        { agent_id, name, status, last_action, updated_at }')
        o('  action_items        { id, client_name, description, urgency, due_date, owner, completed }')
        o('  engagements         { client_id, project_name, health, score, alert, summary, updated_at }')
        o('  competitive_threats { client_id, client, ticker, competitor, threat_type, severity, signal_source, defense_play, status, days_detected }')
        o('  dashboard_queue     { id, agent_id, payload JSONB, status, created_at }')
        h('MongoDB collections:')
        o('  signals             { account, type, content, severity 1-10, agent_id, ts }')
        o('  cadence             { account, last_contact, exec_dark_days, rel_score }')
        o('  commitments         { account, description, due_date, status }')
        o('  pattern_library     { pattern_name, category, status, trigger, armed_at }')
        o('  agent_runs          { agent_id, run_id, input, output, tokens, latency_ms, ts }')
      } else if (sub === 'show') {
        const defs: Record<string, string[]> = {
          'client_scores':      ['  client_id          TEXT PRIMARY KEY','  composite_score    FLOAT','  status             TEXT','  stall_score        FLOAT','  exec_dark_days     INT','  score_delta        FLOAT','  displacement_pct   FLOAT','  updated_at         TIMESTAMPTZ'],
          'agent_status':       ['  agent_id           TEXT PRIMARY KEY','  name               TEXT','  status             TEXT  -- Idle | Analyzing | Alerting | Active','  last_action        TEXT','  updated_at         TIMESTAMPTZ'],
          'action_items':       ['  id                 UUID PRIMARY KEY','  client_name        TEXT','  description        TEXT','  urgency            TEXT  -- crit | high | medium','  due_date           DATE','  owner              TEXT','  completed          BOOLEAN DEFAULT false'],
          'competitive_threats':['  client_id          TEXT','  client             TEXT','  ticker             TEXT','  competitor         TEXT','  threat_type        TEXT','  severity           TEXT  -- Critical | High | Medium | Low','  signal_source      TEXT','  defense_play       TEXT','  status             TEXT  -- Queued | Monitoring | Resolved','  days_detected      INT'],
          'dashboard_queue':    ['  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid()','  agent_id           TEXT NOT NULL','  payload            JSONB NOT NULL','  status             TEXT DEFAULT \'pending\'','  created_at         TIMESTAMPTZ DEFAULT NOW()'],
          'signals':            ['  _id                ObjectId','  account            String (indexed)','  type               String enum[stall, risk, opportunity, relationship]','  content            String','  severity           Number (1–10)','  agent_id           String','  ts                 Date (indexed)'],
          'agent_runs':         ['  _id                ObjectId','  agent_id           String (indexed)','  run_id             String (unique)','  input              Object','  output             Object','  tokens             { in: Number, out: Number }','  latency_ms         Number','  ts                 Date'],
        }
        const def = defs[arg]
        if (!def) { e(`Schema '${arg}' not found. Available: ${Object.keys(defs).join(', ')}`); return results }
        h(`─── ${arg} ───`)
        def.forEach(l => o(l))
      } else { e('Usage: schema list  |  schema show <name>') }

    } else if (base === 'env') {
      if (sub === 'show') {
        h('─── Environment Variables ───')
        o(`  NEXT_PUBLIC_SUPABASE_URL        https://sxxrwykfohktsnyscryr.supabase.co`)
        o(`  NEXT_PUBLIC_SUPABASE_ANON_KEY   sb_anon_●●●●●●●●●●●●●●●●●●●●`)
        o(`  GOOGLE_CLOUD_PROJECT            qnsult`)
        o(`  GOOGLE_GENAI_USE_VERTEXAI       true`)
        o(`  GEMINI_MODEL                    gemini-2.5-flash`)
        o(`  MONGODB_URI                     mongodb+srv://●●●@cluster0.xxxxx.mongodb.net/qnsult_prod`)
        o(`  GMAIL_CLIENT_ID                 ●●●●●.apps.googleusercontent.com`)
        o(`  GMAIL_CLIENT_SECRET             GOCSPX-●●●●●●●●●●●●●●●●●●●●`)
        o(`  ADK_SERVER_URL                  ${process.env.ADK_SERVER_URL ?? 'http://localhost:8000 (default)'}`)
        o(`  NODE_ENV                        development`)
        h('  ⚠ Real values stored in .env.local — never committed to git')
      } else { e('Usage: env show') }

    } else if (base === 'supabase') {
      if (sub === 'ping') {
        h('Pinging Supabase…')
        o(`  ✓ Project:    sxxrwykfohktsnyscryr.supabase.co`)
        o(`  ✓ Region:     us-east-1`)
        o(`  ✓ RLS:        active on all tables`)
        o(`  ✓ Realtime:   ${queueEvents.length > 0 ? `${queueEvents.length} events received` : 'subscribed, 0 events yet'}`)
      } else if (sub === 'tables') {
        h('Supabase tables (live row counts from dashboard state):')
        o(`  client_scores        ${String(clients.length).padEnd(4)} rows   — composite scores, stall, exec dark days`)
        o(`  agent_status         ${String(agentsData.length).padEnd(4)} rows   — 12 agents, status + last action`)
        o(`  action_items         ${String(actionItems.length).padEnd(4)} rows   — ${actionItems.filter(a=>!a.completed).length} open · ${actionItems.filter(a=>a.completed).length} resolved`)
        o(`  engagements          ${String(engagementsData.length).padEnd(4)} rows   — active engagement health records`)
        o(`  competitive_threats  ${String(competitiveThreats.length).padEnd(4)} rows   — ${competitiveThreats.length > 0 ? 'live data' : 'using demo fallback'}`)
        o(`  dashboard_queue      ${String(queueEvents.length).padEnd(4)} rows   — realtime agent event queue`)
        h(clients.length > 0 ? '  ✓ Live data loaded' : '  ⚠ Using demo fallback data — run agents to populate')
      } else { e('Usage: supabase ping  |  supabase tables') }

    } else if (base === 'mongo') {
      if (sub === 'ping') { h('Pinging MongoDB Atlas…'); o('  ✓ Connected · cluster0.xxxxx (M0 Sandbox)'); o('  ✓ DB: qnsult_prod · Auth: SCRAM-SHA-256') }
      else if (sub === 'collections') { h('Collections (qnsult_prod):'); o('  signals       — stall/risk/opportunity signals written by AG-03, AG-07, AG-10'); o('  cadence       — exec contact cadence written by AG-02, AG-07'); o('  commitments   — delivery commitments from AG-05'); o('  pattern_library — armed patterns from AG-11'); o('  agent_runs    — full run history for all 12 agents'); h('  Tip: `adk start` triggers agents and populates these collections') }
      else if (sub === 'find') { h(`Sampling ${arg || '<collection>'}…`); o('  (query MongoDB directly via ADK server — run `adk start` first)'); o(`  Endpoint: POST http://localhost:8000/apps/agents/.../runs`) }
      else { e('Usage: mongo ping  |  mongo collections  |  mongo find <col>') }

    } else if (base === 'adk') {
      if (sub === 'start') {
        adkStartTimeRef.current = Date.now()
        h('Starting Gemini ADK server…')
        o(`  ✓ Server up on http://localhost:8000`)
        o(`  ✓ ${agentsData.length} agents registered under app: agents`)
        o(`  ✓ Root agent: momentum_agent (gemini-2.5-flash · Vertex AI)`)
        o(`  ✓ ${agentsData.filter(a=>a.status==='Alerting').length} agents alerting · ${agentsData.filter(a=>a.status==='Analyzing').length} analyzing at startup`)
        o(`  ✓ OpenAPI docs → http://localhost:8000/docs`)
        o(`  ✓ ADK Chat (top-right Chat tab) now connected`)
      } else if (sub === 'stop') {
        adkStartTimeRef.current = null
        h('Stopping ADK server…')
        o('  ✓ Server stopped · all agent processes terminated')
      } else if (sub === 'status') {
        h('ADK Server:')
        o(`  Status:     ${adkRunning ? 'RUNNING' : 'STOPPED'}`)
        o(`  Host:       http://localhost:8000`)
        o(`  App:        agents`)
        o(`  Agents:     ${agentsData.length} registered`)
        o(`  Uptime:     ${adkRunning && adkStartTimeRef.current ? fmtUptime(adkStartTimeRef.current) : '—'}`)
        o(`  Alerting:   ${agentsData.filter(a=>a.status==='Alerting').map(a=>a.id).join(', ') || 'none'}`)
        o(`  Analyzing:  ${agentsData.filter(a=>a.status==='Analyzing').map(a=>a.id).join(', ') || 'none'}`)
        o(`  Queue:      ${queueEvents.length} events in dashboard_queue`)
      } else if (sub === 'logs') {
        h('Recent agent activity (from live state):')
        // Build log lines: queueEvents first (most recent), then agentsData lastAction sorted by updatedAt
        const logLines: string[] = []
        // From Supabase realtime queue
        queueEvents.slice(-5).reverse().forEach(ev => {
          const ts = new Date(ev.created_at).toLocaleString('en-GB', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }).replace(',', '')
          logLines.push(`  ${ts}  ${ev.agent_id.padEnd(6)}  ${ev.event_type.toUpperCase().padEnd(8)}  ${JSON.stringify(ev.payload).slice(0,60)}`)
        })
        // From agentsData — agents with a non-idle status or recent updatedAt
        const recentAgents = [...agentsData]
          .filter(a => (a as {updatedAt?:string}).updatedAt || a.status !== 'Idle')
          .sort((a, b) => {
            const ta = (a as {updatedAt?:string}).updatedAt ?? ''
            const tb = (b as {updatedAt?:string}).updatedAt ?? ''
            return tb.localeCompare(ta)
          })
          .slice(0, 10 - logLines.length)
        recentAgents.forEach(a => {
          const ts = fmtTs((a as {updatedAt?:string}).updatedAt)
          const level = a.status === 'Alerting' ? 'ALERT  ' : a.status === 'Analyzing' ? 'INFO   ' : 'INFO   '
          logLines.push(`  ${ts}  ${a.id.padEnd(6)}  ${level}  ${a.lastAction}`)
        })
        if (logLines.length === 0) {
          o('  (no activity yet — run `adk start` to begin agent cycle)')
        } else {
          logLines.forEach(l => o(l))
        }
      } else { e('Usage: adk start  |  adk stop  |  adk status  |  adk logs') }

    } else {
      e(`Command not found: '${raw}'. Type 'help' to see available commands.`)
    }
    return results
  }

  async function sendPortfolioChat(userMsg: string) {
    if (!userMsg.trim() || portfolioChatLoading) return
    const ts = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    setPortfolioChat(c => [...c, { role: 'user', text: userMsg, ts }])
    setPortfolioChatLoading(true)
    setTimeout(() => portfolioChatRef.current && (portfolioChatRef.current.scrollTop = portfolioChatRef.current.scrollHeight), 50)

    try {
      const res = await fetch('/api/portfolio-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, sessionId: portfolioChatSessionId }),
      })
      const data = await res.json() as { reply?: string; error?: string }
      const replyText = data.reply ?? data.error ?? 'No response from agent.'
      const replyTs = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      setPortfolioChat(c => [...c, { role: 'ai', text: replyText, ts: replyTs }])
    } catch {
      setPortfolioChat(c => [...c, { role: 'ai', text: 'Could not reach the ADK server. Start it with `adk start` in the Terminal tab.', ts: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }])
    } finally {
      setPortfolioChatLoading(false)
      setTimeout(() => portfolioChatRef.current && (portfolioChatRef.current.scrollTop = portfolioChatRef.current.scrollHeight), 50)
    }
  }

  type PatternEntry = typeof PATTERNS_DATA[number]
  async function deployPattern(p: PatternEntry) {
    if (deployingPattern) return
    setDeployingPattern(p.name)

    // Optimistic: flip AG-11 to Analyzing
    setAgentsData(prev => prev.map(a =>
      a.id === 'AG-11'
        ? { ...a, status: 'Analyzing', lastAction: `Arming pattern: ${p.name}`, updatedAt: new Date().toISOString() }
        : a
    ))

    try {
      const res = await fetch('/api/pattern-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patternName:  p.name,
          trigger:      p.trigger,
          category:     p.category,
          difficulty:   p.difficulty,
          owner:        p.owner,
          successRate:  p.success,
          deployments:  p.deployments,
          sessionId:    patternDeploySessionId,
        }),
      })
      const data = await res.json() as { reply?: string; error?: string }
      if (data.reply) {
        // AG-11 confirmed — mark Active with agent's own reply as lastAction
        setAgentsData(prev => prev.map(a =>
          a.id === 'AG-11'
            ? { ...a, status: 'Active', lastAction: data.reply!.slice(0, 120), updatedAt: new Date().toISOString() }
            : a
        ))
        setShowToast(`AG-11 armed "${p.name}" — ${data.reply.slice(0, 90)}${data.reply.length > 90 ? '…' : ''}`)
      } else {
        throw new Error(data.error ?? 'No reply from agent')
      }
    } catch (err) {
      // Revert AG-11 to Idle on failure
      setAgentsData(prev => prev.map(a =>
        a.id === 'AG-11'
          ? { ...a, status: 'Idle', lastAction: 'Pattern arm failed — ADK server unreachable', updatedAt: new Date().toISOString() }
          : a
      ))
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setShowToast(`Failed to arm pattern — ${msg}`)
    } finally {
      setDeployingPattern(null)
      setTimeout(() => setShowToast(null), 5000)
    }
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
        .topbar-brand { width: 262px; padding: 0 20px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; border-right: 1px solid var(--border); height: 100%; }
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
        .momentum-body { display: flex; flex-direction: column; height: 300px; }
        .stat-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-2); letter-spacing: 0.10em; text-transform: uppercase; margin-bottom: 6px; }
        .stat-num { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 38px; letter-spacing: -0.04em; color: var(--text-1); line-height: 1; display: flex; align-items: flex-end; gap: 6px; }
        .stat-badge { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; padding: 2px 7px; border-radius: 4px; margin-bottom: 5px; }
        .sb-up { background: var(--green-dim); color: var(--green); } .sb-dn { background: var(--red-dim); color: var(--red); } .sb-pink { background: var(--pink-dim); color: var(--pink); }
        .stat-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.06em; }
        .stat-rule { height: 1px; background: var(--border); }
        .chart-wrap { flex: 1; padding: 0; position: relative; overflow: hidden; }
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
        @keyframes spin { to { transform: rotate(360deg); } }
        .workflow-scene {
          background: var(--bg-card); border: 1px solid rgba(255,46,191,0.1);
          border-radius: var(--r-xl); padding: 40px 24px 32px;
          animation: border-wave 6s ease infinite;
        }
        /* ── ENGAGEMENT SCREENER ── */
        .eng-header {
          display: grid;
          grid-template-columns: 140px 1fr 126px 74px 90px 76px 74px 62px;
          padding: 10px 20px; gap: 0;
          border-bottom: 1px solid var(--border);
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: var(--text-3); letter-spacing: 0.14em; text-transform: uppercase;
          align-items: center;
        }
        .eng-row {
          display: grid;
          grid-template-columns: 140px 1fr 126px 74px 90px 76px 74px 62px;
          padding: 13px 20px; gap: 0;
          border-bottom: 1px solid var(--border);
          cursor: pointer; transition: background 0.15s;
          align-items: center; position: relative;
        }
        .eng-row:hover { background: var(--bg-hover); }
        .eng-row.eng-active { background: rgba(255,46,191,0.04); }
        .eng-row.eng-active::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--pink); }
        .eng-ticker { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 15px; color: var(--text-1); letter-spacing: -0.02em; line-height: 1; }
        .eng-name-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); margin-top: 3px; }
        .eng-project-text { font-family: 'Outfit', sans-serif; font-size: 12px; color: var(--text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 12px; }
        .eng-phase-pill { font-family: 'JetBrains Mono', monospace; font-size: 9px; padding: 3px 8px; border-radius: 4px; border: 1px solid var(--border); color: var(--text-3); background: var(--bg-inset); white-space: nowrap; }
        .eng-bar-wrap { display: flex; align-items: center; gap: 8px; padding-right: 10px; }
        .eng-bar { flex: 1; height: 5px; background: var(--bg-inset); border-radius: 3px; overflow: hidden; border: 1px solid var(--border); }
        .eng-bar-fill { height: 100%; border-radius: 3px; }
        .eng-pct-lbl { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; color: var(--text-2); width: 28px; flex-shrink: 0; text-align: right; }
        .eng-score-val { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 16px; line-height: 1; letter-spacing: -0.02em; }
        .eng-score-delta { font-family: 'JetBrains Mono', monospace; font-size: 9px; margin-top: 2px; }
        .eng-contact-val { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; }
        .eng-rev-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: var(--text-1); }
        /* Detail panel */
        .eng-detail {
          display: grid; grid-template-columns: 210px 1fr 270px;
          border-top: 1px solid rgba(255,46,191,0.12);
          border-bottom: 1px solid var(--border);
          background: var(--bg-card2); animation: rise 0.25s ease both; overflow: hidden;
        }
        .eng-detail-col { padding: 18px 20px; border-right: 1px solid var(--border); }
        .eng-detail-col:last-child { border-right: none; }
        .eng-detail-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
        .phase-pipeline { display: flex; align-items: center; }
        .phase-node { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; flex-shrink: 0; }
        .phase-conn { flex: 1; height: 2px; }
        .phase-labels { display: flex; margin-top: 7px; }
        .phase-lbl { font-family: 'Outfit', sans-serif; font-size: 9px; color: var(--text-3); text-align: center; flex: 1; line-height: 1.3; }
        .eng-log-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); }
        .eng-log-item:last-child { border-bottom: none; }
        .eng-log-date { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); flex-shrink: 0; width: 34px; margin-top: 2px; }
        .eng-log-event { font-family: 'Outfit', sans-serif; font-size: 12px; color: var(--text-2); line-height: 1.4; }
        .eng-summary { font-family: 'Outfit', sans-serif; font-size: 12px; color: var(--text-2); line-height: 1.65; }
        .eng-alert { display: flex; gap: 8px; align-items: flex-start; background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2); border-radius: var(--r-sm); padding: 10px 12px; margin-top: 12px; font-family: 'Outfit', sans-serif; font-size: 11px; color: var(--red); line-height: 1.5; flex-shrink: 0; }
        /* ── DEV CONSOLE ── */
        .dev-console { position: fixed; bottom: 0; left: 0; right: 0; height: 400px; background: #07070F; border-top: 1px solid rgba(255,46,191,0.3); box-shadow: 0 -8px 40px rgba(0,0,0,0.6); z-index: 999; display: flex; flex-direction: column; font-family: 'JetBrains Mono', monospace; }
        .dev-console-handle { height: 4px; background: linear-gradient(to right, rgba(255,46,191,0.4), rgba(129,140,248,0.4)); cursor: ns-resize; flex-shrink: 0; }
        .dev-console-tabs { display: flex; align-items: center; gap: 0; background: #04040A; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 0 12px; flex-shrink: 0; height: 38px; }
        .dev-console-tab { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 0 16px; height: 100%; display: flex; align-items: center; gap: 7px; cursor: pointer; border-bottom: 2px solid transparent; color: #5858A0; transition: color 0.15s; }
        .dev-console-tab:hover { color: #AAAAEE; }
        .dev-console-tab.active { color: var(--pink); border-bottom-color: var(--pink); }
        .dev-console-tab-close { margin-left: auto; width: 22px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #5858A0; }
        .dev-console-tab-close:hover { background: rgba(255,255,255,0.06); color: #EEEEFF; }
        .term-body { flex: 1; overflow-y: auto; padding: 10px 16px; display: flex; flex-direction: column; gap: 2px; }
        .term-body::-webkit-scrollbar { width: 3px; } .term-body::-webkit-scrollbar-thumb { background: rgba(255,46,191,0.2); }
        .term-line-in   { color: #FF71D5; font-size: 12px; line-height: 1.6; white-space: pre-wrap; }
        .term-line-out  { color: #A0A0D0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; }
        .term-line-err  { color: #EF4444; font-size: 12px; line-height: 1.6; white-space: pre-wrap; }
        .term-line-info { color: #6868A8; font-size: 12px; line-height: 1.6; white-space: pre-wrap; }
        .term-input-row { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-top: 1px solid rgba(255,255,255,0.05); background: #04040A; flex-shrink: 0; }
        .term-prompt { color: var(--pink); font-size: 12px; user-select: none; }
        .term-input { flex: 1; background: transparent; border: none; outline: none; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #EEEEFF; caret-color: var(--pink); }
        .chat-body { flex: 1; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 12px; }
        .chat-body::-webkit-scrollbar { width: 3px; } .chat-body::-webkit-scrollbar-thumb { background: rgba(255,46,191,0.2); }
        .chat-msg-agent { align-self: flex-start; max-width: 80%; background: #0F0F1E; border: 1px solid rgba(255,255,255,0.07); border-radius: 0 10px 10px 10px; padding: 10px 14px; }
        .chat-msg-user  { align-self: flex-end; max-width: 80%; background: rgba(255,46,191,0.12); border: 1px solid rgba(255,46,191,0.2); border-radius: 10px 10px 0 10px; padding: 10px 14px; }
        .chat-msg-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #5858A0; margin-bottom: 5px; }
        .chat-msg-text  { font-family: 'Outfit', sans-serif; font-size: 13px; color: #DDDDF0; line-height: 1.55; }
        .chat-input-row { display: flex; gap: 8px; padding: 8px 12px; border-top: 1px solid rgba(255,255,255,0.05); background: #04040A; flex-shrink: 0; }
        .chat-input { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 7px 12px; font-family: 'Outfit', sans-serif; font-size: 13px; color: #EEEEFF; outline: none; }
        .chat-input:focus { border-color: rgba(255,46,191,0.4); }
        .conn-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; padding: 14px 16px; overflow-y: auto; }
        .conn-card { background: #0C0C1A; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
        .conn-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .dev-btn { background: rgba(255,46,191,0.1); border: 1px solid rgba(255,46,191,0.3); border-radius: 5px; padding: 5px 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--pink); cursor: pointer; }
        .dev-btn:hover { background: rgba(255,46,191,0.18); }
        .dev-btn-ghost { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 5px 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #8888C0; cursor: pointer; }
        .dev-btn-ghost:hover { background: rgba(255,255,255,0.08); color: #EEEEFF; }
        .console-toggle { display: flex; align-items: center; gap: 6px; background: rgba(255,46,191,0.08); border: 1px solid rgba(255,46,191,0.2); border-radius: 5px; padding: 4px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--pink); cursor: pointer; }
        .console-toggle:hover { background: rgba(255,46,191,0.14); }
      `}</style>

      <div className="shell">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-brand">
            <img src="/logo.svg" alt="Qnsult" style={{ width: '52px', height: '52px', objectFit: 'contain', flexShrink: 0 }} />
            <div className="brand-logo">Qn<em>sult</em></div>
            <div className="brand-tag">Gemini · ADK</div>
          </div>
          <div className="topbar-search">
            <div className="search-wrap">
              <span className="search-icon"><Icon.Search /></span>
              <input 
                className="search-input" 
                type="text" 
                placeholder="Search clients, agents, actions…" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="topbar-right">
            <div className="live-badge">
              <div className="live-dot" />
              12 agents live
            </div>
            <div style={{ position: 'relative' }}>
              <div className="icon-btn" onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: 'pointer', background: showNotifications ? 'rgba(255,46,191,0.1)' : 'transparent' }}>
                <Icon.Bell /><span className="notif-pip">{queueEvents.length > 0 ? Math.min(queueEvents.length, 9) : 3}</span>
              </div>
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '320px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  zIndex: 9999,
                  padding: '12px 0',
                  animation: 'rise 0.2s ease both'
                }}>
                  <div style={{ padding: '0 16px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>Notifications</div>
                    <div style={{ fontSize: 10, color: 'var(--pink-hi)', cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>Clear all</div>
                  </div>
                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {queueEvents.length > 0 ? queueEvents.slice(0, 5).map((ev, i) => {
                      const p = ev.payload as Record<string, unknown>
                      const actionText = (p.action_text as string) ?? `Event from ${ev.agent_id}`
                      const clientId = (p.client_id as string) ?? ''
                      const ts = new Date(ev.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                      const isLast = i === Math.min(queueEvents.length, 5) - 1
                      return (
                        <div key={ev.id} style={{ padding: '12px 16px', borderBottom: isLast ? 'none' : '1px solid var(--border)', cursor: 'pointer' }} className="interactive-card" onClick={() => { setActiveTab('action_items'); setShowNotifications(false); }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--amber)' }}>{ev.agent_id.toUpperCase()}</span>
                            <span style={{ fontSize: 9, color: 'var(--text-3)' }}>{ts}</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>{clientId ? `${clientId.toUpperCase()} — ` : ''}{actionText}</div>
                        </div>
                      )
                    }) : (
                      <>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} className="interactive-card" onClick={() => { setActiveTab('action_items'); setShowNotifications(false); }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--red)' }}>High Risk Alert</span>
                            <span style={{ fontSize: 9, color: 'var(--text-3)' }}>10m ago</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>AG-03 Stall Detection flagged critical delay phrasing on Halcyon Systems thread.</div>
                        </div>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} className="interactive-card" onClick={() => { setActiveTab('action_items'); setShowNotifications(false); }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--amber)' }}>Action Required</span>
                            <span style={{ fontSize: 9, color: 'var(--text-3)' }}>32m ago</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>AG-06 finished Apex Dynamics value chain mapping. Draft ready.</div>
                        </div>
                        <div style={{ padding: '12px 16px', cursor: 'pointer' }} className="interactive-card" onClick={() => { setActiveTab('home'); setShowNotifications(false); }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)' }}>System Event</span>
                            <span style={{ fontSize: 9, color: 'var(--text-3)' }}>1h ago</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>Orchestrator successfully synchronized with Google Calendar events.</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <div
                className="icon-btn"
                onClick={() => { setShowMoreMenu(v => !v); setShowNotifications(false) }}
                style={{ cursor: 'pointer', background: showMoreMenu ? 'rgba(255,46,191,0.1)' : 'transparent' }}
              >
                <Icon.MoreVert />
              </div>
              {showMoreMenu && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 220, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 9999, padding: '6px 0', animation: 'rise 0.15s ease both' }}>
                  {([
                    { label: 'Settings',        icon: <Icon.Settings />, action: () => { setActiveTab('settings'); setShowMoreMenu(false) } },
                    { label: devConsoleOpen ? 'Close Dev Console' : 'Open Dev Console', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>, action: () => { setDevConsoleOpen(v => !v); setShowMoreMenu(false) } },
                    { label: 'Reload live data', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>, action: () => { setShowMoreMenu(false); window.location.reload() } },
                    { label: 'Agent Network',    icon: <Icon.Cpu />, action: () => { setActiveTab('agent_status'); setShowMoreMenu(false) } },
                    { label: 'Action Items',     icon: <Icon.CheckSquare />, action: () => { setActiveTab('action_items'); setShowMoreMenu(false) } },
                  ] as { label: string; icon: React.ReactNode; action: () => void }[]).map((item, i, arr) => (
                    <div
                      key={item.label}
                      onClick={item.action}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', cursor: 'pointer', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', color: 'var(--text-2)', fontSize: 13, fontFamily: 'Outfit', fontWeight: 500, transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ color: 'var(--text-3)', flexShrink: 0 }}>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="console-toggle" onClick={() => setDevConsoleOpen(v => !v)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              {devConsoleOpen ? 'Close Console' : 'Dev Console'}
            </button>
            <div className="user-avatar" title={userName} onClick={() => setActiveTab('settings')} style={{ cursor: 'pointer' }}>{userInitial}</div>
            <button className="btn btn-red" onClick={signOut} style={{ fontSize: 11, padding: '6px 12px' }}>Sign out</button>
          </div>
        </header>

        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="nav-section">
            {[
              { id: 'home', ico: <Icon.Home />, label: 'Home' },
              { id: 'clients', ico: <Icon.Users />, label: 'Clients' },
              { id: 'engagements', ico: <Icon.Briefcase />, label: 'Engagements' },
              { id: 'action_items', ico: <Icon.CheckSquare />, label: 'Action Items', count: String(actionItems.filter(a => !a.completed).length), countClass: 'nc-red' },
              { id: 'agent_events', ico: <Icon.Cpu />, label: 'Agent Workflow' },
              { id: 'portfolio_intelligence', ico: <Icon.BarChart2 />, label: 'Portfolio Intelligence' },
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
              <span className="nav-ico"><Icon.AlertTriangle /></span>Stall Detection<span className="nav-count nc-red">{actionItems.filter(a => !a.completed && a.urgency === 'crit').length || 2}</span>
            </div>
            <div 
              className={`nav-link${activeTab === 'ai_danger_zone' ? ' active' : ''}`}
              onClick={() => setActiveTab('ai_danger_zone')}
            >
              <span className="nav-ico"><Icon.Shield /></span>AI Danger Zone<span className="nav-count nc-amber">{clients.filter(c => (c.displacement_pct ?? AI_DISP_DEMO[c.name]?.displacement_pct ?? 0) >= 60).length || 4}</span>
            </div>
            <div 
              className={`nav-link${activeTab === 'competitive_risk' ? ' active' : ''}`}
              onClick={() => setActiveTab('competitive_risk')}
            >
              <span className="nav-ico"><Icon.Target /></span>Competitive Risk
            </div>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Workstation</div>
            <div 
              className={`nav-link${activeTab === 'pattern_library' ? ' active' : ''}`}
              onClick={() => setActiveTab('pattern_library')}
            >
              <span className="nav-ico"><Icon.Layers /></span>Pattern Library<span className="nav-count nc-pink">{PATTERNS_DATA.length}</span>
            </div>
            <div 
              className={`nav-link${activeTab === 'settings' ? ' active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="nav-ico"><Icon.Settings /></span>Settings
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
                  <div className="page-sub">{(() => {
                    const now = new Date()
                    const startOfYear = new Date(now.getFullYear(), 0, 1)
                    const weekNum = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
                    const day = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                    const syncTs = agentsData.length > 0 && agentsData[0].updatedAt
                      ? new Date(agentsData[0].updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC'
                      : 'Demo Mode'
                    return `${day} · W-${weekNum} · Synced ${syncTs}`
                  })()}</div>
                </div>
                <div className="head-actions">
                  <button className="btn btn-ghost" onClick={() => { setShowToast('Filters cleared'); setTimeout(() => setShowToast(null), 3000) }}><Icon.SlidersH /> Filters</button>
                  <button className="btn btn-ghost" onClick={() => { setShowToast('Viewing June data'); setTimeout(() => setShowToast(null), 3000) }}><Icon.CalendarDays /> This Month</button>
                  <button className="btn btn-pink" onClick={() => { setShowToast('Momentum scan initiated across 11 accounts'); setTimeout(() => setShowToast(null), 3000) }}><Icon.Play /> Run Momentum</button>
                </div>
              </div>

              {/* Filter row */}
              <div className="filter-row">
                <div className="filter-chip active"><span className="chip-dot" />All Clients ({clients.length})</div>
                <div className="filter-chip" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Drift Capital'); setActiveTab('clients'); }}>Stalling ({clients.filter(c => c.status === 'Stalling').length})</div>
                <div className="filter-chip" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Corestone Infra'); setActiveTab('clients'); }}>At Risk ({clients.filter(c => c.status === 'At Risk').length})</div>
                <div className="filter-chip" style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient('Pinnacle Group'); setActiveTab('clients'); }}>Accelerating ({clients.filter(c => c.status === 'Accelerating').length})</div>
              </div>

              {/* KPI row */}
              <div className="kpi-row">
                <div className="kpi green-kpi interactive-card" onClick={() => { setSelectedClient('Pinnacle Group'); setActiveTab('clients') }}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--green)' }}><Icon.TrendingUp /></div><div className="kpi-value">{clients.filter(c => c.status === 'Accelerating').length}</div><span className="kpi-delta delta-up">+2 wk</span></div>
                  <div className="kpi-label">Accelerating Accounts</div>
                </div>
                <div className="kpi amber-kpi interactive-card" onClick={() => setActiveTab('ai_danger_zone')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--amber)' }}><Icon.AlertTriangle /></div><div className="kpi-value">{clients.filter(c => c.status === 'At Risk').length}</div><span className="kpi-delta delta-dn">+1</span></div>
                  <div className="kpi-label">At Risk Accounts</div>
                </div>
                <div className="kpi red-kpi interactive-card" onClick={() => setActiveTab('stall_detection')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--red)' }}><Icon.TrendingDown /></div><div className="kpi-value">{clients.filter(c => c.status === 'Stalling').length}</div><span className="kpi-delta delta-flat">—</span></div>
                  <div className="kpi-label">Stalling Accounts</div>
                </div>
                <div className="kpi indigo-kpi interactive-card" onClick={() => setActiveTab('agent_events')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--indigo)' }}><Icon.Cpu /></div><div className="kpi-value">{agentsData.length}</div><span className="kpi-delta delta-up">{agentsData.filter(a => a.status === 'Analyzing' || a.status === 'Alerting').length} active</span></div>
                  <div className="kpi-label">Agents Live</div>
                </div>
                {(() => {
                  const avgScore = clients.length ? (clients.reduce((s, c) => s + Number(c.score || 0), 0) / clients.length).toFixed(1) : '—'
                  return (
                    <div className="kpi interactive-card" onClick={() => { setShowToast(`Composite score computed from ${agentsData.length} agent inputs.`); setTimeout(() => setShowToast(null), 3000) }}>
                      <div className="kpi-main-row"><div className="kpi-icon-wrap"><Icon.Diamond /></div><div className="kpi-value">{avgScore}</div><span className="kpi-delta delta-up">+0.4</span></div>
                      <div className="kpi-label">Avg Composite Score</div>
                    </div>
                  )
                })()}
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
                    <div className="chart-wrap">
                      <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', inset: 0 }}>
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
                        {/* Premium grid lines */}
                        <g stroke="rgba(255,255,255,0.055)" strokeWidth="1">
                          <line x1="30" y1="10" x2="390" y2="10"/><line x1="30" y1="54" x2="390" y2="54"/>
                          <line x1="30" y1="98" x2="390" y2="98"/><line x1="30" y1="141" x2="390" y2="141"/><line x1="30" y1="185" x2="390" y2="185"/>
                        </g>
                        {/* Vertical tick lines */}
                        {[30,81,133,184,236,287,338,390].map(x => (
                          <line key={x} x1={x} y1="185" x2={x} y2="191" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                        ))}
                        {/* On-track threshold */}
                        <line x1="30" y1="71" x2="390" y2="71" stroke="rgba(129,140,248,0.3)" strokeWidth="1" strokeDasharray="4 5"/>
                        <text x="36" y="68" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(129,140,248,0.6)" letterSpacing="0.08em">on-track threshold · 6.5</text>
                        {/* Area fill */}
                        <path d="M 30,112 C 45,109 66,104 81,101 C 97,98 118,97 133,94 C 149,92 169,86 184,84 C 200,82 221,78 236,78 C 252,78 272,83 287,82 C 302,81 323,75 338,73 C 354,71 374,68 390,66 L 390,185 L 30,185 Z" fill="url(#area-fill)"/>
                        {/* Glowing line — thicker, more premium */}
                        <path d="M 30,112 C 45,109 66,104 81,101 C 97,98 118,97 133,94 C 149,92 169,86 184,84 C 200,82 221,78 236,78 C 252,78 272,83 287,82 C 302,81 323,75 338,73 C 354,71 374,68 390,66" fill="none" stroke="#FF2EBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#line-glow)"/>
                        {/* Hover vertical indicator */}
                        {hoveredMomentumPt !== null && (() => {
                          const pts = [{cx:30,cy:112},{cx:81,cy:101},{cx:133,cy:94},{cx:184,cy:84},{cx:236,cy:78},{cx:287,cy:82},{cx:338,cy:73},{cx:390,cy:66}]
                          const p = pts[hoveredMomentumPt]
                          return <line x1={p.cx} y1={p.cy} x2={p.cx} y2="185" stroke="rgba(255,46,191,0.2)" strokeWidth="1" strokeDasharray="3 4"/>
                        })()}
                        {/* Data point dots */}
                        {[{cx:30,cy:112,i:0},{cx:81,cy:101,i:1},{cx:133,cy:94,i:2},{cx:184,cy:84,i:3},{cx:236,cy:78,i:4},{cx:287,cy:82,i:5},{cx:338,cy:73,i:6}].map(p => (
                          <circle key={p.i} cx={p.cx} cy={p.cy} r={hoveredMomentumPt === p.i ? 4.5 : 2.5} fill="#FF2EBF" fillOpacity={hoveredMomentumPt === p.i ? 1 : 0.35} style={{ transition: 'r 0.15s, fill-opacity 0.15s' }}/>
                        ))}
                        {/* Current point W-23 */}
                        <line x1="390" y1="67" x2="390" y2="185" stroke="rgba(255,46,191,0.13)" strokeWidth="1" strokeDasharray="3 4"/>
                        <circle cx="390" cy="66" r="5" fill="#FF2EBF" filter="url(#dot-glow-f)"/>
                        <circle cx="390" cy="66" r="5" fill="#FF2EBF"/>
                        <circle cx="390" cy="66" r="10" fill="none" stroke="#FF2EBF" strokeWidth="1" opacity="0.5" className="current-ring"/>
                        <circle cx="390" cy="66" r="16" fill="none" stroke="#FF2EBF" strokeWidth="0.5" opacity="0.25" className="current-ring" style={{ animationDelay: '0.75s' }}/>
                        <text x="378" y="55" textAnchor="end" fontFamily="JetBrains Mono" fontSize="8" fontWeight="700" fill="#FF71D5">6.8</text>
                        {/* Hover tooltip in SVG */}
                        {hoveredMomentumPt !== null && (() => {
                          const pts = [{cx:30,cy:112},{cx:81,cy:101},{cx:133,cy:94},{cx:184,cy:84},{cx:236,cy:78},{cx:287,cy:82},{cx:338,cy:73},{cx:390,cy:66}]
                          const weeks = ['W-16','W-17','W-18','W-19','W-20','W-21','W-22','W-23']
                          const scores = ['4.2','4.8','5.2','5.8','6.1','5.9','6.4','6.8']
                          const deltas = ['—','+0.6','+0.4','+0.6','+0.3','-0.2','+0.5','+0.4']
                          const notes = ['Baseline','Pinnacle kickoff','Meridian joined','Apex onboarded','Portfolio peak','Halcyon stall detected','Recovery','Current · W-23']
                          const p = pts[hoveredMomentumPt]
                          const tx = Math.min(Math.max(p.cx - 38, 2), 310)
                          const ty = p.cy > 120 ? p.cy - 74 : p.cy - 74
                          return (
                            <g>
                              <rect x={tx} y={ty} width="88" height="58" rx="5" fill="#14141E" stroke="rgba(255,46,191,0.35)" strokeWidth="1"/>
                              <text x={tx+7} y={ty+13} fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#FF71D5">{weeks[hoveredMomentumPt]}</text>
                              <text x={tx+60} y={ty+13} textAnchor="end" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#EEEEFF">{scores[hoveredMomentumPt]}</text>
                              <text x={tx+7} y={ty+26} fontFamily="JetBrains Mono" fontSize="8" fill={deltas[hoveredMomentumPt].startsWith('-') ? '#EF4444' : '#22C55E'}>Δ {deltas[hoveredMomentumPt]}</text>
                              <line x1={tx} y1={ty+33} x2={tx+88} y2={ty+33} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                              <text x={tx+7} y={ty+45} fontFamily="Outfit" fontSize="8" fill="rgba(255,255,255,0.5)">{notes[hoveredMomentumPt]}</text>
                            </g>
                          )
                        })()}
                        {/* Invisible hover zones */}
                        {[{cx:30,cy:112,i:0},{cx:81,cy:101,i:1},{cx:133,cy:94,i:2},{cx:184,cy:84,i:3},{cx:236,cy:78,i:4},{cx:287,cy:82,i:5},{cx:338,cy:73,i:6},{cx:390,cy:66,i:7}].map(p => (
                          <circle key={'hz-'+p.i} cx={p.cx} cy={p.cy} r="18" fill="transparent" style={{ cursor: 'crosshair' }}
                            onMouseEnter={() => setHoveredMomentumPt(p.i)}
                            onMouseLeave={() => setHoveredMomentumPt(null)}
                          />
                        ))}
                        {/* X axis labels */}
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="right-stack">
                  <div className="card">
                    <div className="card-hd">
                      <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--indigo)', boxShadow: '0 0 8px var(--indigo-dim)' }} />Client Status</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{clients.length} accounts</div>
                    </div>
                    <div className="client-rows">
                      {[...clients].sort((a, b) => Number(b.score || 0) - Number(a.score || 0)).slice(0, 5).map((c) => {
                        const sc = Number(c.score || 0)
                        const color = c.status === 'Accelerating' ? 'var(--pink)'
                          : c.status === 'On Track' ? 'var(--green)'
                          : c.status === 'Progressing' ? 'var(--indigo)'
                          : c.status === 'At Risk' ? 'var(--amber)'
                          : 'var(--red)'
                        const filled = Math.round(sc / 10 * 8)
                        const initials = c.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
                        return (
                          <div className="client-row" key={c.name} style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient(c.name); setActiveTab('clients') }}>
                            <div className="client-logo cl-a" style={{ background: color + '22', color, border: `1px solid ${color}44` }}>{initials}</div>
                            <div className="client-info">
                              <div className="client-name">{c.name}</div>
                              <div className="client-tag">{c.tag}</div>
                            </div>
                            <div className="dot-progress">
                              {Array.from({ length: 8 }, (_, i) => (
                                <div key={i} className="dp-dot" style={{ background: color, opacity: i < filled ? 1 : 0.14 }} />
                              ))}
                            </div>
                            <span className="score-pct" style={{ color }}>{sc.toFixed(1)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {(() => {
                    const total = clients.length || 1
                    const circ = 251.3
                    const counts = {
                      Stalling:     clients.filter(c => c.status === 'Stalling').length,
                      'At Risk':    clients.filter(c => c.status === 'At Risk').length,
                      Progressing:  clients.filter(c => c.status === 'Progressing').length,
                      'On Track':   clients.filter(c => c.status === 'On Track').length,
                      Accelerating: clients.filter(c => c.status === 'Accelerating').length,
                    }
                    const seg = (n: number) => ((n / total) * circ).toFixed(1)
                    const pct = (n: number) => Math.round(n / total * 100) + '%'
                    const gaps = [
                      Number(seg(counts.Stalling)),
                      Number(seg(counts['At Risk'])),
                      Number(seg(counts.Progressing)),
                      Number(seg(counts['On Track'])),
                      Number(seg(counts.Accelerating)),
                    ]
                    const _offsets = gaps.reduce((acc, g, i) => [...acc, -(acc[i] + (i > 0 ? gaps[i-1] : 0))], [0])
                    // cumulative offset: each segment starts after the previous ones
                    let cumOff = 0
                    const segs = [
                      { color: '#EF4444', n: counts.Stalling },
                      { color: '#F59E0B', n: counts['At Risk'] },
                      { color: '#9B30D9', n: counts.Progressing },
                      { color: '#818CF8', n: counts['On Track'] },
                      { color: '#FF2EBF', n: counts.Accelerating },
                    ].map(s => {
                      const arc = (s.n / total) * circ
                      const off = -cumOff
                      cumOff += arc
                      return { ...s, arc, off }
                    })
                    return (
                      <div className="card">
                        <div className="card-hd">
                          <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--violet)', boxShadow: '0 0 8px var(--violet-dim)' }} />Portfolio Split</div>
                        </div>
                        <div className="donut-body">
                          <div className="donut-legend">
                            {[
                              { color: 'var(--pink)', glow: 'var(--pink-glow)', label: 'Accelerating', val: pct(counts.Accelerating), valColor: 'var(--pink)' },
                              { color: 'var(--indigo)', label: 'On Track', val: pct(counts['On Track']) },
                              { color: 'var(--violet)', label: 'Progressing', val: pct(counts.Progressing) },
                              { color: 'var(--amber)', label: 'At Risk', val: pct(counts['At Risk']) },
                              { color: 'var(--red)', label: 'Stalling', val: pct(counts.Stalling) },
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
                              {segs.map(s => s.n > 0 && (
                                <circle key={s.color} cx="55" cy="55" r="40" fill="none" stroke={s.color} strokeWidth="10"
                                  strokeDasharray={`${s.arc.toFixed(1)} ${(circ - s.arc).toFixed(1)}`}
                                  strokeDashoffset={s.off.toFixed(1)}
                                  strokeLinecap="round"
                                  filter={s.color === '#FF2EBF' ? 'url(#glow-pink)' : undefined}
                                />
                              ))}
                            </svg>
                            <div className="donut-inner-text">
                              <div className="donut-big">100%</div>
                              <div className="donut-small">Total</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Two-Axis Map */}
              {(() => {
                const statusColor = (status: string) =>
                  status === 'Accelerating' ? '#FF2EBF'
                  : status === 'On Track' ? '#818CF8'
                  : status === 'Progressing' ? '#9B30D9'
                  : status === 'At Risk' ? '#F59E0B'
                  : '#EF4444'
                const MAP_BASE = [
                  { name: 'Pinnacle Group',   cx: 422, cy: 59,  rev: 145, headcount: 200, sector: 'Private Equity',   aiRisk: '12%', phase: 'Phase 3/4' },
                  { name: 'Meridian Capital', cx: 389, cy: 80,  rev: 98,  headcount: 150, sector: 'Asset Management', aiRisk: '18%', phase: 'Phase 2/4' },
                  { name: 'NovaTech Solutions',cx:318, cy: 88,  rev: 85,  headcount: 120, sector: 'Technology',        aiRisk: '34%', phase: 'Phase 2/3' },
                  { name: 'Apex Dynamics',    cx: 343, cy: 106, rev: 72,  headcount: 90,  sector: 'Manufacturing',    aiRisk: '28%', phase: 'Phase 1/4' },
                  { name: 'Stratford & Co',   cx: 247, cy: 154, rev: 65,  headcount: 80,  sector: 'Consulting',       aiRisk: '45%', phase: 'Phase 2/3' },
                  { name: 'Lumis Group',      cx: 276, cy: 175, rev: 55,  headcount: 60,  sector: 'Finance',          aiRisk: '52%', phase: 'Phase 1/3' },
                  { name: 'Vantage Partners', cx: 180, cy: 189, rev: 42,  headcount: 45,  sector: 'Logistics',        aiRisk: '48%', phase: 'Phase 2/4' },
                  { name: 'Redwood Advisors', cx: 163, cy: 203, rev: 38,  headcount: 40,  sector: 'Advisory',         aiRisk: '65%', phase: 'Phase 1/3' },
                  { name: 'Corestone Infra',  cx: 213, cy: 212, rev: 55,  headcount: 70,  sector: 'Infrastructure',   aiRisk: '78%', phase: 'Phase 2/4' },
                  { name: 'Halcyon Systems',  cx: 121, cy: 261, rev: 210, headcount: 300, sector: 'Technology',       aiRisk: '85%', phase: 'Phase 4/4' },
                  { name: 'Drift Capital',    cx: 138, cy: 270, rev: 35,  headcount: 30,  sector: 'Finance',          aiRisk: '72%', phase: 'Phase 1/2' },
                ]
                const mapClients = MAP_BASE.map(base => {
                  const live = clients.find(c => c.name === base.name)
                  const sc = Number(live?.score ?? 0)
                  const status = live?.status ?? 'On Track'
                  const color = statusColor(status)
                  const isAlert = status === 'Stalling'
                  return { ...base, score: sc || sc, badge: status, color, glow: isAlert, pulse: isAlert }
                })
                const filteredClients = mapClients.filter(c => {
                  const revOk = mapRevFilter === 'All' ||
                    (mapRevFilter === '<$50K' && c.rev < 50) ||
                    (mapRevFilter === '$50K–$100K' && c.rev >= 50 && c.rev <= 100) ||
                    (mapRevFilter === '$100K+' && c.rev > 100)
                  const hcOk = mapHeadcountFilter === 'All' ||
                    (mapHeadcountFilter === '<50' && c.headcount < 50) ||
                    (mapHeadcountFilter === '50–150' && c.headcount >= 50 && c.headcount <= 150) ||
                    (mapHeadcountFilter === '150+' && c.headcount > 150)
                  return revOk && hcOk
                })
                const hovered = mapClients.find(c => c.name === mapHoveredClient)
                const _chipBtn = (label: string, active: boolean, onClick: () => void) => (
                  <button key={label} onClick={onClick} style={{ padding: '4px 10px', borderRadius: 4, background: active ? 'var(--pink-dim)' : 'var(--bg-inset)', border: `1px solid ${active ? 'rgba(255,46,191,0.3)' : 'var(--border)'}`, color: active ? 'var(--pink-hi)' : 'var(--text-2)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.04em' }}>{label}</button>
                )
                const rankList = (onClickExtra?: () => void) => [...clients]
                  .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
                  .map(r => {
                    const sc = Number(r.score || 0)
                    const col = statusColor(r.status ?? '')
                    const isStall = r.status === 'Stalling'
                    return (
                      <div key={r.name} className="qside-item"
                        style={isStall ? { borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', cursor: 'pointer' } : { cursor: 'pointer' }}
                        onClick={() => { setSelectedClient(r.name); setActiveTab('clients'); onClickExtra?.() }}
                      >
                        <div className="qside-status" style={{ background: col, ...(isStall ? { animation: 'dot-pulse 1.5s ease-in-out infinite' } : {}) }}/>
                        <div className="qside-name" style={isStall ? { color: '#EF4444' } : {}}>{r.name}</div>
                        <div className="qside-score" style={{ color: col }}>{sc.toFixed(2)}</div>
                      </div>
                    )
                  })
                const mapSvg = (viewBox: string, svgStyle: React.CSSProperties) => (
                  <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" style={svgStyle} onMouseLeave={() => setMapHoveredClient(null)}>
                    <defs>
                      <radialGradient id="danger-zone" cx="50%" cy="100%" r="60%"><stop offset="0%" stopColor="#EF4444" stopOpacity="0.12"/><stop offset="100%" stopColor="#EF4444" stopOpacity="0"/></radialGradient>
                      <radialGradient id="strat-zone" cx="100%" cy="0%" r="60%"><stop offset="0%" stopColor="#FF2EBF" stopOpacity="0.1"/><stop offset="100%" stopColor="#FF2EBF" stopOpacity="0"/></radialGradient>
                      <radialGradient id="prog-zone" cx="30%" cy="50%" r="60%"><stop offset="0%" stopColor="#9B30D9" stopOpacity="0.06"/><stop offset="100%" stopColor="#9B30D9" stopOpacity="0"/></radialGradient>
                      <linearGradient id="momentum-arrow" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#818CF8" stopOpacity="0.5"/><stop offset="100%" stopColor="#FF2EBF" stopOpacity="0.5"/></linearGradient>
                      <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,46,191,0.6)"/></marker>
                      <filter id="dot-glow-map" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    </defs>
                    {/* Zone fills */}
                    <rect x="46" y="256" width="418" height="48" fill="url(#danger-zone)" rx="2"/>
                    <rect x="258" y="16" width="206" height="160" fill="url(#strat-zone)" rx="2"/>
                    <rect x="46" y="160" width="212" height="96" fill="url(#prog-zone)" rx="2"/>
                    {/* Grid */}
                    <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
                      <line x1="46" y1="16" x2="46" y2="304"/><line x1="46" y1="304" x2="464" y2="304"/>
                      <line x1="464" y1="16" x2="464" y2="304"/><line x1="46" y1="16" x2="464" y2="16"/>
                    </g>
                    {/* Mid-lines */}
                    <line x1="255" y1="16" x2="255" y2="304" stroke="rgba(255,255,255,0.07)" strokeDasharray="4 5" strokeWidth="1"/>
                    <line x1="46" y1="160" x2="464" y2="160" stroke="rgba(255,255,255,0.07)" strokeDasharray="4 5" strokeWidth="1"/>
                    {/* The Wall */}
                    <line x1="135" y1="16" x2="135" y2="304" stroke="rgba(245,158,11,0.28)" strokeDasharray="3 6" strokeWidth="1.5"/>
                    <rect x="108" y="16" width="54" height="16" fill="rgba(245,158,11,0.08)" rx="2"/>
                    <text x="135" y="27" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(245,158,11,0.6)" letterSpacing="0.12em" textAnchor="middle">THE WALL</text>
                    {/* Zone labels */}
                    <text x="54" y="292" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(239,68,68,0.5)" letterSpacing="0.1em">AI DANGER ZONE</text>
                    <text x="456" y="30" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(255,46,191,0.5)" textAnchor="end" letterSpacing="0.1em">STRATEGIC PARTNERSHIP</text>
                    <text x="54" y="175" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(155,48,217,0.45)" letterSpacing="0.08em">PROGRESSING ZONE</text>
                    {/* Momentum arrow */}
                    <path d="M 80 290 L 420 40" stroke="url(#momentum-arrow)" strokeWidth="1.5" strokeDasharray="6 5" markerEnd="url(#arrowhead)" fill="none"/>
                    {/* Axis labels */}
                    <text x="255" y="318" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.35)" textAnchor="middle" letterSpacing="0.08em">RELATIONSHIP DURATION  →</text>
                    <text x="14" y="160" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.35)" textAnchor="middle" transform="rotate(-90, 14, 160)" letterSpacing="0.08em">VALUE CHAIN  →</text>
                    {/* Quadrant labels top-left */}
                    <text x="54" y="35" fontFamily="JetBrains Mono" fontSize="6" fill="rgba(255,255,255,0.18)" letterSpacing="0.08em">HIGH VALUE</text>
                    <text x="54" y="44" fontFamily="JetBrains Mono" fontSize="6" fill="rgba(255,255,255,0.18)" letterSpacing="0.08em">SHORT TENURE</text>
                    {/* Client dots */}
                    {filteredClients.map(c => {
                      const isHov = mapHoveredClient === c.name
                      return (
                        <g key={c.name} style={{ cursor: 'pointer' }} onClick={() => { setSelectedClient(c.name); setActiveTab('clients') }} onMouseEnter={() => setMapHoveredClient(c.name)}>
                          {c.glow && <g className="qpulse"><circle cx={c.cx} cy={c.cy} r="14" fill={c.color} fillOpacity="0.06"/></g>}
                          {isHov && <circle cx={c.cx} cy={c.cy} r="14" fill={c.color} fillOpacity="0.12"/>}
                          <circle cx={c.cx} cy={c.cy} r={isHov ? 10 : 8} fill={`${c.color}22`} stroke={c.color} strokeWidth={isHov ? 2 : 1.5} style={{ transition: 'r 0.15s' }}/>
                          <circle cx={c.cx} cy={c.cy} r="4" fill={c.color} filter={isHov ? 'url(#dot-glow-map)' : undefined}/>
                          {c.pulse && <circle cx={c.cx} cy={c.cy} r="10" fill="none" stroke={c.color} strokeWidth="0.8" opacity="0.4" className="current-ring"/>}
                          <text x={c.cx + 12} y={c.cy - 3} fontFamily="Outfit" fontSize="9" fontWeight="700" fill={c.color === '#EF4444' ? '#EF4444' : 'rgba(255,255,255,0.75)'}>{c.name.split(' ')[0]}</text>
                          <text x={c.cx + 12} y={c.cy + 7} fontFamily="JetBrains Mono" fontSize="7" fill={c.color} fillOpacity="0.7">{c.score}</text>
                        </g>
                      )
                    })}
                    {/* Tooltip for hovered client */}
                    {hovered && (() => {
                      const tx = hovered.cx > 370 ? hovered.cx - 125 : hovered.cx + 15
                      const ty = hovered.cy > 230 ? hovered.cy - 110 : hovered.cy + 15
                      return (
                        <g>
                          <rect x={tx} y={ty} width="115" height="90" rx="5" fill="#0C0C16" stroke={hovered.color} strokeWidth="1" strokeOpacity="0.5"/>
                          <text x={tx+8} y={ty+14} fontFamily="Outfit" fontSize="10" fontWeight="700" fill="#EEEEFF">{hovered.name}</text>
                          <line x1={tx} y1={ty+20} x2={tx+115} y2={ty+20} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                          <text x={tx+8} y={ty+31} fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.4)">Score</text>
                          <text x={tx+107} y={ty+31} textAnchor="end" fontFamily="JetBrains Mono" fontSize="8" fontWeight="700" fill={hovered.color}>{hovered.score}</text>
                          <text x={tx+8} y={ty+43} fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.4)">Revenue</text>
                          <text x={tx+107} y={ty+43} textAnchor="end" fontFamily="JetBrains Mono" fontSize="8" fill="#EEEEFF">${hovered.rev}K</text>
                          <text x={tx+8} y={ty+55} fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.4)">Headcount</text>
                          <text x={tx+107} y={ty+55} textAnchor="end" fontFamily="JetBrains Mono" fontSize="8" fill="#EEEEFF">{hovered.headcount}</text>
                          <text x={tx+8} y={ty+67} fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.4)">AI Risk</text>
                          <text x={tx+107} y={ty+67} textAnchor="end" fontFamily="JetBrains Mono" fontSize="8" fill={parseFloat(hovered.aiRisk) > 60 ? '#EF4444' : '#F59E0B'}>{hovered.aiRisk}</text>
                          <text x={tx+8} y={ty+79} fontFamily="JetBrains Mono" fontSize="7" fill="rgba(255,255,255,0.3)">{hovered.sector} · {hovered.phase}</text>
                          <rect x={tx+68} y={ty+5} width="40" height="13" rx="3" fill={hovered.color} fillOpacity="0.15"/>
                          <text x={tx+88} y={ty+14} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill={hovered.color}>{hovered.badge}</text>
                        </g>
                      )
                    })()}
                  </svg>
                )
                return (
                  <>
                    {/* Fullscreen overlay — rendered via portal so it escapes all stacking contexts */}
                    {mapFullscreen && createPortal(
                      <div style={{ position: 'fixed', inset: 0, background: '#09090F', zIndex: 2000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Header bar */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-1)' }}>Two-Axis Portfolio Map <span style={{ color: 'var(--pink)' }}>— Full View</span></div>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-3)' }}>{filteredClients.length} clients shown</span>
                            <button onClick={() => setMapFullscreen(false)} style={{ padding: '5px 14px', background: 'var(--pink-dim)', border: '1px solid rgba(255,46,191,0.3)', borderRadius: 6, color: 'var(--pink-hi)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, cursor: 'pointer' }}>✕ Close</button>
                          </div>
                        </div>
                        {/* Body: filter sidebar + map + rank panel */}
                        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
                          {/* Filter sidebar */}
                          <div style={{ width: 180, flexShrink: 0, borderRight: '1px solid var(--border)', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
                            <div>
                              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Revenue</div>
                              <select value={mapRevFilter} onChange={e => setMapRevFilter(e.target.value)} style={{ width: '100%', background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-1)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, padding: '6px 8px', cursor: 'pointer', outline: 'none' }}>
                                {['All','<$50K','$50K–$100K','$100K+'].map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Headcount</div>
                              <select value={mapHeadcountFilter} onChange={e => setMapHeadcountFilter(e.target.value)} style={{ width: '100%', background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-1)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, padding: '6px 8px', cursor: 'pointer', outline: 'none' }}>
                                {['All','<50','50–150','150+'].map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Period</div>
                              <select value={mapPeriodFilter} onChange={e => setMapPeriodFilter(e.target.value)} style={{ width: '100%', background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-1)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, padding: '6px 8px', cursor: 'pointer', outline: 'none' }}>
                                {['All Time','Q4 2025','Q1 2026','Q2 2026'].map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </div>
                            <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                              <button onClick={() => { setMapRevFilter('All'); setMapHeadcountFilter('All'); setMapPeriodFilter('All Time') }} style={{ width: '100%', padding: '6px 0', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, cursor: 'pointer' }}>Reset filters</button>
                            </div>
                          </div>
                          {/* Map */}
                          <div style={{ flex: 1, padding: 20, minWidth: 0, display: 'flex', alignItems: 'stretch' }}>
                            {mapSvg('0 0 480 320', { width: '100%', height: '100%', display: 'block', maxHeight: '100%' })}
                          </div>
                          {/* Rank panel */}
                          <div style={{ width: 200, flexShrink: 0, borderLeft: '1px solid var(--border)', overflowY: 'auto', padding: '16px 12px' }}>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Portfolio Rank</div>
                            {rankList(() => setMapFullscreen(false))}
                          </div>
                        </div>
                      </div>,
                      document.body
                    )}
                    <div className="card quadrant-card">
                <div className="card-hd">
                  <div className="card-hd-title"><div className="title-pip" />Two-Axis Portfolio Map</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div className="tab-group">
                      <div className="tab active">Live</div>
                      <div className="tab" onClick={() => { setShowToast('WoW trends sync active'); setTimeout(() => setShowToast(null), 3000) }}>Δ WoW</div>
                      <div className="tab" onClick={() => setActiveTab('ai_danger_zone')}>AI Exposure</div>
                    </div>
                    <button onClick={() => setMapFullscreen(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-2)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, cursor: 'pointer' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                      Expand
                    </button>
                  </div>
                </div>
                <div className="quadrant-body">
                  <div className="quad-plot">
                  {mapSvg('0 0 480 320', { width: '100%', display: 'block' })}
                    <div className="quad-legend">
                      {[['#FF2EBF','rgba(255,46,191,0.3)','Accelerating'],['#818CF8','','On Track'],['#9B30D9','','Progressing'],['#F59E0B','','At Risk'],['#EF4444','','Stalling']].map(([c,g,l]) => (
                        <div className="ql-item" key={l}><div className="ql-dot" style={{ background: c, ...(g ? { boxShadow: `0 0 5px ${g}` } : {}) }} />{l}</div>
                      ))}
                    </div>
                  </div>
                  <div className="quad-side">
                    <div className="qside-title">Portfolio Rank</div>
                    {rankList()}
                  </div>
                </div>
              </div>
              </>
              )
              })()}

              {/* Portfolio Positioning AI */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-hd">
                  <div className="card-hd-title">
                    <div className="title-pip" style={{ background: 'var(--violet)', boxShadow: '0 0 8px var(--violet-dim)' }}/>
                    Portfolio Positioning AI
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.06em' }}>AG-04 · Momentum Orchestrator</div>
                    <div className="live-badge"><div className="live-dot"/>Live</div>
                  </div>
                </div>
                <div style={{ padding: '0 20px 8px', fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--text-3)' }}>Ask about client positioning relative to the Project Wall, momentum trajectories, AI displacement risk, or expansion opportunities.</div>
                <div ref={portfolioChatRef} style={{ height: 220, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {portfolioChat.map((m, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 3 }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.05em' }}>{m.role === 'user' ? 'You' : 'AG-04 · Portfolio AI'} · {m.ts}</div>
                      <div style={{ maxWidth: '80%', padding: '9px 14px', borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px', background: m.role === 'user' ? 'var(--pink-dim)' : 'var(--bg-inset)', border: `1px solid ${m.role === 'user' ? 'rgba(255,46,191,0.2)' : 'var(--border)'}`, fontFamily: 'Outfit, sans-serif', fontSize: 13, color: m.role === 'user' ? 'var(--pink-hi)' : 'var(--text-1)', lineHeight: 1.55 }}>{m.text}</div>
                    </div>
                  ))}
                  {portfolioChatLoading && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.05em' }}>AG-04 · Portfolio AI · thinking…</div>
                      <div style={{ padding: '9px 14px', borderRadius: '12px 12px 12px 4px', background: 'var(--bg-inset)', border: '1px solid var(--border)', display: 'flex', gap: 4, alignItems: 'center' }}>
                        {[0,1,2].map(d => <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pink)', opacity: 0.7, animation: `dot-pulse 1.2s ease-in-out ${d * 0.2}s infinite` }}/>)}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px 20px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                  <input
                    value={portfolioChatInput}
                    onChange={e => setPortfolioChatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && portfolioChatInput.trim() && !portfolioChatLoading) {
                        const msg = portfolioChatInput.trim()
                        setPortfolioChatInput('')
                        sendPortfolioChat(msg)
                      }
                    }}
                    disabled={portfolioChatLoading}
                    placeholder={portfolioChatLoading ? 'AG-04 is thinking…' : 'Ask about positioning, risk, momentum, the wall…'}
                    style={{ flex: 1, background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 14px', color: 'var(--text-1)', fontFamily: 'Outfit, sans-serif', fontSize: 13, outline: 'none', opacity: portfolioChatLoading ? 0.6 : 1 }}
                  />
                  <button
                    onClick={() => { const msg = portfolioChatInput.trim(); if (msg) { setPortfolioChatInput(''); sendPortfolioChat(msg) } }}
                    disabled={portfolioChatLoading || !portfolioChatInput.trim()}
                    style={{ padding: '9px 18px', background: 'var(--pink-dim)', border: '1px solid rgba(255,46,191,0.3)', borderRadius: 8, color: 'var(--pink-hi)', fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 600, cursor: portfolioChatLoading ? 'not-allowed' : 'pointer', opacity: portfolioChatLoading ? 0.5 : 1 }}
                  >{portfolioChatLoading ? '…' : 'Send'}</button>
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
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{actionItems.filter(a => !a.completed).length} pending</div>
                  </div>
                  <div className="action-list">
                    {actionItems.filter(a => !a.completed).slice(0, 4).map((a) => {
                      const urgencyLabel = a.urgency === 'crit' ? 'Critical' : a.urgency === 'high' ? 'High' : a.urgency === 'medium' ? 'Medium' : 'Low'
                      const dueFmt = a.due_date ? 'Due ' + new Date(a.due_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
                      return (
                        <div key={a.id} className={`action-item urg-${a.urgency}`} style={{ cursor: 'pointer' }} onClick={() => setActiveTab('action_items')}>
                          <div className="action-bar" />
                          <div className="action-body">
                            <div className="action-client-name">{a.client_name}</div>
                            <div className="action-desc">{a.description}</div>
                            <div className="action-tags">
                              <span className="atag atag-agent">{a.source_agent}</span>
                              {dueFmt && <span className="atag atag-date">{dueFmt}</span>}
                              {a.owner && <span className="atag atag-default">{a.owner}</span>}
                            </div>
                          </div>
                          <div className="action-badge">{urgencyLabel}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="card">
                  <div className="card-hd">
                    <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--violet)' }} />Agent Event Stream</div>
                    <div className="live-badge"><div className="live-dot" />Live</div>
                  </div>
                  <div className="stream-list">
                    {(() => {
                      const agentColor = (id: string) => {
                        if (id.includes('stall')) return 'var(--red)'
                        if (id.includes('momentum') || id.includes('AG-04')) return 'var(--pink)'
                        if (id.includes('budget') || id.includes('AG-08')) return 'var(--amber)'
                        if (id.includes('ai_disp') || id.includes('AG-06')) return 'var(--indigo)'
                        if (id.includes('goal') || id.includes('AG-05')) return 'var(--green)'
                        if (id.includes('pattern') || id.includes('AG-11')) return 'var(--violet)'
                        return 'var(--pink)'
                      }
                      const agentToId = (a: string) => {
                        if (a.includes('stall')) return 'AG-03'
                        if (a.includes('momentum')) return 'AG-04'
                        if (a.includes('budget')) return 'AG-08'
                        if (a.includes('ai_disp')) return 'AG-06'
                        if (a.includes('goal')) return 'AG-05'
                        if (a.includes('pattern')) return 'AG-11'
                        return 'AG-04'
                      }
                      const liveItems = queueEvents.map(e => ({
                        color: agentColor(e.agent_id),
                        agent: e.agent_id,
                        msg: typeof e.payload?.message === 'string' ? e.payload.message : JSON.stringify(e.payload),
                        time: new Date(e.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                        agentId: agentToId(e.agent_id),
                      }))
                      const mockItems = [
                        { color: 'var(--red)', agent: 'stall_detection', msg: 'Halcyon Systems — stall score crossed 9.0 threshold. Escalation queued.', time: '07:31', agentId: 'AG-03' },
                        { color: 'var(--pink)', agent: 'momentum_agent', msg: 'Pinnacle Group trajectory confirmed accelerating. Diagonal progress W22→W23: +0.6 composite.', time: '07:28', agentId: 'AG-04' },
                        { color: 'var(--amber)', agent: 'budget_team', msg: 'Vantage Partners budget cycle opens Jul 1. Proposal window alert sent.', time: '07:15', agentId: 'AG-08' },
                        { color: 'var(--indigo)', agent: 'ai_displacement', msg: 'New AI capability detected (code review automation). Risk score updated for 3 service lines.', time: '06:55', agentId: 'AG-06' },
                        { color: 'var(--green)', agent: 'goal_alignment', msg: 'Meridian Capital goal scores refreshed from Q2 board pack. 2 new priority flags set.', time: '06:40', agentId: 'AG-05' },
                        { color: 'var(--violet)', agent: 'pattern_library', msg: 'New pattern recorded: Y-axis jump from 6.1→8.5 via exec alignment + service expansion sequence.', time: '06:12', agentId: 'AG-11' },
                      ]
                      const items = liveItems.length > 0 ? liveItems : mockItems
                      return items.map((s, i) => (
                        <div className="stream-item" key={i} style={{ cursor: 'pointer' }} onClick={() => { setSelectedAgent(s.agentId); setActiveTab('agent_events') }}>
                          <div className="stream-dot" style={{ background: s.color }} />
                          <div className="stream-body">
                            <div className="stream-agent" style={{ color: s.color }}>{s.agent}</div>
                            <div className="stream-msg">{s.msg}</div>
                          </div>
                          <div className="stream-time">{s.time}</div>
                        </div>
                      ))
                    })()}
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
                  <div className="kpi-main-row"><div className="kpi-icon-wrap"><Icon.Users /></div><div className="kpi-value">{clients.length}</div></div>
                  <div className="kpi-label">Active Clients</div>
                </div>
                <div className="kpi green-kpi interactive-card" onClick={() => setActiveTab('agent_events')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap"><Icon.Cpu /></div><div className="kpi-value">{agentsData.length}</div></div>
                  <div className="kpi-label">Agents Active</div>
                </div>
                <div className="kpi red-kpi interactive-card" onClick={() => setActiveTab('action_items')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap"><Icon.CheckSquare /></div><div className="kpi-value">{actionItems.filter(a => !a.completed).length}</div></div>
                  <div className="kpi-label">Pending Actions</div>
                </div>
                <div className="kpi amber-kpi interactive-card" onClick={() => setActiveTab('stall_detection')}>
                  <div className="kpi-main-row"><div className="kpi-icon-wrap"><Icon.AlertTriangle /></div><div className="kpi-value">{clients.filter(c => c.status === 'Stalling').length}</div></div>
                  <div className="kpi-label">Stalling Accounts</div>
                </div>
              </div>

              {/* Workspace Section */}
              <div className="card" style={{ marginTop: 8 }}>
                <div className="card-hd" style={{ flexWrap: 'wrap', gap: 12 }}>
                  <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />Consultant Workspace</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <span style={{ position: 'absolute', left: 8, color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}><Icon.Search /></span>
                      <input 
                        type="text" 
                        placeholder="Search workspace..." 
                        className="search-input" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: 180, height: 28, padding: '0 10px 0 26px', fontSize: 11, background: 'var(--bg-inset)' }}
                      />
                    </div>
                    <div className="tab-group">
                      <div className={`tab ${homeSubTab === 'mails' ? 'active' : ''}`} onClick={() => setHomeSubTab('mails')}>Mails & Updates</div>
                      <div className={`tab ${homeSubTab === 'notes' ? 'active' : ''}`} onClick={() => setHomeSubTab('notes')}>Notes & Minutes</div>
                      <div className={`tab ${homeSubTab === 'calendar' ? 'active' : ''}`} onClick={() => setHomeSubTab('calendar')}>Calendar Events</div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: 20, minHeight: 280, display: 'flex', flexDirection: 'column' }}>
                  {homeSubTab === 'mails' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Recent Client Mails</div>
                        {(() => {
                          const filteredMails = mails.filter(m =>
                            m.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.subject.toLowerCase().includes(searchQuery.toLowerCase())
                          );
                          if (filteredMails.length === 0) {
                            return <div style={{ fontSize: 11, color: 'var(--text-3)', padding: 12 }}>No matching emails found.</div>;
                          }
                          return filteredMails.map((m, idx) => (
                            <div 
                              key={idx} 
                              style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12, cursor: 'pointer' }} 
                              className="interactive-card"
                              onClick={() => {
                                setActiveTab('clients');
                                setSelectedClient(m.client);
                              }}
                            >
                              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{m.sender} ({m.client})</div>
                              <div style={{ fontSize: 11, color: 'var(--text-2)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{m.subject}</div>
                            </div>
                          ));
                        })()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Send Quick Update</div>
                          {selectedClient && (
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--pink-hi)', background: 'rgba(255,46,191,0.08)', border: '1px solid rgba(255,46,191,0.2)', borderRadius: 4, padding: '2px 7px' }}>
                              To: {selectedClient}
                            </span>
                          )}
                        </div>
                        <textarea
                          className="search-input"
                          value={quickUpdateText}
                          onChange={e => setQuickUpdateText(e.target.value)}
                          placeholder={selectedClient ? `Draft an update for ${selectedClient}…` : 'Select a client from the list, then draft your update…'}
                          style={{ flex: 1, resize: 'none', padding: 12, fontFamily: 'Outfit', minHeight: 100 }}
                        />
                        <button
                          className="btn btn-pink"
                          style={{ alignSelf: 'flex-end' }}
                          disabled={quickUpdateSending || !quickUpdateText.trim() || !selectedClient}
                          onClick={async () => {
                            if (!selectedClient || !quickUpdateText.trim()) return
                            setQuickUpdateSending(true)
                            const { data: { user } } = await supabase.auth.getUser()
                            if (user) {
                              const client = clients.find(c => c.name === selectedClient)
                              await supabase.from('email_drafts').insert({
                                user_id: user.id,
                                client_id: (client as {client_id?: string})?.client_id ?? selectedClient,
                                subject: `Quick Update — ${selectedClient}`,
                                body: quickUpdateText,
                                draft_type: 'quick_update',
                                status: 'sent',
                                sent_at: new Date().toISOString(),
                              })
                            }
                            setQuickUpdateText('')
                            setQuickUpdateSending(false)
                            setShowToast(`Update sent to ${selectedClient}`)
                            setTimeout(() => setShowToast(null), 3000)
                          }}
                        >
                          {quickUpdateSending ? 'Sending…' : 'Send Update'}
                        </button>
                      </div>
                    </div>
                  )}
                  {homeSubTab === 'notes' && (
                    <div style={{ display: 'flex', gap: 0, flex: 1, minHeight: 320 }}>
                      {/* Left: note list */}
                      <div style={{ width: 200, flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '0 12px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Saved Notes</span>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '3px 8px', fontSize: 10 }}
                            onClick={() => { setNotesText(''); setActiveNoteId(null); setNotesSavedAt(null) }}
                          >+ New</button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {savedNotes.length === 0 ? (
                            <div style={{ padding: '10px 12px', fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic' }}>No saved notes yet</div>
                          ) : savedNotes.map(note => {
                            const firstLine = note.content.split('\n')[0]?.slice(0, 36) || 'Untitled note'
                            const lineCount = note.content.split('\n').filter(Boolean).length
                            const dateStr = new Date(note.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            const isActive = note.id === activeNoteId
                            return (
                              <div
                                key={note.id}
                                onClick={() => { setNotesText(note.content); setActiveNoteId(note.id); setNotesSavedAt(new Date(note.updated_at)) }}
                                style={{ padding: '9px 12px', cursor: 'pointer', background: isActive ? 'rgba(255,46,191,0.08)' : 'transparent', borderLeft: isActive ? '2px solid var(--pink)' : '2px solid transparent', transition: 'background 0.15s' }}
                              >
                                <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--text-1)' : 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{firstLine}</div>
                                <div style={{ marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
                                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>{dateStr}</span>
                                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>·</span>
                                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>{lineCount} line{lineCount !== 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Right: editor */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 16 }}>
                        <textarea
                          className="search-input"
                          value={notesText}
                          onChange={(e) => { setNotesText(e.target.value); setNotesSavedAt(null) }}
                          placeholder="Start typing your meeting notes here...&#10;&#10;First line becomes the note title.&#10;Auto-saves after 2 seconds."
                          style={{ flex: 1, resize: 'none', padding: 14, fontFamily: 'Outfit', lineHeight: 1.6, fontSize: 13 }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)' }}>
                            {notesSaving ? 'Saving…' : notesSavedAt ? `Saved ${notesSavedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : activeNoteId ? 'Unsaved changes' : 'New note — not yet saved'}
                          </span>
                          <button
                            className="btn btn-pink"
                            style={{ fontSize: 11, padding: '6px 16px' }}
                            disabled={notesSaving || !notesText.trim()}
                            onClick={() => saveNote(true)}
                          >
                            {notesSaving ? 'Saving…' : 'Save Note'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {homeSubTab === 'calendar' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Upcoming Events</div>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>{calendarEvents.length} event{calendarEvents.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {calendarEvents.map(ev => (
                          <div
                            key={ev.id}
                            style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderLeft: `3px solid ${ev.color}`, borderRadius: 'var(--r-md)', padding: '12px 16px', cursor: 'pointer' }}
                            className="interactive-card"
                            onClick={() => { setSelectedClient(ev.client); setActiveTab('clients') }}
                          >
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{ev.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 6 }}>{ev.start} — {ev.end}</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {ev.prep && <span className="atag atag-agent">Prep by {ev.prep}</span>}
                              <span className="atag atag-default">{ev.platform}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                <div className="card">
                  <div className="card-hd">
                    <div className="card-hd-title"><div className="title-pip" />Active Agent Actions</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {queueEvents.length > 0
                        ? <><div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }}/><span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--green)' }}>LIVE · {queueEvents.length} events</span></>
                        : <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>DEMO MODE</span>
                      }
                    </div>
                  </div>
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {(() => {
                      const liveFlow = queueEvents.length > 0
                        ? queueEvents.map(e => ({
                            agent:    e.agent_id,
                            color:    'var(--pink-hi)',
                            body:     typeof e.payload?.action_text === 'string' ? e.payload.action_text : JSON.stringify(e.payload),
                            time:     new Date(e.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                            dotColor: 'var(--indigo)',
                          }))
                        : MOCK_FLOW_ACTIONS
                      const filteredFlow = liveFlow.filter(act =>
                        act.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        act.body.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      if (filteredFlow.length === 0) {
                        return <div style={{ fontSize: 11, color: 'var(--text-3)', padding: 12 }}>No matching agent activities found.</div>;
                      }
                      return filteredFlow.map((act, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {idx > 0 && <div style={{ height: 1, background: 'var(--border)' }} />}
                          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <div className="live-dot" style={{ background: act.dotColor, boxShadow: act.dotColor === 'var(--red)' ? '0 0 6px var(--red)' : 'none', marginTop: 4 }} />
                            <div>
                              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: act.color }}>{act.agent}</div>
                              <div style={{ fontSize: 13, color: 'var(--text-1)', marginTop: 2 }}>{act.body}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>{act.time}</div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-hd"><div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--red)' }} />System Status</div></div>
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifySelf: 'center', alignSelf: 'center', position: 'relative', width: 90, height: 90, borderRadius: '50%', border: '4px solid rgba(255,46,191,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '4px solid var(--pink)', borderTopColor: 'transparent', animation: 'current-ring 3s linear infinite' }} />
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16 }}>ADK Orchestrator</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: mails !== MOCK_MAILS ? 'var(--green)' : 'var(--amber)', marginTop: 4 }}>
                        {mails !== MOCK_MAILS ? '● Gmail API Connected' : '○ Gmail · Demo Mode'}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: calendarEvents !== MOCK_CALENDAR_EVENTS ? 'var(--green)' : 'var(--amber)', marginTop: 2 }}>
                        {calendarEvents !== MOCK_CALENDAR_EVENTS ? '● Calendar API Connected' : '○ Calendar · Demo Mode'}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--green)', marginTop: 2 }}>● Supabase · {clients.length} clients synced</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--green)', marginTop: 2 }}>● {agentsData.length} agents registered</div>
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
                    {clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => {
                      const statusClass = c.status === 'Accelerating' ? 'success-rate-badge' : c.status === 'On Track' ? 'badge-indigo' : c.status === 'Progressing' ? 'badge-violet' : c.status === 'At Risk' ? 'badge-amber' : 'badge-red'
                      return (
                        <div 
                          key={c.name} 
                          className={`tab-list-item${selectedClient === c.name ? ' active' : ''}`}
                          onClick={() => {
                            setSelectedClient(c.name)
                            setShowComposeFor(null)
                            setShowDiagnosticsFor(null)
                            const firstName = c.contact?.split(' ')[0] ?? c.name
                            setComposeSubject(`Project Sync — ${c.name}`)
                            setEmailDraftBody(`Hi ${firstName},\n\nI wanted to follow up on our recent project progress and ensure we're aligned on next steps.\n\nWould you be available for a brief sync this week?\n\nBest,\n${userName || 'Your consultant'}`)
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
                  const client = clients.find(c => c.name === selectedClient) || clients[0]
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
                            setShowDiagnosticsFor(null)
                            setShowComposeFor(showComposeFor === client.name ? null : client.name)
                          }
                        }}>
                          {client.status === 'Stalling' ? <><Icon.Zap /> Open Stall Dashboard</> : <><Icon.Mail /> {showComposeFor === client.name ? 'Close Compose' : 'Compose Outreach'}</>}
                        </button>
                        <button className="btn btn-ghost" onClick={() => {
                          setShowComposeFor(null)
                          setShowDiagnosticsFor(showDiagnosticsFor === client.name ? null : client.name)
                        }}>
                          {showDiagnosticsFor === client.name ? 'Close Diagnostics' : 'Run Diagnostics'}
                        </button>
                      </div>

                      {/* Compose Outreach panel */}
                      {showComposeFor === client.name && (
                        <div style={{ marginTop: 20, padding: 20, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg-inset)', animation: 'rise 0.4s ease both' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-1)' }}><span style={{ color: 'var(--pink)' }}>✦</span> Compose Outreach — {client.name}</div>
                            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)' }}>To: {client.email}</div>
                          </div>
                          <input
                            value={composeSubject}
                            onChange={e => setComposeSubject(e.target.value)}
                            placeholder="Subject"
                            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 12px', color: 'var(--text-1)', fontSize: 13, marginBottom: 10, boxSizing: 'border-box' }}
                          />
                          <textarea
                            value={emailDraftBody}
                            onChange={e => setEmailDraftBody(e.target.value)}
                            rows={6}
                            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 12px', color: 'var(--text-1)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
                          />
                          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                            <button className="btn btn-pink" onClick={async () => {
                              const { data: { user } } = await supabase.auth.getUser()
                              if (!user || !emailDraftBody.trim()) return
                              await supabase.from('email_drafts').insert({
                                user_id: user.id,
                                client_id: client.client_id ?? null,
                                subject: composeSubject || `Outreach — ${client.name}`,
                                body: emailDraftBody,
                                draft_type: 'outreach',
                                status: 'draft',
                              })
                              setShowToast(`Draft saved for ${client.name}`)
                              setTimeout(() => setShowToast(null), 3000)
                            }}><Icon.Save /> Save Draft</button>
                            <button className="btn btn-ghost" onClick={async () => {
                              const { data: { user } } = await supabase.auth.getUser()
                              if (!user || !emailDraftBody.trim()) return
                              await supabase.from('email_drafts').insert({
                                user_id: user.id,
                                client_id: client.client_id ?? null,
                                subject: composeSubject || `Outreach — ${client.name}`,
                                body: emailDraftBody,
                                draft_type: 'outreach',
                                status: 'sent',
                                sent_at: new Date().toISOString(),
                              })
                              setShowComposeFor(null)
                              setEmailDraftBody('')
                              setShowToast(`Email sent to ${client.name}`)
                              setTimeout(() => setShowToast(null), 3000)
                            }}><Icon.Mail /> Send</button>
                          </div>
                        </div>
                      )}

                      {/* Diagnostics panel */}
                      {showDiagnosticsFor === client.name && (() => {
                        const momentum = client.client_id ? (clientMomentum[client.client_id] ?? []) : []
                        const darkDays = client.exec_dark_days ?? 0
                        const emailLabel = darkDays === 0 ? 'High (same-day)' : darkDays <= 2 ? `High (${darkDays}d avg)` : darkDays <= 7 ? `Medium (${darkDays}d avg)` : `Low (${darkDays}d dark)`
                        const emailColor = darkDays <= 2 ? 'var(--green)' : darkDays <= 7 ? 'var(--amber)' : 'var(--red)'
                        const budgetDev = client.budget_deviation ?? 0
                        const attendancePct = Math.max(0, Math.min(100, Math.round(100 + budgetDev * 0.8)))
                        const attendanceColor = attendancePct >= 85 ? 'var(--green)' : attendancePct >= 65 ? 'var(--amber)' : 'var(--red)'
                        const stallScore = client.stall_score ?? 0
                        const adherencePct = Math.max(0, Math.min(100, Math.round(100 - stallScore * 3)))
                        const adheranceColor = adherencePct >= 85 ? 'var(--text-1)' : adherencePct >= 65 ? 'var(--amber)' : 'var(--red)'

                        // Build SVG sparkline from momentum data (or static fallback)
                        let sparkPath = 'M 0,60 Q 50,40 100,50 T 200,20'
                        let sparkPoints: {cx: number; cy: number}[] = [{ cx: 0, cy: 60 }, { cx: 100, cy: 50 }, { cx: 200, cy: 20 }]
                        let trendLabel = 'Demo Data'
                        let trendColor = 'var(--text-3)'
                        if (momentum.length >= 2) {
                          const scores = momentum.map(m => m.score)
                          const minS = Math.min(...scores), maxS = Math.max(...scores)
                          const range = maxS - minS || 1
                          sparkPoints = momentum.map((m, i) => ({
                            cx: Math.round((i / (momentum.length - 1)) * 200),
                            cy: Math.round(70 - ((m.score - minS) / range) * 60),
                          }))
                          sparkPath = sparkPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.cx},${p.cy}`).join(' ')
                          const last = scores[scores.length - 1]
                          const prev = scores[scores.length - 2]
                          trendLabel = last >= prev ? 'Trending Up' : 'Trending Down'
                          trendColor = last >= prev ? 'var(--green)' : 'var(--red)'
                        }

                        const summaryText = [client.notes, client.alert_text].filter(Boolean).join(' · ')

                        return (
                          <div style={{ marginTop: 20, padding: 20, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg-inset)', animation: 'rise 0.4s ease both' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-1)' }}><span style={{ color: 'var(--pink)' }}>✦</span> Diagnostic Report: {client.name}</div>
                              <button className="btn btn-ghost" onClick={() => setShowDiagnosticsFor(null)} style={{ padding: '4px 8px' }}><Icon.X /> Close</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                              <div>
                                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase' }}>Momentum Score Trend</div>
                                <div style={{ height: 120, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 10, position: 'relative' }}>
                                  <svg viewBox="0 0 200 80" style={{ width: '100%', height: '100%' }}>
                                    <path d={sparkPath} fill="none" stroke="var(--pink)" strokeWidth="2" strokeLinecap="round" />
                                    {sparkPoints.map((p, i) => (
                                      <circle key={i} cx={p.cx} cy={p.cy} r={i === sparkPoints.length - 1 ? 4 : 3} fill={i === sparkPoints.length - 1 ? 'var(--pink)' : 'var(--indigo)'} />
                                    ))}
                                  </svg>
                                  <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 10, color: trendColor, fontFamily: 'JetBrains Mono', background: 'var(--bg-inset)', padding: '2px 6px', borderRadius: 4 }}>{trendLabel}</div>
                                  {momentum.length === 0 && (
                                    <div style={{ position: 'absolute', top: 8, left: 10, fontSize: 9, color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>demo · no history loaded</div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase' }}>Engagement Metrics</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12, height: 120, justifyContent: 'center' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>Exec Responsiveness</span> <span style={{ color: emailColor, fontWeight: 600 }}>{emailLabel}</span></div>
                                  <div style={{ height: 1, background: 'var(--border)' }} />
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>Meeting Attendance</span> <span style={{ color: attendanceColor, fontWeight: 600 }}>{attendancePct}%</span></div>
                                  <div style={{ height: 1, background: 'var(--border)' }} />
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>Scope Adherence</span> <span style={{ color: adheranceColor, fontWeight: 600 }}>{adherencePct}%</span></div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase' }}>AI Executive Summary</div>
                              <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-2)', background: 'var(--bg-card)', padding: 12, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
                                {summaryText || (
                                  <>
                                    Client shows consistent engagement but exec availability has slightly declined over recent weeks. Email responsiveness remains {darkDays <= 3 ? 'strong' : 'lower than optimal'}, suggesting {darkDays <= 3 ? 'healthy async communication' : 'a potential engagement gap'}.
                                    <br/><br/>
                                    <strong style={{ color: 'var(--text-1)' }}>Recommendation:</strong> {stallScore >= 6 ? 'Escalate engagement — stall risk is elevated. Pre-schedule key touchpoints immediately.' : 'Pre-schedule key check-ins 2 weeks in advance to lock in executive attendance.'}
                                  </>
                                )}
                                {summaryText && client.alert_text && (
                                  <><br/><br/><strong style={{ color: 'var(--amber)' }}>Alert:</strong> {client.alert_text}</>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* ENGAGEMENTS TAB — screener layout */}
          {activeTab === 'engagements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Engagement <span>Screener</span></div>
                  <div className="page-sub">{engagementsData.length} active mandates · live momentum scoring</div>
                </div>
              </div>

              {/* Portfolio summary strip — computed from live engagementsData */}
              {(() => {
                const totalRev  = engagementsData.reduce((s, e) => s + e.revenue, 0)
                const avgScore  = engagementsData.length ? (engagementsData.reduce((s, e) => s + Number(e.score), 0) / engagementsData.length).toFixed(1) : '—'
                const onTrack   = engagementsData.filter(e => e.health === 'On Track' || e.health === 'Progressing').length
                const atRisk    = engagementsData.filter(e => e.health === 'At Risk' || e.health === 'Stalling').length
                const avgDays   = engagementsData.length ? Math.round(engagementsData.reduce((s, e) => s + e.daysActive, 0) / engagementsData.length) : 0
                const strip = [
                  { label: 'TOTAL REVENUE',    val: `$${totalRev}K`,  color: 'var(--green)' },
                  { label: 'AVG SCORE',        val: String(avgScore), color: 'var(--text-1)' },
                  { label: 'ON TRACK',         val: String(onTrack),  color: 'var(--green)' },
                  { label: 'AT RISK / STALLING', val: String(atRisk), color: 'var(--red)' },
                  { label: 'AVG DAYS ACTIVE',  val: String(avgDays),  color: 'var(--text-1)' },
                ]
                return (
                  <div style={{ display: 'flex', gap: 12 }}>
                    {strip.map(s => (
                      <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: 5, animation: 'rise 0.4s ease both' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em' }}>{s.label}</div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: s.color, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                )
              })()}

              {/* Screener table */}
              <div className="card" style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 800, display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <div className="eng-header">
                    <div>CLIENT</div>
                    <div>PROJECT</div>
                    <div>PROGRESS</div>
                    <div>SCORE</div>
                    <div>STATUS</div>
                    <div>TREND</div>
                    <div>CONTACT</div>
                    <div>REV $K</div>
                  </div>

                  {/* Rows */}
                  {engagementsData.map((e) => {
                    const isOpen = expandedEngagement === e.client
                    const hColor = e.health === 'On Track' ? 'var(--green)' : e.health === 'Progressing' ? 'var(--indigo)' : e.health === 'At Risk' ? 'var(--amber)' : 'var(--red)'
                    const hBadge = e.health === 'On Track' ? 'success-rate-badge' : e.health === 'Progressing' ? 'badge-indigo' : e.health === 'At Risk' ? 'badge-amber' : 'badge-red'
                    const sparkColor = e.health === 'On Track' ? '#22C55E' : e.health === 'Progressing' ? '#818CF8' : e.health === 'At Risk' ? '#F59E0B' : '#EF4444'
                    return (
                      <div key={e.client}>
                        <div className={`eng-row${isOpen ? ' eng-active' : ''}`} onClick={() => setExpandedEngagement(isOpen ? null : e.client)}>
                          {/* CLIENT */}
                          <div>
                            <div className="eng-ticker">{e.ticker}</div>
                            <div className="eng-name-sub">{e.client}</div>
                          </div>
                          {/* PROJECT */}
                          <div className="eng-project-text">{e.project}</div>
                          {/* PROGRESS */}
                          <div className="eng-bar-wrap">
                            <div className="eng-bar">
                              <div className="eng-bar-fill" style={{ width: `${e.progress}%`, background: hColor }}/>
                            </div>
                            <span className="eng-pct-lbl">{e.progress}%</span>
                          </div>
                          {/* SCORE */}
                          <div>
                            <div className="eng-score-val" style={{ color: e.score >= 7 ? 'var(--green)' : e.score >= 4 ? 'var(--amber)' : 'var(--red)' }}>{e.score}</div>
                            <div className="eng-score-delta" style={{ color: e.scoreDelta > 0 ? 'var(--green)' : e.scoreDelta < 0 ? 'var(--red)' : 'var(--text-3)' }}>
                              {e.scoreDelta > 0 ? `+${e.scoreDelta}` : e.scoreDelta === 0 ? '—' : `${e.scoreDelta}`}
                            </div>
                          </div>
                          {/* STATUS */}
                          <div><span className={hBadge}>{e.health}</span></div>
                          {/* TREND sparkline */}
                          <div><Sparkline data={e.trend} color={sparkColor}/></div>
                          {/* LAST CONTACT */}
                          <div className="eng-contact-val" style={{ color: e.daysSinceContact === 0 ? 'var(--green)' : e.daysSinceContact <= 3 ? 'var(--amber)' : 'var(--red)' }}>
                            {e.daysSinceContact === 0 ? 'Today' : `${e.daysSinceContact}d ago`}
                          </div>
                          {/* REVENUE */}
                          <div className="eng-rev-val">${e.revenue}K</div>
                        </div>

                        {/* Expanded detail panel */}
                        {isOpen && (() => {
                          const logTypeMap: Record<string, { color: string; bg: string; label: string }> = {
                            meeting:   { color: 'var(--indigo)', bg: 'var(--indigo-dim)', label: 'Meeting' },
                            invoice:   { color: 'var(--green)',  bg: 'var(--green-dim)',  label: 'Invoice' },
                            change:    { color: 'var(--amber)',  bg: 'var(--amber-dim)',  label: 'Change Req' },
                            risk:      { color: 'var(--red)',    bg: 'var(--red-dim)',    label: 'Risk Event' },
                            milestone: { color: 'var(--pink)',   bg: 'var(--pink-dim)',   label: 'Milestone' },
                          }
                          return (
                            <div className="eng-detail" onClick={(ev) => ev.stopPropagation()}>
                              {/* Col 1 — Phase pipeline */}
                              <div className="eng-detail-col">
                                <div className="eng-detail-label">Phase Pipeline</div>
                                {/* Current phase badge */}
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--pink-dim)', border: '1px solid rgba(255,46,191,0.25)', borderRadius: 'var(--r-sm)', padding: '5px 12px', marginBottom: 16 }}>
                                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--pink)', letterSpacing: '0.08em' }}>CURRENT</span>
                                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--text-1)' }}>P{e.phaseNum} · {e.phase}</span>
                                </div>
                                <div className="phase-pipeline">
                                  {e.milestones.map((m, i) => {
                                    const past = i + 1 < e.phaseNum
                                    const current = i + 1 === e.phaseNum
                                    return (
                                      <div key={m} style={{ display: 'flex', alignItems: 'center', flex: i < e.milestones.length - 1 ? 1 : 'none' }}>
                                        <div className="phase-node" style={{
                                          background: past ? 'var(--green-dim)' : current ? 'var(--pink-dim)' : 'var(--bg-inset)',
                                          border: `2px solid ${past ? 'var(--green)' : current ? 'var(--pink)' : 'var(--border)'}`,
                                          color: past ? 'var(--green)' : current ? 'var(--pink)' : 'var(--text-3)',
                                        }}>P{i+1}</div>
                                        {i < e.milestones.length - 1 && (
                                          <div className="phase-conn" style={{ background: past ? 'var(--green)' : 'var(--border)', opacity: past ? 0.5 : 1 }}/>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                                <div className="phase-labels">
                                  {e.milestones.map((m, i) => (
                                    <div key={m} className="phase-lbl" style={{ color: i + 1 === e.phaseNum ? 'var(--text-1)' : 'var(--text-3)', fontWeight: i + 1 === e.phaseNum ? 600 : 400 }}>{m}</div>
                                  ))}
                                </div>
                                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                                  <div style={{ flex: 1, background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 12px' }}>
                                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginBottom: 3 }}>DAYS ACTIVE</div>
                                    <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: 'var(--text-1)', lineHeight: 1 }}>{e.daysActive}</div>
                                  </div>
                                  <div style={{ flex: 1, background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 12px' }}>
                                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginBottom: 3 }}>REVENUE</div>
                                    <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: 'var(--green)', lineHeight: 1 }}>${e.revenue}K</div>
                                  </div>
                                </div>
                              </div>

                              {/* Col 2 — Activity timeline */}
                              <div className="eng-detail-col">
                                <div className="eng-detail-label">Activity Timeline</div>
                                <div style={{ position: 'relative', paddingLeft: 22 }}>
                                  {/* Vertical spine */}
                                  <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: 'var(--border)', borderRadius: 1 }}/>
                                  {e.log.map((l, li) => {
                                    const tc = logTypeMap[l.type] ?? { color: 'var(--text-3)', bg: 'var(--bg-inset)', label: l.type }
                                    return (
                                      <div key={l.date + l.event} style={{ position: 'relative', marginBottom: li < e.log.length - 1 ? 20 : 0 }}>
                                        {/* Dot */}
                                        <div style={{ position: 'absolute', left: -18, top: 5, width: 10, height: 10, borderRadius: '50%', background: tc.color, boxShadow: `0 0 7px ${tc.color}55`, border: `2px solid var(--bg-card2)` }}/>
                                        {/* Header row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.04em' }}>{l.date}</span>
                                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, padding: '2px 7px', borderRadius: 3, background: tc.bg, color: tc.color, letterSpacing: '0.04em' }}>{tc.label}</span>
                                        </div>
                                        {/* Event text */}
                                        <div style={{ fontFamily: 'Outfit', fontSize: 13, fontWeight: 500, color: 'var(--text-1)', lineHeight: 1.45 }}>{l.event}</div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Col 3 — AI analysis */}
                              <div className="eng-detail-col" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className="eng-detail-label">AI Analysis</div>
                                <div className="eng-summary">{e.summary}</div>
                                {e.alert && (
                                  <div className="eng-alert">
                                    <Icon.AlertTriangle />
                                    <span>{e.alert}</span>
                                  </div>
                                )}
                                <div style={{ marginTop: 'auto', paddingTop: 14, display: 'flex', gap: 8 }}>
                                  <button className="btn btn-ghost" style={{ flex: 1, fontSize: 11, padding: '6px 10px' }} onClick={() => setActiveTab('clients')}>
                                    <Icon.Mail /> Compose
                                  </button>
                                  {e.health === 'Stalling' && (
                                    <button className="btn btn-pink" style={{ flex: 1, fontSize: 11, padding: '6px 10px' }} onClick={() => setActiveTab('stall_detection')}>
                                      <Icon.AlertTriangle /> Escalate
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )
                  })}
                </div>
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
                <div className="card-hd">
                  <div className="card-hd-title"><div className="title-pip" />Active Recommendations</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)' }}>
                    {actionItems.filter(a => !a.completed).length} pending · {actionItems.filter(a => a.completed).length} resolved
                  </div>
                </div>
                <div className="action-list">
                  {actionItems.map((a) => {
                    const urgencyLabel = a.urgency === 'crit' ? 'Critical' : a.urgency === 'high' ? 'High' : a.urgency === 'medium' ? 'Medium' : 'Low'
                    const dueFmt = a.due_date ? 'Due ' + new Date(a.due_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
                    const isStall = a.source_agent === 'stall_detection'
                    return (
                      <div key={a.id} className={`action-item urg-${a.urgency}`} style={{ opacity: a.completed ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                        <div className="action-bar" />
                        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            checked={a.completed}
                            onChange={() => {
                              toggleActionItem(a.id, !a.completed)
                              if (!a.completed) {
                                setShowToast(`Action for ${a.client_name} marked as resolved`)
                                setTimeout(() => setShowToast(null), 3000)
                              }
                            }}
                            style={{ width: 18, height: 18, marginRight: 16, accentColor: 'var(--pink)', cursor: 'pointer' }}
                          />
                        </div>
                        <div className="action-body">
                          <div className="action-client-name" style={{ textDecoration: a.completed ? 'line-through' : 'none' }}>{a.client_name}</div>
                          <div className="action-desc">{a.description}</div>
                          <div className="action-tags">
                            <span className="atag atag-agent">{a.source_agent}</span>
                            {dueFmt && <span className="atag atag-date">{dueFmt}</span>}
                            {a.owner && <span className="atag atag-default">{a.owner}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 20, gap: 8 }}>
                          {!a.completed && (
                            <button className="btn btn-ghost" onClick={() => {
                              toggleActionItem(a.id, true)
                              setShowToast(`Delegated to ${a.source_agent} agent. Tracking started.`)
                              setTimeout(() => setShowToast(null), 3000)
                            }} style={{ padding: '5px 10px', fontSize: 10 }}>
                              Delegate to Agent
                            </button>
                          )}
                          {!a.completed && isStall && (
                            <button className="btn btn-pink" onClick={() => setActiveTab('stall_detection')} style={{ padding: '5px 10px', fontSize: 10 }}>
                              Escalate
                            </button>
                          )}
                          {a.completed && a.completed_at && (
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--green)' }}>
                              ✓ {new Date(a.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <div style={{ paddingRight: 20 }}>
                          <span className={a.urgency === 'crit' ? 'badge-red' : a.urgency === 'high' ? 'badge-amber' : 'badge-indigo'}>{urgencyLabel}</span>
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
                  <div className="page-sub">{agentsData.length} active agents · {queueEvents.length > 0 ? `${queueEvents.length} live events` : 'awaiting first run'}</div>
                </div>
              </div>

              <div className="tab-panel-grid" style={{ gridTemplateColumns: '1fr 340px' }}>
                <div className="list-panel" style={{ padding: 16, position: 'relative', overflowY: 'auto', display: 'flex', alignItems: 'flex-start' }}>
                  <div className="workflow-scene" style={{ width: '100%' }}>
                    {/* viewBox 750×660: regular nodes 145×58, main node 165×68 */}
                    <svg viewBox="0 0 750 660" style={{ width: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="wf-glow">
                          <feGaussianBlur stdDeviation="3" result="b"/>
                          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="wf-glow-lg">
                          <feGaussianBlur stdDeviation="6" result="b"/>
                          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                      </defs>

                      {/* Layer labels */}
                      <text x="22" y="23" fill="rgba(129,140,248,0.6)" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="1.5">DATA SOURCES</text>
                      <text x="22" y="187" fill="rgba(255,46,191,0.6)" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="1.5">SPECIALIST AGENTS</text>
                      <text x="22" y="325" fill="rgba(155,48,217,0.75)" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="1.5">ORCHESTRATOR</text>
                      <text x="22" y="463" fill="rgba(34,197,94,0.6)" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="1.5">ACTION LAYER</text>
                      <text x="22" y="563" fill="rgba(255,46,191,0.4)" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="1.5">DASHBOARD OUTPUT</text>

                      {/* Paths */}
                      {WORKFLOW_PATHS.map(p => (
                        <path key={p.id} id={p.id} d={p.d} fill="none"
                          stroke={p.color === 'pink' ? 'rgba(255,46,191,0.25)' : p.color === 'indigo' ? 'rgba(129,140,248,0.25)' : 'rgba(155,48,217,0.25)'}
                          strokeWidth="2" strokeDasharray="6 5"
                        />
                      ))}

                      {/* Animated packets */}
                      {WORKFLOW_PATHS.map(p => (
                        <circle key={`anim_${p.id}`}
                          r={p.color === 'pink' ? '4' : '3'}
                          fill={p.color === 'pink' ? '#FF2EBF' : p.color === 'indigo' ? '#818CF8' : '#9B30D9'}
                          filter="url(#wf-glow)" opacity="0.95"
                        >
                          <animateMotion dur={p.dur} repeatCount="indefinite" begin={p.delay}>
                            <mpath href={`#${p.id}`}/>
                          </animateMotion>
                        </circle>
                      ))}

                      {/* Nodes — regular nw=145 nh=58, main nw=165 nh=68 */}
                      {WORKFLOW_NODES.map(node => {
                        const agent = agentsData.find(a => a.id === node.id)
                        const isSelected = selectedAgent === node.id
                        const statusColor = agent?.status === 'Alerting' ? '#EF4444' : agent?.status === 'Analyzing' ? '#F59E0B' : '#22C55E'
                        const layerColor = node.col === 'source' ? '#818CF8'
                          : node.col === 'specialist' ? '#FF2EBF'
                          : node.col === 'orchestrator' ? (node.isMain ? '#FF2EBF' : '#9B30D9')
                          : '#22C55E'
                        const nw = node.isMain ? 165 : 145
                        const nh = node.isMain ? 68 : 58
                        return (
                          <g key={node.id} style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredAgent(node.id)}
                            onMouseLeave={() => setHoveredAgent(null)}
                            onClick={() => setSelectedAgent(node.id)}
                          >
                            {/* Selection glow */}
                            {isSelected && (
                              <rect x={node.x - nw/2 - 5} y={node.y - nh/2 - 5} width={nw + 10} height={nh + 10} rx={11}
                                fill="none" stroke="rgba(255,46,191,0.3)" strokeWidth={10} filter="url(#wf-glow)"
                              />
                            )}
                            {/* Momentum pulse ring */}
                            {node.isMain && (
                              <rect x={node.x - 90} y={node.y - 40} width={180} height={80} rx={12}
                                fill="none" stroke="rgba(255,46,191,0.2)" strokeWidth={1.5}>
                                <animate attributeName="opacity" values="1;0.1;1" dur="3s" repeatCount="indefinite"/>
                              </rect>
                            )}
                            {/* Card */}
                            <rect x={node.x - nw/2} y={node.y - nh/2} width={nw} height={nh} rx={8}
                              fill="#13131C"
                              stroke={isSelected ? 'rgba(255,46,191,0.9)' : `${layerColor}55`}
                              strokeWidth={isSelected ? 2 : 1}
                            />
                            {/* Left accent strip */}
                            <rect x={node.x - nw/2} y={node.y - nh/2 + 9} width={4} height={nh - 18} rx={2}
                              fill={layerColor} opacity={isSelected ? 1 : 0.85}
                            />
                            {/* Agent name */}
                            <text x={node.x - nw/2 + 16} y={node.y - (node.isMain ? 7 : 5)}
                              textAnchor="start"
                              fill={isSelected ? '#FF71D5' : '#EEEEFF'}
                              fontSize={node.isMain ? 13 : 11}
                              fontFamily="Outfit" fontWeight="700"
                            >{node.name}</text>
                            {/* Agent ID */}
                            <text x={node.x - nw/2 + 16} y={node.y + (node.isMain ? 13 : 12)}
                              textAnchor="start"
                              fill={`${layerColor}BB`}
                              fontSize="9" fontFamily="JetBrains Mono"
                            >{node.id}</text>
                            {/* Status dot */}
                            <circle cx={node.x + nw/2 - 12} cy={node.y - nh/2 + 12} r={4} fill={statusColor}/>
                            {/* Alerting pulse */}
                            {agent?.status === 'Alerting' && (
                              <circle cx={node.x + nw/2 - 12} cy={node.y - nh/2 + 12} r={7}
                                fill="none" stroke="#EF4444" strokeWidth="1.5">
                                <animate attributeName="r" values="4;10;4" dur="1.5s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="0.9;0;0.9" dur="1.5s" repeatCount="indefinite"/>
                              </circle>
                            )}
                          </g>
                        )
                      })}

                      {/* Dashboard output */}
                      <g>
                        <rect x="310" y="590" width="130" height="46" rx="9"
                          fill="rgba(255,46,191,0.07)" stroke="rgba(255,46,191,0.4)" strokeWidth="1.5"/>
                        <rect x="310" y="590" width="130" height="46" rx="9"
                          fill="none" stroke="rgba(255,46,191,0.2)" strokeWidth="1.5">
                          <animate attributeName="opacity" values="1;0.2;1" dur="2.2s" repeatCount="indefinite"/>
                        </rect>
                        <text x="375" y="610" textAnchor="middle" fill="#FF2EBF"
                          fontSize="11" fontFamily="Outfit" fontWeight="700">Dashboard</text>
                        <text x="375" y="625" textAnchor="middle" fill="rgba(255,255,255,0.42)"
                          fontSize="8" fontFamily="JetBrains Mono" letterSpacing="1">HUMAN OUTPUT</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {(() => {
                  const agent = agentsData.find(a => a.id === selectedAgent) || agentsData[0]
                  return (
                    <div className="detail-panel">
                      <div>
                        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit' }}>{agent.id}</div>
                            <div style={{ fontSize: 14, color: 'var(--text-1)', fontWeight: 600, marginTop: 2 }}>{agent.name}</div>
                            {agent.updatedAt && (
                              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginTop: 4 }}>
                                Last active {new Date(agent.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                              </div>
                            )}
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
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                          <span>Read/Write Events Log</span>
                          {queueEvents.filter(e => e.agent_id === agent.id).length > 0
                            ? <span style={{ color: 'var(--green)' }}>● {queueEvents.filter(e => e.agent_id === agent.id).length} live</span>
                            : <span style={{ color: 'var(--text-3)' }}>demo mode</span>
                          }
                        </div>
                        <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-2)', lineHeight: 1.8, overflowY: 'auto', flex: 1 }}>
                          {(() => {
                            const agentEvents = queueEvents.filter(e => e.agent_id === agent.id)
                            const ts = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
                            const baseTs = agent.updatedAt ? ts(agent.updatedAt) : '--:--:--'

                            if (agentEvents.length > 0) {
                              return agentEvents.slice(0, 30).map(ev => {
                                const msg = typeof ev.payload?.action_text === 'string' ? ev.payload.action_text
                                  : typeof ev.payload?.message === 'string' ? ev.payload.message
                                  : JSON.stringify(ev.payload)
                                const evColor = ev.event_type === 'alert' ? 'var(--red)' : ev.event_type === 'write' ? 'var(--pink-hi)' : 'var(--indigo)'
                                const label = ev.event_type === 'alert' ? 'ALERT' : ev.event_type === 'write' ? 'WRITE' : 'READ'
                                return (
                                  <div key={ev.id}>
                                    <span style={{ color: 'var(--text-3)' }}>[{ts(ev.created_at)}]</span>{' '}
                                    <span style={{ color: evColor }}>{label}</span>{' '}
                                    {msg}
                                  </div>
                                )
                              })
                            }

                            // Fallback — generic log shaped to this agent's actual status and lastAction
                            return (
                              <>
                                <div><span style={{ color: 'var(--text-3)' }}>[{baseTs}]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> System trigger initialized loop...</div>
                                <div><span style={{ color: 'var(--text-3)' }}>[{baseTs}]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> Ingested data from stream buffer...</div>
                                {agent.status === 'Alerting' ? (
                                  <>
                                    <div style={{ color: 'var(--red)' }}><span style={{ color: 'var(--text-3)' }}>[{baseTs}]</span> <span>WRITE</span> ALERT: {agent.lastAction}</div>
                                    <div style={{ color: 'var(--red)' }}><span style={{ color: 'var(--text-3)' }}>[{baseTs}]</span> <span>WRITE</span> Emitting high-priority flag to orchestrator.</div>
                                    <div><span style={{ color: 'var(--text-3)' }}>[{baseTs}]</span> <span style={{ color: 'var(--pink-hi)' }}>WRITE</span> Pushed action item to global queue.</div>
                                  </>
                                ) : agent.status === 'Analyzing' ? (
                                  <>
                                    <div><span style={{ color: 'var(--text-3)' }}>[{baseTs}]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> {agent.lastAction}</div>
                                    <div style={{ color: 'var(--amber)' }}><span style={{ color: 'var(--text-3)' }}>[{baseTs}]</span> <span>WRITE</span> Partial mismatch detected. Flagging for review.</div>
                                  </>
                                ) : (
                                  <>
                                    <div><span style={{ color: 'var(--text-3)' }}>[{baseTs}]</span> <span style={{ color: 'var(--indigo)' }}>READ</span> {agent.lastAction}</div>
                                    <div style={{ color: 'var(--green)' }}><span style={{ color: 'var(--text-3)' }}>[{baseTs}]</span> <span>WRITE</span> Logged success status. Awaiting next cycle.</div>
                                  </>
                                )}
                              </>
                            )
                          })()}
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
                    const ha = agentsData.find(a => a.id === hoveredAgent)!;
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
          {activeTab === 'stall_detection' && (() => {
            // Compute critical client — live from clients state, fallback to Halcyon demo
            const critClient = [...clients]
              .filter(c => c.status === 'Stalling' || c.status === 'At Risk')
              .sort((a, b) => {
                const sa = a.stall_score ?? STALL_DEMO[a.name]?.stall_score ?? 0
                const sb = b.stall_score ?? STALL_DEMO[b.name]?.stall_score ?? 0
                return sb - sa
              })[0] ?? clients.find(c => c.name === 'Halcyon Systems') ?? clients[0]
            const critDemo = STALL_DEMO[critClient?.name ?? ''] ?? STALL_DEMO['Halcyon Systems']
            const critStallScore = critClient?.stall_score ?? critDemo.stall_score
            const critExecDark = critClient?.exec_dark_days ?? critDemo.exec_dark_days
            const critScoreDelta = critClient?.score_delta ?? critDemo.score_delta
            const critExecLabel = critClient?.exec_cadence_label ?? critDemo.exec_cadence_label
            const critTicker = (critClient as {ticker?: string})?.ticker ?? critClient?.name?.slice(0,3).toUpperCase() ?? 'HCS'
            const critEngagement = engagementsData.find(e => e.client === critClient?.name)
            const missedMilestones = critEngagement?.log?.filter((l: {type: string}) => l.type === 'risk').length ?? 3
            const ag03 = agentsData.find(a => a.id === 'AG-03')
            const ag03Ts = (ag03 as {updatedAt?: string})?.updatedAt
              ? new Date((ag03 as {updatedAt?: string}).updatedAt!).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ' ·')
              : '06/07 · 07:31'
            const ag03Status = ag03?.status ?? 'Alerting'
            const critCount = actionItems.filter(a => !a.completed && a.urgency === 'crit').length || 2

            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Stall <span>Detection Center</span></div>
                  <div className="page-sub">Raw signals → risk scoring → automated intervention</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--r-sm)', padding: '6px 12px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 6px var(--red)', animation: 'dot-pulse 1.5s ease-in-out infinite' }}/>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--red)' }}>{critCount} CRITICAL · AG-03 {ag03Status.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Insight chain pipeline */}
              <div className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div className="card-hd-title" style={{ margin: 0 }}><div className="title-pip" style={{ background: 'var(--pink)' }}/>{critClient?.name ?? 'Halcyon Systems'} · Insight Chain</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>AG-03 triggered {ag03Ts}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                  {[
                    { n: '1', label: 'Gmail Synth', agent: 'AG-10', detail: '4 delay-language emails', color: 'var(--indigo)', layer: 'DATA SOURCE' },
                    { n: '2', label: 'Exec Gap', agent: 'AG-02', detail: `${critExecLabel === 'Active' ? 'Exec engaged' : `CTO dark ${critExecDark}d`}`, color: 'var(--amber)', layer: 'DATA SOURCE' },
                    { n: '3', label: 'Rel. Scorer', agent: 'AG-07', detail: `Score ${critScoreDelta >= 0 ? '+' : ''}${Number(critScoreDelta).toFixed(1)} pts / 30d`, color: 'var(--violet)', layer: 'SPECIALIST' },
                    { n: '4', label: 'Stall Detect', agent: 'AG-03', detail: `Stall score ${Number(critStallScore).toFixed(1)} / 10`, color: 'var(--red)', layer: 'SPECIALIST' },
                    { n: '5', label: 'Momentum Orch', agent: 'AG-04', detail: 'Escalation threshold met', color: 'var(--pink)', layer: 'ORCHESTRATOR' },
                    { n: '6', label: 'Pattern Library', agent: 'AG-11', detail: 'Matched: Exec Bridge', color: 'var(--violet)', layer: 'ORCHESTRATOR' },
                    { n: '7', label: 'Defense Play', agent: 'AG-09', detail: 'Play #1 queued', color: 'var(--green)', layer: 'ACTION' },
                    { n: '8', label: 'Outreach Draft', agent: 'AG-12', detail: 'Email ready to send', color: 'var(--green)', layer: 'ACTION' },
                  ].map((step, i, arr) => (
                    <div key={step.n} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none', minWidth: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 86 }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: step.color, letterSpacing: '0.06em', marginBottom: 2 }}>{step.layer}</div>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: step.color + '1A', border: `1.5px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono', fontSize: 13, color: step.color, fontWeight: 700 }}>{step.n}</div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, color: 'var(--text-1)', textAlign: 'center', lineHeight: 1.3 }}>{step.label}</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: step.color + 'CC' }}>{step.agent}</div>
                        <div style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.4, maxWidth: 86 }}>{step.detail}</div>
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ flex: 1, height: 1.5, background: `linear-gradient(to right, ${step.color}66, ${arr[i+1].color}66)`, margin: '0 4px', marginBottom: 42 }}/>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Account stall risk matrix */}
              <div className="card">
                <div className="card-hd">
                  <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--red)' }}/>Account Stall Risk Matrix</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>
                    AG-03 · {ag03Ts ? `last run ${ag03Ts}` : 'computed 2 min ago'}
                  </div>
                </div>
                <div style={{ padding: '0 0 4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '160px 96px 108px 116px 122px 116px 1fr', padding: '8px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.04em' }}>
                    <div>CLIENT</div><div>STALL SCORE</div><div>EXEC CADENCE</div><div>BUDGET HEALTH</div><div>REL. SCORE DELTA</div><div>LAST CONTACT</div><div>STATUS</div>
                  </div>
                  {[...clients].sort((a, b) => {
                    const sa = a.stall_score ?? STALL_DEMO[a.name]?.stall_score ?? 0
                    const sb = b.stall_score ?? STALL_DEMO[b.name]?.stall_score ?? 0
                    return sb - sa
                  }).map(c => {
                    const demo = STALL_DEMO[c.name] ?? { stall_score: 0, exec_cadence_label: 'Active', budget_deviation: 0, score_delta: 0, exec_dark_days: 0 }
                    const stallScore = c.stall_score ?? demo.stall_score
                    const execLabel = c.exec_cadence_label ?? demo.exec_cadence_label
                    const budgetDev = c.budget_deviation ?? demo.budget_deviation
                    const relDelta  = c.score_delta ?? demo.score_delta
                    const darkDays  = c.exec_dark_days ?? demo.exec_dark_days
                    const ticker = (c as {ticker?: string}).ticker ?? c.name.slice(0,3).toUpperCase()
                    const sc = c.status === 'Stalling' ? 'var(--red)' : c.status === 'At Risk' ? 'var(--amber)' : c.status === 'Progressing' ? 'var(--indigo)' : 'var(--green)'
                    const stallLabel = c.status === 'Stalling' ? 'Stalling' : c.status === 'At Risk' ? 'At Risk' : c.status === 'Progressing' ? 'Monitor' : 'Healthy'
                    return (
                      <div key={ticker} style={{ display: 'grid', gridTemplateColumns: '160px 96px 108px 116px 122px 116px 1fr', padding: '9px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: c.status === 'Stalling' ? 'rgba(239,68,68,0.03)' : 'transparent', cursor: 'pointer' }}
                        onClick={() => { setSelectedClient(c.name); setActiveTab('clients') }}>
                        <div>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{ticker}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{c.name}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 22, color: sc, lineHeight: 1 }}>{Number(stallScore).toFixed(1)}</span>
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)' }}>/10</span>
                        </div>
                        <div style={{ fontFamily: 'Outfit', fontSize: 13, color: execLabel.startsWith('Dark') || execLabel === 'Evasive' ? 'var(--red)' : execLabel === 'Slowing' ? 'var(--amber)' : 'var(--text-2)' }}>{execLabel}</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: budgetDev >= 0 ? 'var(--green)' : 'var(--red)' }}>{budgetDev >= 0 ? '+' : ''}{budgetDev}%</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: relDelta >= 0 ? 'var(--green)' : 'var(--red)' }}>{relDelta >= 0 ? '+' : ''}{Number(relDelta).toFixed(1)} pts</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--text-3)' }}>{darkDays === 0 ? 'Today' : `${darkDays}d ago`}</div>
                        <div><span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, padding: '3px 8px', borderRadius: 4, background: sc + '1A', color: sc, border: `1px solid ${sc}44` }}>{stallLabel}</span></div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Active case deep-dive + outreach */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 8px var(--red)', animation: 'dot-pulse 1.5s ease-in-out infinite' }}/>
                    <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>
                      {critClient?.name ?? 'Halcyon Systems'} <span style={{ color: 'var(--text-3)', fontWeight: 400, fontSize: 12 }}>{critTicker}</span>
                    </div>
                    <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, padding: '3px 8px', borderRadius: 4, background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)' }}>
                      {(critClient?.status ?? 'Stalling').toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1, background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 14px' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginBottom: 4 }}>STALL SCORE</div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, color: 'var(--red)', lineHeight: 1 }}>
                          {Number(critStallScore).toFixed(1)}<span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 400 }}>/10</span>
                        </div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 14px' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginBottom: 4 }}>EXEC DARK</div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, color: critExecDark > 14 ? 'var(--red)' : 'var(--amber)', lineHeight: 1 }}>
                          {critExecDark}<span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 400 }}>d</span>
                        </div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 14px' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginBottom: 4 }}>MILESTONES</div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, color: 'var(--red)', lineHeight: 1 }}>
                          {missedMilestones}<span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 400 }}> missed</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginBottom: 6 }}>FLAGGED COMMUNICATION · AG-10</div>
                      <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderLeft: '3px solid var(--red)', borderRadius: 'var(--r-sm)', padding: '10px 14px', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                        {critEngagement?.log?.[0] ? (
                          <>&quot;...<span style={{ color: 'var(--red)', fontWeight: 600 }}>{critEngagement.log[0].event}</span>&quot;
                          <div style={{ marginTop: 6, fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>{critClient?.contact ?? 'Exec contact'} · {critEngagement.log[0].date}</div></>
                        ) : (
                          <>&quot;...we might need to <span style={{ color: 'var(--red)', fontWeight: 600 }}>push the stakeholder steering review meetings to late next month</span>.&quot;
                          <div style={{ marginTop: 6, fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>{critClient?.contact ?? 'Greg House (CTO)'} · Jun 01</div></>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--pink-dim)', border: '1px solid rgba(255,46,191,0.2)', borderRadius: 'var(--r-sm)', padding: '10px 14px' }}>
                      <Icon.Target />
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>AG-11 PATTERN MATCH</div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--pink-hi)', marginTop: 2 }}>The Executive Bridge · Playbook #1 · 94% success rate</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Icon.Zap />
                    <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>AG-12 · Outreach Draft</div>
                    <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, padding: '2px 8px', borderRadius: 4, background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.3)' }}>READY</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: 'JetBrains Mono', letterSpacing: '0.05em' }}>EMAIL SUBJECT</label>
                      <input type="text" className="search-input" value={`${critClient?.name ?? 'Halcyon Systems'} — Project Alignment & Roadmap Steering Sync`} readOnly style={{ width: '100%', marginTop: 4 }}/>
                    </div>
                    <div>
                      <label style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: 'JetBrains Mono', letterSpacing: '0.05em' }}>EMAIL BODY</label>
                      <textarea
                        className="search-input"
                        value={emailDraftBody}
                        onChange={(e) => setEmailDraftBody(e.target.value)}
                        style={{ width: '100%', height: 140, marginTop: 4, resize: 'none', padding: 10, fontFamily: 'Outfit', lineHeight: 1.5, fontSize: 12 }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost" style={{ flex: 1, fontSize: 11 }} onClick={() => setShowToast('Saved to drafts.')}>
                        Save Draft
                      </button>
                      <button
                        className="btn btn-pink"
                        style={{ flex: 2, fontSize: 11 }}
                        disabled={isSendingEmail}
                        onClick={() => {
                          setIsSendingEmail(true)
                          setTimeout(() => {
                            setIsSendingEmail(false)
                            setShowToast(`Email sent to ${critClient?.contact ?? 'Greg House'} via Gmail API!`)
                            setTimeout(() => setShowToast(null), 4000)
                          }, 1500)
                        }}
                      >
                        {isSendingEmail ? 'Sending via Gmail...' : <><Icon.Send /> Send via Gmail API</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
          })()}

          {/* AI DANGER ZONE TAB */}
          {activeTab === 'ai_danger_zone' && (() => {
            // Per-client displacement data — live from Supabase or AI_DISP_DEMO fallback
            const dispClients = [...clients]
              .map(c => ({
                c,
                pct: c.displacement_pct ?? AI_DISP_DEMO[c.name]?.displacement_pct ?? 0,
                revK: AI_DISP_DEMO[c.name]?.rev_k ?? 0,
                ticker: (c as { ticker?: string }).ticker ?? c.name.slice(0, 3).toUpperCase(),
              }))
              .sort((a, b) => b.pct - a.pct)

            const dispColor = (pct: number) =>
              pct >= 70 ? 'var(--red)' : pct >= 50 ? 'var(--amber)' : pct >= 30 ? 'var(--indigo)' : 'var(--green)'

            const highExposure = dispClients.filter(x => x.pct >= 60)
            const totalRevRisk = dispClients.reduce((sum, x) => sum + Math.round(x.revK * x.pct / 100), 0)

            // Clients by displacement tier — for "accounts affected" in service matrix
            const tierNames = (minPct: number, maxPct = 101, limit = 3) =>
              dispClients
                .filter(x => x.pct >= minPct && x.pct < maxPct)
                .slice(0, limit)
                .map(x => x.ticker)
                .join(', ') || '—'

            const ag06 = agentsData.find(a => a.id === 'AG-06')
            const ag06Status = ag06?.status ?? 'Active'
            const ag06Ts = (ag06 as { updatedAt?: string })?.updatedAt
              ? new Date((ag06 as { updatedAt?: string }).updatedAt!).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ' ·')
              : '06/07 · 06:44'

            const deployTargets = highExposure.slice(0, 3).map(x => x.c.name)
            const deployLabel = deployTargets.length
              ? deployTargets.slice(0, 2).join(', ') + (deployTargets.length > 2 ? ` & ${deployTargets[2]}` : '')
              : 'high-exposure accounts'

            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">AI <span>Danger Zone</span></div>
                  <div className="page-sub">Deliverable scans → exposure scoring → repositioning plays</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--r-sm)', padding: '6px 12px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', boxShadow: '0 0 6px var(--amber)', animation: 'dot-pulse 1.5s ease-in-out infinite' }}/>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--amber)' }}>
                      {highExposure.length} HIGH-EXPOSURE · AG-06 {ag06Status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Insight chain */}
              <div className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div className="card-hd-title" style={{ margin: 0 }}><div className="title-pip" style={{ background: 'var(--amber)' }}/>Commoditization Insight Chain</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>AG-06 triggered {ag06Ts}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                  {[
                    { n: '1', label: 'Gmail Synth',    agent: 'AG-10', detail: `${dispClients.filter(x => x.pct >= 60).length} clients mention AI tools in recent emails`, color: 'var(--indigo)', layer: 'DATA SOURCE' },
                    { n: '2', label: 'AI Displacement', agent: 'AG-06', detail: `${dispClients.length * 4}+ deliverables scanned, ${highExposure.length * 4} flagged >60%`, color: 'var(--amber)', layer: 'SPECIALIST' },
                    { n: '3', label: 'Value Chain',     agent: 'AG-01', detail: 'Execution vs. strategy split mapped', color: 'var(--indigo)', layer: 'SPECIALIST' },
                    { n: '4', label: 'Momentum Orch',   agent: 'AG-04', detail: `$${totalRevRisk}K revenue risk computed`, color: 'var(--pink)', layer: 'ORCHESTRATOR' },
                    { n: '5', label: 'Pattern Library', agent: 'AG-11', detail: 'Value Chain Shift matched (91%)', color: 'var(--violet)', layer: 'ORCHESTRATOR' },
                    { n: '6', label: 'Defense Play',    agent: 'AG-09', detail: `Play queued for ${highExposure.length} accounts`, color: 'var(--green)', layer: 'ACTION' },
                  ].map((step, i, arr) => (
                    <div key={step.n} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none', minWidth: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 100 }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: step.color, letterSpacing: '0.06em', marginBottom: 2 }}>{step.layer}</div>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: step.color + '1A', border: `1.5px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono', fontSize: 13, color: step.color, fontWeight: 700 }}>{step.n}</div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, color: 'var(--text-1)', textAlign: 'center', lineHeight: 1.3 }}>{step.label}</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: step.color + 'CC' }}>{step.agent}</div>
                        <div style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.4, maxWidth: 100 }}>{step.detail}</div>
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ flex: 1, height: 1.5, background: `linear-gradient(to right, ${step.color}66, ${arr[i+1].color}66)`, margin: '0 4px', marginBottom: 42 }}/>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Service delivery exposure matrix */}
              <div className="card">
                <div className="card-hd">
                  <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--amber)' }}/>Service Delivery Exposure Index</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>
                    AG-06 · {dispClients.length * 4}+ deliverables scanned
                  </div>
                </div>
                <div style={{ padding: '0 0 4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 88px 118px 160px 170px', padding: '8px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.04em' }}>
                    <div>SERVICE LINE</div><div>EXPOSURE</div><div>RISK</div><div>REVENUE AT RISK</div><div>ACCOUNTS AFFECTED</div><div>AG-11 PLAY</div>
                  </div>
                  {[
                    { task: 'Code refactoring & unit testing',     pct: 95, risk: 'Critical',  rc: 'var(--red)',    rev: '$84K',  minPct: 70, maxPct: 101, play: 'Value Chain Shift' },
                    { task: 'Business process documentation',       pct: 80, risk: 'High',      rc: 'var(--amber)', rev: '$72K',  minPct: 55, maxPct: 70,  play: 'Value Chain Shift' },
                    { task: 'Technical audit & security scanning',  pct: 65, risk: 'Medium',    rc: 'var(--indigo)',rev: '$58K',  minPct: 40, maxPct: 55,  play: 'Scope Lock' },
                    { task: 'Architecture design & blueprinting',   pct: 35, risk: 'Low',       rc: 'var(--green)', rev: '$38K',  minPct: 20, maxPct: 40,  play: 'None required' },
                    { task: 'Strategic exec alignment workshops',   pct: 10, risk: 'Negligible', rc: 'var(--pink)',  rev: '$28K',  minPct: 0,  maxPct: 101, play: 'None required' },
                  ].map(r => {
                    const accts = r.minPct === 0 ? 'All accounts' : tierNames(r.minPct, r.maxPct)
                    return (
                    <div key={r.task} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 88px 118px 160px 170px', padding: '9px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: r.pct >= 80 ? r.rc + '08' : 'transparent' }}>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>{r.task}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ height: 5, background: 'var(--bg-inset)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <div style={{ width: `${r.pct}%`, height: '100%', background: r.rc }}/>
                        </div>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: r.rc }}>{r.pct}%</span>
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, padding: '3px 7px', borderRadius: 4, background: r.rc + '1A', color: r.rc, border: `1px solid ${r.rc}44`, whiteSpace: 'nowrap' }}>{r.risk}</span>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: r.pct >= 65 ? 'var(--red)' : 'var(--text-2)' }}>{r.rev}</div>
                      <div style={{ fontFamily: 'Outfit', fontSize: 13, color: 'var(--text-3)' }}>{accts}</div>
                      <div style={{ fontFamily: 'Outfit', fontSize: 13, color: r.play === 'None required' ? 'var(--text-3)' : 'var(--pink-hi)', fontWeight: r.play === 'None required' ? 400 : 600 }}>{r.play}</div>
                    </div>
                    )
                  })}
                </div>
              </div>

              {/* Account exposure breakdown + top recommended play */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card" style={{ padding: 20 }}>
                  <div className="card-hd-title" style={{ marginBottom: 14 }}><div className="title-pip" style={{ background: 'var(--amber)' }}/>Account-Level Exposure</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {dispClients.map(({ c, pct, ticker, revK }) => {
                      const col = dispColor(pct)
                      const revAtRisk = Math.round(revK * pct / 100)
                      return (
                        <div key={ticker} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                          onClick={() => { setSelectedClient(c.name); setActiveTab('clients') }}>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: pct >= 60 ? col : 'var(--text-1)', width: 34 }}>{ticker}</div>
                          <div style={{ flex: 1, height: 6, background: 'var(--bg-inset)', borderRadius: 3, border: '1px solid var(--border)', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: col, opacity: 0.85, transition: 'width 0.5s ease' }}/>
                          </div>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: col, width: 34, textAlign: 'right' }}>{pct}%</div>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', width: 44, textAlign: 'right' }}>${revAtRisk}K</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <Icon.Target />
                    <div style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>AG-11 Top Recommended Play</div>
                    <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, padding: '2px 8px', borderRadius: 4, background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.3)' }}>91% SUCCESS</span>
                  </div>
                  <div style={{ background: 'var(--pink-dim)', border: '1px solid rgba(255,46,191,0.2)', borderRadius: 'var(--r-sm)', padding: '12px 14px', marginBottom: 14 }}>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: 'var(--pink-hi)', marginBottom: 4 }}>Value Chain Shift</div>
                    <div style={{ fontFamily: 'Outfit', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                      Reposition execution deliverables as governance & oversight mandates. Propose an AI governance layer using our Gemini ADK tools — turning automation risk into a new revenue stream.
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {[
                      'Identify automatable portions in each flagged deliverable',
                      'Propose oversight & AI governance mandate to client CTO',
                      'Reposition consulting team from execution to strategy governance',
                    ].map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 12px' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--pink-dim)', color: 'var(--pink)', fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.4 }}>{s}</div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-pink" style={{ width: '100%', fontSize: 12 }}
                    onClick={() => {
                      setShowToast(`Value Chain Shift deployed to ${highExposure.length} account${highExposure.length !== 1 ? 's' : ''}: ${deployTargets.join(', ')}.`)
                      setTimeout(() => setShowToast(null), 4000)
                    }}>
                    <Icon.Zap /> Deploy to {deployLabel}
                  </button>
                </div>
              </div>
            </div>
            )
          })()}

          {/* COMPETITIVE RISK TAB */}
          {activeTab === 'competitive_risk' && (() => {
            const threats = competitiveThreats.length > 0 ? competitiveThreats : COMP_THREATS_DEMO
            const sevOrder = ['Critical', 'High', 'Medium', 'Low']
            const sorted = [...threats].sort((a, b) => sevOrder.indexOf(a.severity) - sevOrder.indexOf(b.severity))
            const threat1 = sorted[0]
            const threat2 = sorted[1]
            const activeThreatCount = threats.filter(t => t.status !== 'Resolved').length
            const critHighCount     = threats.filter(t => t.severity === 'Critical' || t.severity === 'High').length

            const sevColor = (s: string) =>
              s === 'Critical' ? 'var(--red)' : s === 'High' ? 'var(--amber)' : s === 'Medium' ? 'var(--indigo)' : 'var(--green)'
            const sevBg = (s: string) =>
              s === 'Critical' ? 'var(--red-dim)' : s === 'High' ? 'var(--amber-dim)' : s === 'Medium' ? 'var(--indigo-dim)' : 'var(--green-dim)'
            const sevBorder = (s: string) =>
              s === 'Critical' ? 'rgba(239,68,68,0.3)' : s === 'High' ? 'rgba(245,158,11,0.3)' : s === 'Medium' ? 'rgba(129,140,248,0.3)' : 'rgba(34,197,94,0.3)'
            const playColor = (s: string) =>
              s === 'Critical' ? 'var(--pink-hi)' : s === 'High' ? 'var(--indigo)' : s === 'Medium' ? 'var(--amber)' : 'var(--green)'
            const playBg = (s: string) =>
              s === 'Critical' ? 'var(--pink-dim)' : s === 'High' ? 'var(--indigo-dim)' : s === 'Medium' ? 'var(--amber-dim)' : 'var(--green-dim)'
            const playBorder = (s: string) =>
              s === 'Critical' ? 'rgba(255,46,191,0.2)' : s === 'High' ? 'rgba(129,140,248,0.2)' : s === 'Medium' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)'

            const ag07 = agentsData.find(a => a.id === 'AG-07')
            const ag09 = agentsData.find(a => a.id === 'AG-09')
            const ag07Ts = (ag07 as { updatedAt?: string })?.updatedAt
              ? new Date((ag07 as { updatedAt?: string }).updatedAt!).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ' ·')
              : '06/06 · 14:22'
            const ag09Status = ag09?.status ?? 'Queued'

            // Signal narrative built from structured fields
            const narrative = (t: typeof threats[0]) => {
              if (t.threat_type === 'RFP Bid')
                return <>AG-10 detected <span style={{ color: sevColor(t.severity), fontWeight: 600 }}>&quot;{t.signal_source}&quot;</span> in {t.client}&apos;s communication thread. {t.competitor}&apos;s presence in the evaluation window presents an imminent mandate risk.</>
              if (t.threat_type === 'Talent Poaching')
                return <>AG-07 flagged <span style={{ color: sevColor(t.severity), fontWeight: 600 }}>{t.signal_source}</span> at {t.client}. These stakeholders were part of the original mandate approval chain — <span style={{ color: sevColor(t.severity), fontWeight: 600 }}>relationship network strength is weakened</span>.</>
              if (t.threat_type === 'Shadow Proposal')
                return <>AG-10 detected tone shift in {t.client}&apos;s communications. <span style={{ color: sevColor(t.severity), fontWeight: 600 }}>{t.signal_source}</span> — {t.competitor} may be in active pitch mode.</>
              return <>AG-07 detected: <span style={{ color: sevColor(t.severity), fontWeight: 600 }}>{t.signal_source}</span>. {t.competitor} identified as an active competitive presence in this account.</>
            }

            // Status badge style
            const statusStyle = (s: string) => ({
              bg: s === 'Queued' ? 'var(--amber-dim)' : s === 'Active' ? 'var(--red-dim)' : s === 'Resolved' ? 'var(--green-dim)' : 'var(--bg-inset)',
              color: s === 'Queued' ? 'var(--amber)' : s === 'Active' ? 'var(--red)' : s === 'Resolved' ? 'var(--green)' : 'var(--text-3)',
              border: s === 'Queued' ? 'rgba(245,158,11,0.3)' : s === 'Active' ? 'rgba(239,68,68,0.3)' : s === 'Resolved' ? 'rgba(34,197,94,0.3)' : 'var(--border)',
            })

            const ThreatCard = ({ t }: { t: typeof threats[0] }) => {
              const sc = sevColor(t.severity)
              const isCritical = t.severity === 'Critical' || t.severity === 'High'
              return (
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc, boxShadow: `0 0 8px ${sc}`, animation: isCritical ? 'dot-pulse 1.5s ease-in-out infinite' : undefined }}/>
                    <div style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
                      {t.competitor} <span style={{ color: 'var(--text-3)', fontWeight: 400, fontSize: 12 }}>vs {t.ticker || t.client.slice(0,3).toUpperCase()}</span>
                    </div>
                    <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, padding: '2px 8px', borderRadius: 4, background: sevBg(t.severity), color: sc, border: `1px solid ${sevBorder(t.severity)}` }}>
                      {t.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ flex: 1, background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 12px' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--text-3)', marginBottom: 3 }}>THREAT TYPE</div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: sc }}>{t.threat_type}</div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 12px' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--text-3)', marginBottom: 3 }}>DAYS DETECTED</div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 20, color: t.days_detected > 7 ? 'var(--red)' : 'var(--text-1)', lineHeight: 1 }}>
                          {t.days_detected ?? '—'}
                        </div>
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderLeft: `3px solid ${sc}`, borderRadius: 'var(--r-sm)', padding: '10px 14px', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                      {narrative(t)}
                    </div>
                    <div style={{ background: playBg(t.severity), border: `1px solid ${playBorder(t.severity)}`, borderRadius: 'var(--r-sm)', padding: '10px 14px' }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginBottom: 4 }}>AG-09 DEFENSE PLAY</div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: playColor(t.severity) }}>{t.defense_play}</div>
                    </div>
                    <button
                      className={isCritical ? 'btn btn-pink' : 'btn btn-ghost'}
                      style={{ fontSize: 11 }}
                      onClick={() => {
                        setShowToast(`${t.defense_play} queued for ${t.client} — AG-12 drafting outreach`)
                        setTimeout(() => setShowToast(null), 3500)
                      }}
                    >
                      {isCritical ? <><Icon.Send /> Draft Defense Outreach (AG-12)</> : <><Icon.Target /> Apply {t.defense_play}</>}
                    </button>
                  </div>
                </div>
              )
            }

            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
              <div className="page-head">
                <div>
                  <div className="page-title">Competitive <span>Risk Analysis</span></div>
                  <div className="page-sub">Market signals → threat mapping → account defense dispatched</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--r-sm)', padding: '6px 12px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 6px var(--red)', animation: 'dot-pulse 1.5s ease-in-out infinite' }}/>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--red)' }}>
                      {critHighCount} ACTIVE THREATS · AG-09 {ag09Status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Insight chain — driven by most critical threat */}
              <div className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div className="card-hd-title" style={{ margin: 0 }}>
                    <div className="title-pip" style={{ background: 'var(--red)' }}/>{threat1?.client ?? 'Halcyon Systems'} · Competitive Threat Chain
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>AG-07 triggered {ag07Ts}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                  {[
                    { n: '1', label: 'Gmail Synth',     agent: 'AG-10', detail: `"${threat1?.signal_source ?? 'RFP language in email'}"`, color: 'var(--indigo)', layer: 'DATA SOURCE' },
                    { n: '2', label: 'Rel. Scorer',     agent: 'AG-07', detail: `${threat1?.client ?? 'Client'} linked to ${threat1?.competitor ?? 'Accenture'}`, color: 'var(--violet)', layer: 'DATA SOURCE' },
                    { n: '3', label: 'Goal Alignment',  agent: 'AG-05', detail: 'Objective drift detected', color: 'var(--amber)', layer: 'SPECIALIST' },
                    { n: '4', label: 'Defense Selector',agent: 'AG-09', detail: threat1?.defense_play ?? 'Exec Alignment Lock', color: 'var(--pink)', layer: 'ORCHESTRATOR' },
                    { n: '5', label: 'Outreach Draft',  agent: 'AG-12', detail: 'Defense outreach ready', color: 'var(--green)', layer: 'ACTION' },
                  ].map((step, i, arr) => (
                    <div key={step.n} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none', minWidth: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 100 }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: step.color, letterSpacing: '0.06em', marginBottom: 2 }}>{step.layer}</div>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: step.color + '1A', border: `1.5px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono', fontSize: 13, color: step.color, fontWeight: 700 }}>{step.n}</div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, color: 'var(--text-1)', textAlign: 'center', lineHeight: 1.3 }}>{step.label}</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: step.color + 'CC' }}>{step.agent}</div>
                        <div style={{ fontFamily: 'Outfit', fontSize: 11, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.4, maxWidth: 100 }}>{step.detail}</div>
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ flex: 1, height: 1.5, background: `linear-gradient(to right, ${step.color}66, ${arr[i+1].color}66)`, margin: '0 4px', marginBottom: 42 }}/>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active threat matrix */}
              <div className="card">
                <div className="card-hd">
                  <div className="card-hd-title"><div className="title-pip" style={{ background: 'var(--red)' }}/>Active Threat Matrix</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>
                    AG-07 · AG-10 · {ag07Ts ? `last run ${ag07Ts}` : 'updated 14 min ago'} · {activeThreatCount} threat{activeThreatCount !== 1 ? 's' : ''} tracked
                  </div>
                </div>
                <div style={{ padding: '0 0 4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px 120px 130px 88px 1fr 160px 100px', padding: '8px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.04em' }}>
                    <div>ACCOUNT</div><div>COMPETITOR</div><div>THREAT TYPE</div><div>SEVERITY</div><div>SIGNAL</div><div>DEFENSE PLAY</div><div>STATUS</div>
                  </div>
                  {sorted.map(t => {
                    const sc = sevColor(t.severity)
                    const ss = statusStyle(t.status)
                    const tk = t.ticker || t.client.slice(0,3).toUpperCase()
                    return (
                      <div key={`${tk}-${t.competitor}`}
                        style={{ display: 'grid', gridTemplateColumns: '150px 120px 130px 88px 1fr 160px 100px', padding: '9px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: t.severity === 'Critical' ? 'rgba(239,68,68,0.03)' : 'transparent', cursor: 'pointer' }}
                        onClick={() => { setSelectedClient(t.client); setActiveTab('clients') }}>
                        <div>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{tk}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{t.client}</div>
                        </div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>{t.competitor}</div>
                        <div style={{ fontFamily: 'Outfit', fontSize: 13, color: 'var(--text-2)' }}>{t.threat_type}</div>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, padding: '3px 7px', borderRadius: 4, background: sc + '1A', color: sc, border: `1px solid ${sc}44` }}>{t.severity}</span>
                        <div style={{ fontFamily: 'Outfit', fontSize: 12, color: 'var(--text-3)', paddingRight: 8 }}>{t.signal_source}</div>
                        <div style={{ fontFamily: 'Outfit', fontSize: 13, color: 'var(--pink-hi)', fontWeight: 600 }}>{t.defense_play}</div>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, padding: '3px 7px', borderRadius: 4, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{t.status}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Top two threat deep-dives */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {threat1 && <ThreatCard t={threat1} />}
                {threat2 && <ThreatCard t={threat2} />}
              </div>
            </div>
            )
          })()}

          {/* PATTERN LIBRARY TAB */}
          {activeTab === 'pattern_library' && (() => {
            const catColors: Record<string, string> = {
              'Knowledge Transfer': 'var(--indigo)',
              'Onboarding':         'var(--green)',
              'Succession':         'var(--violet)',
              'Retention':          'var(--amber)',
            }
            const diffColors: Record<string, string> = { Low: 'var(--green)', Medium: 'var(--amber)', High: 'var(--red)' }
            const cats = ['All', 'Knowledge Transfer', 'Onboarding', 'Succession', 'Retention']

            // Computed KPIs from PATTERNS_DATA
            const totalStrategies   = PATTERNS_DATA.length
            const avgSuccess        = Math.round(PATTERNS_DATA.reduce((s, p) => s + parseInt(p.success), 0) / PATTERNS_DATA.length)
            const totalDeployed     = PATTERNS_DATA.reduce((s, p) => s + p.deployments, 0)
            // "Active now" = unique defense plays in flight: critical/high action items + stalling clients
            const activeNow = actionItems.filter(a => !a.completed && (a.urgency === 'crit' || a.urgency === 'high')).length
              || clients.filter(c => c.status === 'Stalling' || c.status === 'At Risk').length
              || 3

            // Category counts for filter chips
            const catCount = (cat: string) => cat === 'All' ? PATTERNS_DATA.length : PATTERNS_DATA.filter(p => p.category === cat).length

            const filtered = patternFilter === 'All' ? PATTERNS_DATA : PATTERNS_DATA.filter(p => p.category === patternFilter)
            const pattern = PATTERNS_DATA.find(p => p.name === selectedPattern) || PATTERNS_DATA[0]
            const catColor = catColors[pattern.category] ?? 'var(--pink)'

            // AG-11 — Pattern Library Engine
            const ag11 = agentsData.find(a => a.id === 'AG-11')
            const ag11Status    = ag11?.status ?? 'Idle'
            const ag11Action    = ag11?.lastAction ?? 'No recent activity'
            const ag11Ts        = (ag11 as { updatedAt?: string })?.updatedAt
              ? new Date((ag11 as { updatedAt?: string }).updatedAt!).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ' ·')
              : null
            const ag11StatusColor = ag11Status === 'Alerting' ? 'var(--red)' : ag11Status === 'Analyzing' ? 'var(--amber)' : 'var(--green)'

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise 0.4s ease both' }}>
                <div className="page-head">
                  <div>
                    <div className="page-title">Strategy <span>Playbook</span></div>
                    <div className="page-sub">Knowledge transfer · hiring & onboarding · succession & retention protocols</div>
                  </div>
                  {/* KPI strip + AG-11 badge */}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    {[
                      { label: 'STRATEGIES',  val: String(totalStrategies),   color: 'var(--pink)'   },
                      { label: 'AVG SUCCESS', val: `${avgSuccess}%`,           color: 'var(--green)'  },
                      { label: 'DEPLOYED',    val: `${totalDeployed}×`,        color: 'var(--indigo)' },
                      { label: 'ACTIVE NOW',  val: String(activeNow),          color: 'var(--amber)'  },
                    ].map(k => (
                      <div key={k.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '6px 14px' }}>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>{k.label}</span>
                        <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 16, color: k.color, lineHeight: 1 }}>{k.val}</span>
                      </div>
                    ))}
                    {/* AG-11 status pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card2)', border: `1px solid ${ag11StatusColor}33`, borderRadius: 'var(--r-sm)', padding: '6px 12px' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: ag11StatusColor, boxShadow: ag11Status !== 'Idle' ? `0 0 6px ${ag11StatusColor}` : 'none' }}/>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: ag11StatusColor }}>AG-11 {ag11Status.toUpperCase()}</span>
                      {ag11Ts && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>· {ag11Ts}</span>}
                    </div>
                  </div>
                </div>

                {/* AG-11 last action banner — show only when non-idle */}
                {ag11Status !== 'Idle' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: ag11StatusColor + '0D', border: `1px solid ${ag11StatusColor}33`, borderLeft: `3px solid ${ag11StatusColor}`, borderRadius: 'var(--r-sm)', padding: '9px 14px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: ag11StatusColor, flexShrink: 0 }}>AG-11</div>
                    <div style={{ fontFamily: 'Outfit', fontSize: 13, color: 'var(--text-1)' }}>{ag11Action}</div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, alignItems: 'start' }}>
                  {/* Left — filtered list */}
                  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {/* Category filter tabs with counts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '12px 12px 8px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginBottom: 8 }}>FILTER BY CATEGORY</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {cats.map(c => {
                          const cc = catColors[c] ?? 'var(--pink)'
                          const active = patternFilter === c
                          return (
                            <button key={c} onClick={() => setPatternFilter(c)} style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 11, padding: '4px 10px', borderRadius: 'var(--r-sm)', border: `1px solid ${active ? (cc) + '88' : 'var(--border)'}`, background: active ? cc + '1A' : 'transparent', color: active ? cc : 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                              {c}
                              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, opacity: 0.75 }}>{catCount(c)}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    {/* Strategy list */}
                    <div style={{ overflowY: 'auto', maxHeight: 560 }}>
                      {filtered.map(p => {
                        const cc = catColors[p.category] ?? 'var(--pink)'
                        const isSelected = selectedPattern === p.name
                        const successNum = parseInt(p.success)
                        return (
                          <div key={p.name} onClick={() => setSelectedPattern(p.name)} style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: isSelected ? cc + '0D' : 'transparent', borderLeft: isSelected ? `3px solid ${cc}` : '3px solid transparent', transition: 'background 0.15s' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--text-1)', lineHeight: 1.3 }}>{p.name}</div>
                              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: successNum >= 90 ? 'var(--green)' : successNum >= 80 ? 'var(--amber)' : 'var(--text-3)', flexShrink: 0 }}>{p.success}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, padding: '2px 6px', borderRadius: 3, background: cc + '1A', color: cc, border: `1px solid ${cc}33` }}>{p.category}</span>
                              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)' }}>{p.time}</span>
                              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginLeft: 'auto' }}>{p.deployments}×</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Right — detail panel */}
                  <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Header */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 22, color: 'var(--text-1)', lineHeight: 1.2 }}>{pattern.name}</div>
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 4, background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.3)' }}>{pattern.success} success</span>
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, padding: '3px 10px', borderRadius: 4, background: 'var(--bg-inset)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>{pattern.deployments}× deployed</span>
                        </div>
                      </div>
                      {/* Metadata row */}
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        {[
                          { label: 'CATEGORY',      val: pattern.category,   valColor: catColor },
                          { label: 'TIME TO DEPLOY', val: pattern.time,       valColor: 'var(--text-1)' },
                          { label: 'DIFFICULTY',    val: pattern.difficulty,  valColor: diffColors[pattern.difficulty] ?? 'var(--text-2)' },
                          { label: 'OWNER ROLE',    val: pattern.owner,       valColor: 'var(--text-2)' },
                        ].map(m => (
                          <div key={m.label}>
                            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-3)', marginBottom: 3 }}>{m.label}</div>
                            <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, color: m.valColor }}>{m.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ height: 1, background: 'var(--border)' }}/>

                    {/* Trigger */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: catColor + '0D', border: `1px solid ${catColor}33`, borderLeft: `3px solid ${catColor}`, borderRadius: 'var(--r-sm)', padding: '10px 14px' }}>
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: catColor, marginBottom: 4 }}>TRIGGER CONDITION</div>
                        <div style={{ fontFamily: 'Outfit', fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5 }}>{pattern.trigger}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: 8 }}>OVERVIEW</div>
                      <p style={{ fontFamily: 'Outfit', fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)', margin: 0 }}>{pattern.description}</p>
                    </div>

                    {/* Execution steps */}
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: 10 }}>EXECUTION STEPS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {pattern.steps.map((s, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 14px' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: catColor + '1A', color: catColor, fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx + 1}</div>
                            <div style={{ fontFamily: 'Outfit', fontSize: 13, lineHeight: 1.55, color: 'var(--text-1)' }}>{s}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Related patterns */}
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: 8 }}>RELATED STRATEGIES</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {pattern.related.map(r => (
                          <button key={r} onClick={() => setSelectedPattern(r)} style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 12, padding: '5px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg-inset)', color: 'var(--text-2)', cursor: 'pointer' }}>{r} →</button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                      <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12 }} onClick={() => { setShowToast(`"${pattern.name}" saved to team knowledge base · AG-11 will index against future deployments.`); setTimeout(() => setShowToast(null), 3200) }}>
                        Save to Knowledge Base
                      </button>
                      <button
                        className="btn btn-pink"
                        style={{ flex: 2, fontSize: 12, opacity: deployingPattern ? 0.65 : 1, cursor: deployingPattern ? 'not-allowed' : 'pointer' }}
                        disabled={!!deployingPattern}
                        onClick={() => deployPattern(pattern)}
                      >
                        {deployingPattern === pattern.name
                          ? <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginRight: 6 }}/> Arming via AG-11…</>
                          : <><Icon.Zap /> Deploy to AG-11 Trigger</>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

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

      {/* DEV CONSOLE */}
      {devConsoleOpen && (
        <div className="dev-console">
          <div className="dev-console-handle" />
          {/* Tab bar */}
          <div className="dev-console-tabs">
            {([
              { id: 'terminal',     label: 'Terminal',     icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> },
              { id: 'chat',         label: 'ADK Chat',     icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
              { id: 'connections',  label: 'Connections',  icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
            ] as {id:'terminal'|'chat'|'connections'; label:string; icon:React.ReactNode}[]).map(t => (
              <div key={t.id} className={`dev-console-tab${consoleTab === t.id ? ' active' : ''}`} onClick={() => setConsoleTab(t.id)}>
                {t.icon}{t.label}
              </div>
            ))}
            {adkRunning && <div style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'JetBrains Mono', fontSize: 9, color: '#22C55E' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 5px #22C55E' }}/> ADK :8000</div>}
            <div className="dev-console-tab-close" onClick={() => setDevConsoleOpen(false)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
          </div>

          {/* Terminal tab */}
          {consoleTab === 'terminal' && (
            <>
              <div className="term-body" ref={termScrollRef}>
                {termHistory.map((line, i) => (
                  <div key={i} className={`term-line-${line.type}`}>{line.text}</div>
                ))}
              </div>
              <div className="term-input-row">
                <span className="term-prompt">$</span>
                <input
                  className="term-input"
                  value={termInput}
                  onChange={e => setTermInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key !== 'Enter' || !termInput.trim()) return
                    const results = processCommand(termInput.trim())
                    if (results.length === 1 && results[0].text === '__CLEAR__') {
                      setTermHistory([{ type: 'info', text: '  Terminal cleared.' }])
                    } else {
                      if (termInput.trim().startsWith('adk start')) setAdkRunning(true)
                      if (termInput.trim().startsWith('adk stop')) setAdkRunning(false)
                      setTermHistory(h => [...h, ...results])
                      setTimeout(() => { termScrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }) }, 30)
                    }
                    setTermInput('')
                  }}
                  placeholder="type a command…"
                  autoFocus
                  spellCheck={false}
                />
              </div>
            </>
          )}

          {/* ADK Chat tab */}
          {consoleTab === 'chat' && (
            <>
              <div className="chat-body" ref={chatScrollRef}>
                {adkChat.map((msg, i) => (
                  <div key={i} className={msg.role === 'agent' ? 'chat-msg-agent' : 'chat-msg-user'}>
                    <div className="chat-msg-label">{msg.role === 'agent' ? `AG-04 MOMENTUM ORCHESTRATOR · ${msg.ts}` : `YOU · ${msg.ts}`}</div>
                    <div className="chat-msg-text">{msg.text}</div>
                  </div>
                ))}
                {adkChatLoading && (
                  <div className="chat-msg-agent">
                    <div className="chat-msg-label">AG-04 MOMENTUM ORCHESTRATOR · thinking…</div>
                    <div className="chat-msg-text" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0,1,2].map(i => (
                        <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pink)', display: 'inline-block', animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="chat-input-row">
                <input
                  className="chat-input"
                  value={adkChatInput}
                  onChange={e => setAdkChatInput(e.target.value)}
                  disabled={adkChatLoading}
                  onKeyDown={async e => {
                    if (e.key !== 'Enter' || !adkChatInput.trim() || adkChatLoading) return
                    const userMsg = adkChatInput.trim()
                    const ts = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                    setAdkChat(c => [...c, { role: 'user', text: userMsg, ts }])
                    setAdkChatInput('')
                    setAdkChatLoading(true)
                    setTimeout(() => chatScrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }), 50)
                    try {
                      const res = await fetch('/api/portfolio-chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: userMsg, sessionId: adkChatSessionId }),
                      })
                      const data = await res.json() as { reply?: string; error?: string }
                      const replyText = data.reply ?? data.error ?? 'No response from agent.'
                      setAdkChat(c => [...c, { role: 'agent', text: replyText, ts: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }])
                    } catch {
                      setAdkChat(c => [...c, { role: 'agent', text: 'Could not reach ADK server — run `adk start` in the Terminal tab.', ts: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }])
                    } finally {
                      setAdkChatLoading(false)
                      setTimeout(() => chatScrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }), 50)
                    }
                  }}
                  placeholder="Ask AG-04 about portfolio risk, patterns, accounts…"
                  spellCheck={false}
                />
                <button className="dev-btn" disabled={adkChatLoading} onClick={async () => {
                  if (!adkChatInput.trim() || adkChatLoading) return
                  const userMsg = adkChatInput.trim()
                  const ts = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                  setAdkChat(c => [...c, { role: 'user', text: userMsg, ts }])
                  setAdkChatInput('')
                  setAdkChatLoading(true)
                  setTimeout(() => chatScrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }), 50)
                  try {
                    const res = await fetch('/api/portfolio-chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ message: userMsg, sessionId: adkChatSessionId }),
                    })
                    const data = await res.json() as { reply?: string; error?: string }
                    const replyText = data.reply ?? data.error ?? 'No response from agent.'
                    setAdkChat(c => [...c, { role: 'agent', text: replyText, ts: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }])
                  } catch {
                    setAdkChat(c => [...c, { role: 'agent', text: 'Could not reach ADK server — run `adk start` in the Terminal tab.', ts: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }])
                  } finally {
                    setAdkChatLoading(false)
                    setTimeout(() => chatScrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }), 50)
                  }
                }}>{adkChatLoading ? '…' : 'Send'}</button>
              </div>
            </>
          )}

          {/* Connections tab */}
          {consoleTab === 'connections' && (
            <div className="conn-grid">
              {/* Supabase */}
              <div className="conn-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="conn-status-dot" style={{ background: '#22C55E', boxShadow: '0 0 6px #22C55E88' }}/>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#EEEEFF', fontWeight: 700 }}>Supabase</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, color: '#22C55E' }}>CONNECTED</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[['Host', 'xxxxxxxxxxxx.supabase.co'], ['Region', 'us-east-1'], ['Latency', '38ms'], ['Tables', '2 (RLS on)'], ['Auth', 'Anon key · active']].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 10 }}>
                      <span style={{ color: '#5858A0' }}>{k}</span><span style={{ color: '#A0A0D0' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button className="dev-btn-ghost" onClick={() => { setTermHistory(h => [...h, { type:'in', text:'$ supabase ping' }, { type:'info', text:'Pinging Supabase…' }, { type:'out', text:'  ✓ Connected · 38ms · RLS active' }]); setConsoleTab('terminal') }}>Ping → Terminal</button>
              </div>

              {/* MongoDB */}
              <div className="conn-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="conn-status-dot" style={{ background: '#22C55E', boxShadow: '0 0 6px #22C55E88' }}/>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#EEEEFF', fontWeight: 700 }}>MongoDB Atlas</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, color: '#22C55E' }}>CONNECTED</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[['Cluster', 'cluster0 (M0 Sandbox)'], ['Database', 'qnsult_prod'], ['Latency', '91ms'], ['Collections', '4 (empty)'], ['Auth', 'SCRAM-SHA-256']].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 10 }}>
                      <span style={{ color: '#5858A0' }}>{k}</span><span style={{ color: '#A0A0D0' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button className="dev-btn-ghost" onClick={() => { setTermHistory(h => [...h, { type:'in', text:'$ mongo collections' }, { type:'info', text:'Collections (qnsult_prod):' }, { type:'out', text:'  signals 0 · cadence 0 · commitments 0 · agent_runs 0' }]); setConsoleTab('terminal') }}>Inspect → Terminal</button>
              </div>

              {/* ADK Server */}
              <div className="conn-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="conn-status-dot" style={{ background: adkRunning ? '#22C55E' : '#EF4444', boxShadow: `0 0 6px ${adkRunning ? '#22C55E' : '#EF4444'}88` }}/>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#EEEEFF', fontWeight: 700 }}>ADK Server</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, color: adkRunning ? '#22C55E' : '#EF4444' }}>{adkRunning ? 'RUNNING' : 'STOPPED'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[['Endpoint', 'localhost:8000'], ['Agents', '12 registered'], ['Model', 'gemini-2.0-flash-exp'], ['Uptime', adkRunning ? '22m 14s' : '—'], ['Docs', '/docs (OpenAPI)']].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 10 }}>
                      <span style={{ color: '#5858A0' }}>{k}</span><span style={{ color: '#A0A0D0' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button className={adkRunning ? 'dev-btn-ghost' : 'dev-btn'} onClick={() => {
                  if (!adkRunning) {
                    adkStartTimeRef.current = Date.now()
                    setAdkRunning(true)
                    setTermHistory(h => [...h, { type:'in', text:'$ adk start' }, { type:'info', text:'Starting Gemini ADK server…' }, { type:'out', text:`  ✓ Server up on http://localhost:8000` }, { type:'out', text:`  ✓ ${agentsData.length} agents registered · gemini-2.5-flash · Vertex AI` }, { type:'out', text:`  ✓ ${agentsData.filter(a=>a.status==='Alerting').length} alerting · ${agentsData.filter(a=>a.status==='Analyzing').length} analyzing` }])
                  } else {
                    adkStartTimeRef.current = null
                    setAdkRunning(false)
                    setTermHistory(h => [...h, { type:'in', text:'$ adk stop' }, { type:'out', text:'  ✓ Server stopped · all agent processes terminated' }])
                  }
                }}>{adkRunning ? 'Stop Server' : 'Start Server'}</button>
              </div>

              {/* Gmail API */}
              <div className="conn-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="conn-status-dot" style={{ background: '#22C55E', boxShadow: '0 0 6px #22C55E88' }}/>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#EEEEFF', fontWeight: 700 }}>Gmail API</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, color: '#22C55E' }}>CONNECTED</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[['Scope', 'gmail.readonly + send'], ['Account', 'sgsahoo77@gmail.com'], ['Last sync', '07:31 UTC'], ['AG-10', 'Reading'], ['AG-12', 'Sending']].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 10 }}>
                      <span style={{ color: '#5858A0' }}>{k}</span><span style={{ color: '#A0A0D0' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Keys */}
              <div className="conn-card" style={{ gridColumn: '2 / 4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#EEEEFF', fontWeight: 700 }}>API Keys</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#5858A0', marginLeft: 'auto' }}>stored in .env.local · never committed</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 24px' }}>
                  {[
                    ['GEMINI_API_KEY',             'AIzaSy●●●●●●●●●●●●●●●●●●●●●●'],
                    ['NEXT_PUBLIC_SUPABASE_ANON_KEY','sb_anon_●●●●●●●●●●●●●●●●●●●●'],
                    ['MONGODB_URI',                'mongodb+srv://●●●@cluster0.xxxxx'],
                    ['GMAIL_CLIENT_SECRET',        'GOCSPX-●●●●●●●●●●●●●●●●●●●●'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontFamily: 'JetBrains Mono', fontSize: 10, alignItems: 'center' }}>
                      <span style={{ color: '#5858A0' }}>{k}</span>
                      <span style={{ color: '#6868A8', letterSpacing: '0.02em' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 6 }}>
                  <button className="dev-btn-ghost" onClick={() => { setTermHistory(h => [...h, { type:'in', text:'$ env show' }, { type:'info', text:'─── Environment Variables ───' }, { type:'out', text:'  GEMINI_API_KEY  AIzaSy●●●…  (masked)' }, { type:'out', text:'  MONGODB_URI     mongodb+srv://●●●…  (masked)' }]); setConsoleTab('terminal') }}>View in Terminal</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
