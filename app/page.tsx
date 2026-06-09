'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useRef, useState } from 'react'

const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
].join(' ')

export default function LandingPage() {
  const supabase = createClient()
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [chartVisible, setChartVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [escapeVisible, setEscapeVisible] = useState(false)
  const [workflowVisible, setWorkflowVisible] = useState(false)
  const [journeyVisible, setJourneyVisible] = useState(false)
  const [activeAgent, setActiveAgent] = useState<number | null>(null)
  const [counters, setCounters] = useState({ weeks: 0, ltv: 0, agents: 0 })
  const chartRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const escapeRef = useRef<HTMLDivElement>(null)
  const workflowRef = useRef<HTMLDivElement>(null)
  const journeyRef = useRef<HTMLDivElement>(null)

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: GMAIL_SCOPES,
        queryParams: { access_type: 'offline', prompt: 'select_account' },
      },
    })
  }

  useEffect(() => {
    const refs = [
      { ref: chartRef, setter: () => setChartVisible(true), threshold: 0.3 },
      { ref: statsRef, setter: () => setStatsVisible(true), threshold: 0.5 },
      { ref: escapeRef, setter: () => setEscapeVisible(true), threshold: 0.2 },
      { ref: workflowRef, setter: () => setWorkflowVisible(true), threshold: 0.25 },
      { ref: journeyRef,  setter: () => setJourneyVisible(true),  threshold: 0.15 },
    ]
    const observers = refs.map(({ ref, setter, threshold }) => {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setter() }, { threshold })
      if (ref.current) obs.observe(ref.current)
      return obs
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  useEffect(() => {
    if (!statsVisible) return
    const duration = 1800
    const start = Date.now()
    function tick() {
      const p = Math.min((Date.now() - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setCounters({ weeks: Math.round(ease * 6), ltv: Math.round(ease * 50) / 10, agents: Math.round(ease * 12) })
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [statsVisible])

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 6000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-wrap">

        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
        <div className="scan-line" />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} className="particle" style={{ left: p.x, top: p.y, animationDelay: p.delay, animationDuration: p.dur, width: p.size, height: p.size }} />
        ))}

        {/* NAV */}
        <nav className="l-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <img src="/logo.svg" alt="Qnsult" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
            <div className="l-brand">Qn<em>sult</em></div>
            <div className="l-brand-tag">Gemini · ADK</div>
          </div>
          <div className="l-nav-right">
            <button className="l-btn-ghost">How it works</button>
            <button className="l-btn-wave" onClick={signInWithGoogle}>Sign in with Google</button>
          </div>
        </nav>

        {/* WALL QUOTE OPENER */}
        <div className="wqb">
          {/* Chess king — background accent beside quote */}
          <div className="wqb-chess-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landing_page_5.jpg" alt="" className="wqb-chess-img" />
          </div>
          <div className="wqb-inner">
            <div className="wqb-rule" data-reveal="fade" />
            <div className="wqb-eyebrow" data-reveal="left" style={{ transitionDelay: '0.1s' }}>Industry Reality Check</div>
            <blockquote className="wqb-quote" data-reveal="up" style={{ transitionDelay: '0.2s' }}>
              &ldquo;The most expensive project is the one that ends on time<br />
              — and leaves nothing behind.&rdquo;
            </blockquote>
            <div className="wqb-stats">
              <div className="wqb-stat" data-reveal="left" style={{ transitionDelay: '0.3s' }}>
                <span className="wqb-num">68%</span>
                <span className="wqb-label">of churned consulting clients described their last project as &ldquo;satisfactory&rdquo;</span>
              </div>
              <div className="wqb-vr" />
              <div className="wqb-stat" data-reveal="up" style={{ transitionDelay: '0.4s' }}>
                <span className="wqb-num">$2.4M</span>
                <span className="wqb-label">average ACV lost per wall-trapped account over a 3-year window</span>
              </div>
              <div className="wqb-vr" />
              <div className="wqb-stat" data-reveal="right" style={{ transitionDelay: '0.5s' }}>
                <span className="wqb-num">83%</span>
                <span className="wqb-label">of project stalls are detectable 4–6 weeks before the client goes quiet</span>
              </div>
            </div>
            <div className="wqb-rule" data-reveal="fade" style={{ transitionDelay: '0.6s' }} />
          </div>
        </div>

        {/* HERO — eyebrow + giant brand only */}
        <section className="hero">
          <div className="hero-eyebrow">
            <div className="hero-dot" />
            12 agents · live now · Google Cloud ADK
          </div>

          <div className="hero-giant-wrap">
            <div className="hgw-chip hgw-chip-tl">
              <div className="hgw-dot hgw-dot-green" />
              AG-03 · stall scan active
            </div>
            <div className="hgw-chip hgw-chip-tr">
              <div className="hgw-dot hgw-dot-amber" />
              AG-04 · exec gap flagged
            </div>
            <div className="hero-brand-giant">Qn<em>sult</em></div>
            <div className="hgw-chip hgw-chip-bl">
              <div className="hgw-dot hgw-dot-violet" />
              AG-01 · value chain mapped
            </div>
            <div className="hgw-chip hgw-chip-br">
              <div className="hgw-dot hgw-dot-pink" />
              AG-12 · momentum scoring
            </div>
            <div className="hgw-ring hgw-ring-1" />
            <div className="hgw-ring hgw-ring-2" />
          </div>
        </section>

        {/* JOURNEY — animated project lifecycle → wall → agent detection → revelation */}
        <div className={`jrn-section ${journeyVisible ? 'jrn-go' : ''}`} ref={journeyRef}>

          {/* Eyebrow label */}
          <div className="jrn-eyebrow">The consulting journey · without Qnsult</div>

          {/* Timeline SVG */}
          <div className="platform-frame pf-section-frame">
            <div className="platform-frame-top">
              <div className="pf-dot" style={{background:'var(--red)'}}/>
              <div className="pf-dot" style={{background:'var(--amber)'}}/>
              <div className="pf-dot" style={{background:'var(--green)'}}/>
              <span className="pf-url">qnsult · project journey · stall trajectory model</span>
            </div>
            <div className="pf-content">
          <div className="jrn-svg-wrap">
            <svg viewBox="0 0 920 210" className="jrn-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="jg-ok" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="#9B30D9" stopOpacity="0.9"/>
                </linearGradient>
                <linearGradient id="jg-qnsult" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF2EBF" stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="#9B30D9" stopOpacity="0.9"/>
                </linearGradient>
                <filter id="jg-glow">
                  <feGaussianBlur stdDeviation="2.5" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="jg-glow-lg">
                  <feGaussianBlur stdDeviation="5" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <marker id="jg-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                  <polygon points="0 0, 7 2.5, 0 5" fill="rgba(255,46,191,0.7)"/>
                </marker>
              </defs>

              {/* ── Background track ── */}
              <line x1="20" y1="105" x2="900" y2="105" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>

              {/* ── Animated progress line (pre-wall) ── */}
              <line className="jrn-pline" x1="20" y1="105" x2="598" y2="105"
                stroke="url(#jg-ok)" strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray="600" />

              {/* ── STAGE NODES (5 pre-wall) ── */}
              {JOURNEY_STAGES.map((s, i) => {
                const above = i % 2 === 0
                const ly = above ? 76 : 140
                const sy = above ? 63 : 154
                const cy1 = above ? 96 : 114
                const cy2 = above ? 82 : 128
                return (
                  <g key={i} className={`jrn-s jrn-s${i}`}>
                    <line x1={s.cx} y1={cy1} x2={s.cx} y2={cy2} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                    <circle cx={s.cx} cy={105} r="8" fill={s.fill} filter="url(#jg-glow)"/>
                    <circle cx={s.cx} cy={105} r="3.5" fill="white" opacity="0.9"/>
                    <text x={s.cx} y={ly} textAnchor="middle" fill={s.textFill} fontSize="9.5" fontFamily="JetBrains Mono" fontWeight="600">{s.label}</text>
                    <text x={s.cx} y={sy} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7.5" fontFamily="JetBrains Mono">{s.sub}</text>
                  </g>
                )
              })}

              {/* ── AGENT DETECTION (fires at Delivery stage, cx=548) ── */}
              <g className="jrn-detect">
                {/* Pulsing rings around delivery node */}
                <circle cx="548" cy="105" r="14" fill="none" stroke="rgba(255,46,191,0.5)" strokeWidth="1.5" filter="url(#jg-glow)">
                  <animate attributeName="r" values="14;28;14" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="548" cy="105" r="14" fill="none" stroke="rgba(255,46,191,0.25)" strokeWidth="1">
                  <animate attributeName="r" values="14;40;14" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                </circle>
                {/* Detection chip (above) */}
                <rect x="490" y="52" width="116" height="26" rx="13" fill="rgba(255,46,191,0.08)" stroke="rgba(255,46,191,0.5)" strokeWidth="1"/>
                <text x="548" y="69" textAnchor="middle" fill="#FF2EBF" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="700">• AG-03 · DETECTS</text>
                {/* Connector from chip to node */}
                <line x1="548" y1="79" x2="548" y2="97" stroke="rgba(255,46,191,0.3)" strokeWidth="1" strokeDasharray="3 2"/>
                {/* 6wk window arrow pointing to wall */}
                <line x1="558" y1="105" x2="594" y2="105" stroke="rgba(255,46,191,0.5)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#jg-arrow)"/>
                <text x="574" y="120" textAnchor="middle" fill="rgba(255,46,191,0.65)" fontSize="8" fontFamily="JetBrains Mono">6 wks</text>
              </g>

              {/* ── THE WALL ── */}
              <g className="jrn-wall-g">
                {/* Glow behind wall */}
                <rect x="594" y="25" width="22" height="160" rx="3" fill="rgba(239,68,68,0.08)"/>
                {/* Wall body */}
                <rect x="598" y="30" width="14" height="150" rx="2" fill="rgba(239,68,68,0.35)" stroke="rgba(239,68,68,0.7)" strokeWidth="1"/>
                {/* Cracks / hash marks */}
                <line x1="601" y1="55" x2="609" y2="70" stroke="rgba(239,68,68,0.5)" strokeWidth="1"/>
                <line x1="601" y1="85" x2="609" y2="100" stroke="rgba(239,68,68,0.5)" strokeWidth="1"/>
                <line x1="601" y1="115" x2="609" y2="130" stroke="rgba(239,68,68,0.5)" strokeWidth="1"/>
                {/* Wall label */}
                <text x="605" y="20" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="700">× THE WALL</text>
              </g>

              {/* ── POST-WALL: QNSULT RECOVERY PATH ── */}
              <g className="jrn-post-g">
                {/* Dim "without Qnsult" straight line */}
                <line x1="614" y1="105" x2="900" y2="105" stroke="rgba(239,68,68,0.12)" strokeWidth="1.5" strokeDasharray="6 4"/>
                <text x="748" y="168" textAnchor="middle" fill="rgba(239,68,68,0.25)" fontSize="8" fontFamily="JetBrains Mono">without Qnsult → silence → client lost</text>

                {/* Qnsult arc OVER the wall */}
                <path className="jrn-arc" d="M 614,105 C 655,40 730,40 780,105 L 890,105"
                  fill="none" stroke="url(#jg-qnsult)" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="400"/>

                {/* Arc label */}
                <text x="748" y="52" textAnchor="middle" fill="rgba(255,46,191,0.75)" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="600">Qnsult path ↗</text>

                {/* Recovery node */}
                <circle cx="780" cy="105" r="10" fill="rgba(255,46,191,0.12)" stroke="rgba(255,46,191,0.6)" strokeWidth="1.5" filter="url(#jg-glow)"/>
                <circle cx="780" cy="105" r="4" fill="#FF2EBF" opacity="0.9"/>
                <text x="780" y="83" textAnchor="middle" fill="rgba(255,46,191,0.85)" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="600">Recovery</text>
                <text x="780" y="71" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="JetBrains Mono">outreach sent</text>

                {/* Dashboard node */}
                <circle cx="880" cy="105" r="11" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" filter="url(#jg-glow-lg)"/>
                <circle cx="880" cy="105" r="4.5" fill="#22C55E" opacity="0.9"/>
                <circle cx="880" cy="105" r="11" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="1">
                  <animate attributeName="r" values="11;22;11" dur="2.4s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite"/>
                </circle>
                <text x="880" y="83" textAnchor="middle" fill="rgba(34,197,94,0.9)" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="600">Dashboard</text>
                <text x="880" y="71" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="JetBrains Mono">next mandate live</text>
              </g>

              {/* Timeline axis labels */}
              <text x="20" y="175" fill="rgba(255,255,255,0.18)" fontSize="8" fontFamily="JetBrains Mono">Week 0</text>
              <text x="548" y="195" textAnchor="middle" fill="rgba(245,158,11,0.4)" fontSize="8" fontFamily="JetBrains Mono">Week ~16</text>
              <text x="605" y="195" textAnchor="middle" fill="rgba(239,68,68,0.4)" fontSize="8" fontFamily="JetBrains Mono">Wk 22</text>
              <text x="880" y="130" textAnchor="middle" fill="rgba(34,197,94,0.5)" fontSize="8" fontFamily="JetBrains Mono">Week 26+</text>
            </svg>
          </div>
            </div>
          </div>

          {/* REVELATION — appears after journey plays */}
          <div className="jrn-reveal">
            <h1 className="hero-h1">
              Every project wall is visible<br />
              <em>six weeks before</em><br />
              the client goes quiet.
            </h1>
            <p className="hero-sub">
              Qnsult is a 12-agent intelligence system built on Google Cloud ADK that turns stall detection,
              executive relationship scoring, and value chain positioning into a continuous, always-on
              discipline — not a quarterly fire drill.
            </p>
            <div className="hero-cta">
              <button className="hero-btn-primary" onClick={signInWithGoogle}>
                <GoogleIcon />
                Connect Google Workspace
              </button>
              <button className="hero-btn-secondary">View dashboard demo</button>
            </div>
            <p className="hero-note">Connects Gmail · Reads client signals · Never posts without approval</p>
            <div className="hero-signals">
              {SIGNALS.map((s, i) => (
                <div key={i} className="signal-chip" style={{ animationDelay: `${i * 0.5}s` }}>
                  <div className={`sdot sdot-${s.type}`} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PLATFORM VISUAL — landing_page_2 */}
        <div className="platform-visual" data-reveal="up">
          <div className="platform-frame">
            <div className="platform-frame-top">
              <div className="pf-dot" style={{ background: 'var(--red)' }} />
              <div className="pf-dot" style={{ background: 'var(--amber)' }} />
              <div className="pf-dot" style={{ background: 'var(--green)' }} />
              <span className="pf-url">qnsult · intelligence platform · 12 agents active</span>
            </div>
            <div className="platform-img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/landing_page_2.jpg" alt="Qnsult Intelligence Platform" className="platform-img" />
              <div className="platform-img-overlay" />
              <div className="platform-badge platform-badge-tl">
                <div className="pb-dot" />
                <span>12 agents running</span>
              </div>
              <div className="platform-badge platform-badge-tr">
                <div className="pb-dot pb-dot-violet" />
                <span>Gemini 2.0 Flash</span>
              </div>
            </div>
          </div>
        </div>

        {/* ANIMATED STATS */}
        <div className="stats-wrap" ref={statsRef}>
          <div className="stats-bar">
            <div className="stat-cell" data-reveal="left" style={{ transitionDelay: '0s' }}>
              <div className="stat-num">{counters.weeks}wk</div>
              <div className="stat-label">Stall Detection Lead Time</div>
              <div className="stat-sub">Before client goes quiet</div>
            </div>
            <div className="stat-cell" data-reveal="up" style={{ transitionDelay: '0.15s' }}>
              <div className="stat-num">{counters.ltv}×</div>
              <div className="stat-label">Higher LTV</div>
              <div className="stat-sub">Strategic vs. transactional accounts</div>
            </div>
            <div className="stat-cell" data-reveal="right" style={{ transitionDelay: '0.3s' }}>
              <div className="stat-num">{counters.agents}</div>
              <div className="stat-label">Agents Running Continuously</div>
              <div className="stat-sub">Across every client account</div>
            </div>
          </div>
        </div>

        <div className="l-divider" />

        {/* AGENTIC WORKFLOW */}
        <section className="l-section" ref={workflowRef}>
          <div className="section-label" data-reveal="left">The Intelligence Network</div>
          <h2 className="section-h2" data-reveal="left" style={{ transitionDelay: '0.1s' }}>12 agents. Continuously <em>connected</em>.</h2>
          <p className="section-sub" data-reveal="left" style={{ transitionDelay: '0.2s' }}>Every signal flows from your data through specialist agents to the Momentum orchestrator — continuously, in real time, across every client account.</p>
          <div className="platform-frame pf-section-frame" data-reveal="up" style={{ transitionDelay: '0.3s' }}>
            <div className="platform-frame-top">
              <div className="pf-dot" style={{background:'var(--red)'}}/>
              <div className="pf-dot" style={{background:'var(--amber)'}}/>
              <div className="pf-dot" style={{background:'var(--green)'}}/>
              <span className="pf-url">qnsult · intelligence network · 12 agents active</span>
            </div>
            <div className="pf-content">
          <div className={`workflow-scene ${workflowVisible ? 'wf-visible' : ''}`}>
            {/* Logo watermark inside diagram */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" aria-hidden="true" className="wf-logo-wm" />
            <svg viewBox="0 0 740 260" className="workflow-svg" xmlns="http://www.w3.org/2000/svg">
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

              {/* ---- PATHS (connections) ---- */}
              {/* Input → Specialist */}
              <path id="p-g-st" d="M 92 62 C 155 62 165 58 218 58" fill="none" stroke="rgba(255,46,191,0.22)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <path id="p-g-vc" d="M 92 68 C 155 68 165 112 218 112" fill="none" stroke="rgba(155,48,217,0.22)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <path id="p-cal-vc" d="M 92 130 L 218 130" fill="none" stroke="rgba(255,46,191,0.22)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <path id="p-cal-rel" d="M 92 136 C 155 136 165 184 218 184" fill="none" stroke="rgba(155,48,217,0.22)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <path id="p-meet-rel" d="M 92 198 L 218 198" fill="none" stroke="rgba(255,46,191,0.22)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <path id="p-meet-ga" d="M 92 204 C 155 204 165 242 218 242" fill="none" stroke="rgba(155,48,217,0.22)" strokeWidth="1.5" strokeDasharray="5 4"/>

              {/* Specialist → Orchestrator */}
              <path id="p-st-m" d="M 266 55 C 355 55 380 128 458 128" fill="none" stroke="rgba(255,46,191,0.3)" strokeWidth="1.8" strokeDasharray="5 4"/>
              <path id="p-vc-m" d="M 266 120 C 355 120 380 130 458 130" fill="none" stroke="rgba(155,48,217,0.3)" strokeWidth="1.8" strokeDasharray="5 4"/>
              <path id="p-rel-m" d="M 266 190 C 355 190 380 132 458 132" fill="none" stroke="rgba(255,46,191,0.3)" strokeWidth="1.8" strokeDasharray="5 4"/>
              <path id="p-ga-m" d="M 266 238 C 355 238 380 136 458 136" fill="none" stroke="rgba(155,48,217,0.3)" strokeWidth="1.8" strokeDasharray="5 4"/>

              {/* Orchestrator → Output */}
              <path id="p-m-out" d="M 542 130 L 648 130" fill="none" stroke="url(#wf-grad-pink)" strokeWidth="2.5" markerEnd="url(#arrowhead)"/>

              {/* ---- ANIMATED PACKETS ---- */}
              <circle r="3.5" fill="#FF2EBF" filter="url(#wf-glow)" opacity="0.9">
                <animateMotion dur="2.8s" repeatCount="indefinite" begin="0s"><mpath href="#p-g-st"/></animateMotion>
              </circle>
              <circle r="2.5" fill="#9B30D9" filter="url(#wf-glow)" opacity="0.85">
                <animateMotion dur="3.2s" repeatCount="indefinite" begin="0.6s"><mpath href="#p-g-vc"/></animateMotion>
              </circle>
              <circle r="3" fill="#FF2EBF" filter="url(#wf-glow)" opacity="0.9">
                <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.2s"><mpath href="#p-cal-vc"/></animateMotion>
              </circle>
              <circle r="2.5" fill="#9B30D9" filter="url(#wf-glow)" opacity="0.8">
                <animateMotion dur="3s" repeatCount="indefinite" begin="0.4s"><mpath href="#p-cal-rel"/></animateMotion>
              </circle>
              <circle r="3" fill="#FF71D5" filter="url(#wf-glow)" opacity="0.85">
                <animateMotion dur="2.7s" repeatCount="indefinite" begin="1.8s"><mpath href="#p-meet-rel"/></animateMotion>
              </circle>
              <circle r="2.5" fill="#9B30D9" filter="url(#wf-glow)" opacity="0.8">
                <animateMotion dur="3.5s" repeatCount="indefinite" begin="0.9s"><mpath href="#p-meet-ga"/></animateMotion>
              </circle>
              <circle r="3.5" fill="#FF2EBF" filter="url(#wf-glow)" opacity="0.9">
                <animateMotion dur="3s" repeatCount="indefinite" begin="0.3s"><mpath href="#p-st-m"/></animateMotion>
              </circle>
              <circle r="3" fill="#9B30D9" filter="url(#wf-glow)" opacity="0.85">
                <animateMotion dur="2.8s" repeatCount="indefinite" begin="1.1s"><mpath href="#p-vc-m"/></animateMotion>
              </circle>
              <circle r="3.5" fill="#FF71D5" filter="url(#wf-glow)" opacity="0.9">
                <animateMotion dur="3.2s" repeatCount="indefinite" begin="0.7s"><mpath href="#p-rel-m"/></animateMotion>
              </circle>
              <circle r="3" fill="#9B30D9" filter="url(#wf-glow)" opacity="0.85">
                <animateMotion dur="3.5s" repeatCount="indefinite" begin="1.5s"><mpath href="#p-ga-m"/></animateMotion>
              </circle>
              <circle r="4" fill="#FF2EBF" filter="url(#wf-glow-lg)" opacity="0.95">
                <animateMotion dur="2s" repeatCount="indefinite" begin="0.2s"><mpath href="#p-m-out"/></animateMotion>
              </circle>

              {/* ---- INPUT NODES ---- */}
              <g>
                <circle cx="65" cy="65" r="24" fill="rgba(255,46,191,0.07)" stroke="rgba(255,46,191,0.3)" strokeWidth="1"/>
                <circle cx="65" cy="65" r="32" fill="none" stroke="rgba(255,46,191,0.12)" strokeWidth="1">
                  <animate attributeName="r" values="24;34;24" dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
                </circle>
                <text x="65" y="61" textAnchor="middle" fill="#EEEEFF" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="500">Gmail</text>
                <text x="65" y="73" textAnchor="middle" fill="rgba(255,46,191,0.8)" fontSize="7" fontFamily="JetBrains Mono">INPUT</text>
              </g>
              <g>
                <circle cx="65" cy="130" r="24" fill="rgba(155,48,217,0.07)" stroke="rgba(155,48,217,0.3)" strokeWidth="1"/>
                <circle cx="65" cy="130" r="24" fill="none" stroke="rgba(155,48,217,0.12)" strokeWidth="1">
                  <animate attributeName="r" values="24;34;24" dur="3.5s" repeatCount="indefinite" begin="0.8s"/>
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="3.5s" repeatCount="indefinite" begin="0.8s"/>
                </circle>
                <text x="65" y="126" textAnchor="middle" fill="#EEEEFF" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="500">Calendar</text>
                <text x="65" y="138" textAnchor="middle" fill="rgba(155,48,217,0.8)" fontSize="7" fontFamily="JetBrains Mono">INPUT</text>
              </g>
              <g>
                <circle cx="65" cy="200" r="24" fill="rgba(255,46,191,0.07)" stroke="rgba(255,46,191,0.28)" strokeWidth="1"/>
                <circle cx="65" cy="200" r="24" fill="none" stroke="rgba(255,46,191,0.1)" strokeWidth="1">
                  <animate attributeName="r" values="24;34;24" dur="4s" repeatCount="indefinite" begin="1.4s"/>
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" begin="1.4s"/>
                </circle>
                <text x="65" y="196" textAnchor="middle" fill="#EEEEFF" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="500">Meetings</text>
                <text x="65" y="208" textAnchor="middle" fill="rgba(255,46,191,0.8)" fontSize="7" fontFamily="JetBrains Mono">INPUT</text>
              </g>

              {/* ---- SPECIALIST AGENT NODES ---- */}
              {WF_AGENTS.map((a, i) => (
                <g key={i}>
                  <circle cx={242} cy={a.y} r="24" fill="rgba(255,46,191,0.06)" stroke="rgba(255,46,191,0.22)" strokeWidth="1"/>
                  <text x={242} y={a.y - 4} textAnchor="middle" fill="#EEEEFF" fontSize="8" fontFamily="JetBrains Mono" fontWeight="500">{a.id}</text>
                  <text x={242} y={a.y + 8} textAnchor="middle" fill="rgba(155,48,217,0.85)" fontSize="6.5" fontFamily="JetBrains Mono">{a.label}</text>
                </g>
              ))}

              {/* ---- ORCHESTRATOR NODE (AG-12 Momentum) ---- */}
              <g filter="url(#wf-glow-lg)">
                <circle cx="500" cy="130" r="38" fill="rgba(255,46,191,0.09)" stroke="rgba(255,46,191,0.45)" strokeWidth="1.5"/>
                <circle cx="500" cy="130" r="50" fill="none" stroke="rgba(255,46,191,0.12)" strokeWidth="1">
                  <animate attributeName="r" values="38;52;38" dur="2.8s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2.8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="500" cy="130" r="60" fill="none" stroke="rgba(155,48,217,0.07)" strokeWidth="1">
                  <animate attributeName="r" values="42;62;42" dur="2.8s" repeatCount="indefinite" begin="0.4s"/>
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2.8s" repeatCount="indefinite" begin="0.4s"/>
                </circle>
                <text x="500" y="122" textAnchor="middle" fill="#FF2EBF" fontSize="8" fontFamily="JetBrains Mono" fontWeight="700" letterSpacing="1">AG-12</text>
                <text x="500" y="134" textAnchor="middle" fill="#EEEEFF" fontSize="9.5" fontFamily="Outfit, sans-serif" fontWeight="600">Momentum</text>
                <text x="500" y="147" textAnchor="middle" fill="rgba(155,48,217,0.85)" fontSize="7" fontFamily="JetBrains Mono">ORCHESTRATOR</text>
              </g>

              {/* ---- OUTPUT NODE (Dashboard) ---- */}
              <g>
                <rect x="656" y="108" width="76" height="44" rx="8" fill="rgba(255,46,191,0.06)" stroke="rgba(255,46,191,0.3)" strokeWidth="1"/>
                <rect x="656" y="108" width="76" height="44" rx="8" fill="none" stroke="rgba(255,46,191,0.15)" strokeWidth="1">
                  <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                </rect>
                <text x="694" y="126" textAnchor="middle" fill="#FF2EBF" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600">Dashboard</text>
                <text x="694" y="140" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="6.5" fontFamily="JetBrains Mono">HUMAN OUTPUT</text>
              </g>

              {/* ---- COLUMN LABELS ---- */}
              <text x="65" y="245" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="JetBrains Mono" letterSpacing="1">DATA SOURCES</text>
              <text x="242" y="272" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="JetBrains Mono" letterSpacing="1">SPECIALIST AGENTS</text>
              <text x="500" y="185" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="JetBrains Mono" letterSpacing="1">ORCHESTRATOR</text>
              <text x="694" y="165" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="JetBrains Mono" letterSpacing="1">OUTPUT</text>
            </svg>
          </div>
            </div>
          </div>
        </section>

        <div className="l-divider" />

        {/* THE WALL — DEEP DIVE */}
        <section className="l-section">
          <div className="section-label" data-reveal="left">The Problem</div>
          <h2 className="section-h2" data-reveal="left" style={{ transitionDelay: '0.1s' }}>The <em>Project Wall</em> is structural.</h2>
          <p className="section-sub" data-reveal="left" style={{ transitionDelay: '0.2s' }}>
            It&apos;s not a client relationship problem. It&apos;s a geometry problem.
            Most consulting engagements operate entirely in the wrong quadrant —
            and every project restart resets the clock.
          </p>

          {/* landing_page_3 accent — chart/hand image */}
          <div className="platform-frame pf-section-frame">
            <div className="platform-frame-top">
              <div className="pf-dot" style={{background:'var(--red)'}}/>
              <div className="pf-dot" style={{background:'var(--amber)'}}/>
              <div className="pf-dot" style={{background:'var(--green)'}}/>
              <span className="pf-url">qnsult · strategic value · project wall detection</span>
            </div>
            <div className="pf-content">
          <div className="chart-accent-wrap">
            <div className="chart-accent-img-col" data-reveal="left" style={{ transitionDelay: '0.1s' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/landing_page_3.png" alt="" className="chart-accent-img" />
            </div>
            <div className="wall-chart-wrap" ref={chartRef} data-reveal="right" style={{ transitionDelay: '0.2s' }}>
              <div className="wcl-y">STRATEGIC VALUE ↑</div>
              <svg className="wall-chart" viewBox="0 0 540 195" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gfill-qnsult" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF2EBF" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#FF2EBF" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gfill-trad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                  </linearGradient>
                  <filter id="pink-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {[40, 80, 120, 160].map(y => (
                  <line key={y} x1="40" y1={y} x2="520" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}
                {['0', '6mo', '12mo', '18mo', '24mo'].map((l, i) => (
                  <text key={i} x={40 + i * 120} y="192" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">{l}</text>
                ))}

                <line x1="220" y1="10" x2="220" y2="172" stroke="rgba(245,158,11,0.35)" strokeWidth="1" strokeDasharray="4 3" />
                <text x="226" y="24" fill="rgba(245,158,11,0.9)" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="1">THE WALL</text>

                <path d="M 40,155 C 90,130 130,72 220,58 C 265,52 290,68 330,98 C 370,122 430,140 520,148 L 520,175 L 40,175 Z" fill="url(#gfill-trad)" />
                <path
                  d="M 40,155 C 90,130 130,72 220,58 C 265,52 290,68 330,98 C 370,122 430,140 520,148"
                  stroke="#EF4444" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="600" style={{ strokeDashoffset: chartVisible ? 0 : 600, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1) 0s' }}
                />

                <path
                  d="M 40,155 C 90,130 130,72 220,58 C 265,44 320,28 400,15 C 450,9 485,7 520,6 L 520,175 L 40,175 Z"
                  fill="url(#gfill-qnsult)"
                  style={{ opacity: chartVisible ? 1 : 0, transition: 'opacity 1s ease 0.6s' }}
                />
                <path
                  d="M 40,155 C 90,130 130,72 220,58 C 265,44 320,28 400,15 C 450,9 485,7 520,6"
                  stroke="#FF2EBF" strokeWidth="2.5" strokeLinecap="round" filter="url(#pink-glow)"
                  strokeDasharray="600" style={{ strokeDashoffset: chartVisible ? 0 : 600, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1) 0.4s' }}
                />

                {chartVisible && <>
                  <g style={{ animation: 'rise 0.4s ease 1.2s both' }}>
                    <circle cx={196} cy={62} r="5" fill="#FF2EBF" />
                    <circle cx={196} cy={62} r="5" fill="#FF2EBF" opacity="0.3">
                      <animate attributeName="r" values="5;16;5" dur="2.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                    <text x="130" y="50" fill="#FF2EBF" fontSize="7.5" fontFamily="JetBrains Mono" opacity="0.9">QNSULT DETECTS</text>
                  </g>
                  <g style={{ animation: 'rise 0.4s ease 1.6s both' }}>
                    <circle cx={220} cy={58} r="5" fill="#F59E0B" />
                    <circle cx={220} cy={58} r="5" fill="#F59E0B" opacity="0.3">
                      <animate attributeName="r" values="5;14;5" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                  <g style={{ animation: 'rise 0.4s ease 1.9s both' }}>
                    <circle cx={330} cy={98} r="4.5" fill="#EF4444" />
                    <circle cx={330} cy={98} r="4.5" fill="#EF4444" opacity="0.3">
                      <animate attributeName="r" values="4;13;4" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="338" y="96" fill="#EF4444" fontSize="7.5" fontFamily="JetBrains Mono" opacity="0.9">SLIDE BEGINS</text>
                  </g>
                </>}
              </svg>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-ln" style={{ background: '#FF2EBF', boxShadow: '0 0 6px #FF2EBF' }} />
                  With Qnsult
                </div>
                <div className="legend-item">
                  <div className="legend-ln" style={{ background: '#EF4444', opacity: 0.6 }} />
                  Traditional consulting
                </div>
                <div className="legend-item">
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', opacity: 0.8, flexShrink: 0 }} />
                  The Wall
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>

          <div className="problem-grid">
            <div className="prob-card wall">
              <div className="prob-glow amber-glow" />
              <div className="prob-icon wall-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></div>
              <div className="prob-title">The Project Wall</div>
              <div className="prob-desc">A structural barrier that traps consultancies in low-value transactional engagements. Each new project resets the clock. Relationships stay operational, never reaching the executive decision-makers who control long-term mandates.</div>
              <div className="prob-signals">
                {['Exec contact fades', 'Renewal risk rises', 'Competitor positioning'].map(s => (
                  <div key={s} className="prob-signal amber-signal">{s}</div>
                ))}
              </div>
              <div className="prob-tag amber-tag">Structural</div>
            </div>
            <div className="prob-card danger">
              <div className="prob-glow red-glow" />
              <div className="prob-icon danger-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
              <div className="prob-title">The AI Danger Zone</div>
              <div className="prob-desc">The execution and delivery work that defines front-of-wall engagements is precisely what AI tools are absorbing fastest. The value proposition erodes without warning — nobody is monitoring the boundary as it shifts.</div>
              <div className="prob-signals">
                {['Margin compression', 'Commoditisation creep', 'Scope erosion'].map(s => (
                  <div key={s} className="prob-signal red-signal">{s}</div>
                ))}
              </div>
              <div className="prob-tag red-tag">Existential</div>
            </div>
          </div>
        </section>

        <div className="l-divider" />

        {/* TESTIMONIALS */}
        <section className="l-section" style={{ paddingBottom: 0 }}>
          <div className="section-label" data-reveal="up">From the field</div>
          <h2 className="section-h2" data-reveal="up" style={{ transitionDelay: '0.12s' }}>They saw the wall. <em>Too late.</em></h2>
        </section>
        <div className="t-stage" data-reveal="up" style={{ transitionDelay: '0.1s' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`t-card ${i === activeTestimonial ? 'active' : ''}`} onClick={() => setActiveTestimonial(i)}>
              <div className="t-qmark">&ldquo;</div>
              <p className="t-body">{t.quote}</p>
              <div className="t-attr">
                <div className="t-avatar">{t.initials}</div>
                <div>
                  <div className="t-name">{t.name}</div>
                  <div className="t-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="t-nav">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} className={`t-dot ${i === activeTestimonial ? 'active' : ''}`} onClick={() => setActiveTestimonial(i)} />
          ))}
        </div>
        <div style={{ paddingBottom: 80 }} />

        <div className="l-divider" />

        {/* ESCAPE TIMELINE */}
        <section className="l-section" ref={escapeRef}>
          <div className="section-label" data-reveal="left">The Qnsult Difference</div>
          <h2 className="section-h2" data-reveal="left" style={{ transitionDelay: '0.1s' }}>Same project. <em>Different trajectory.</em></h2>
          <p className="section-sub" data-reveal="left" style={{ transitionDelay: '0.2s' }}>The engagement starts identically. Qnsult changes what happens beneath the surface — from week one.</p>
          <div className="platform-frame pf-section-frame">
            <div className="platform-frame-top">
              <div className="pf-dot" style={{background:'var(--red)'}}/>
              <div className="pf-dot" style={{background:'var(--amber)'}}/>
              <div className="pf-dot" style={{background:'var(--green)'}}/>
              <span className="pf-url">qnsult · engagement comparison · trajectory analysis</span>
            </div>
            <div className="pf-content">
          <div className={`escape-grid ${escapeVisible ? 'esc-visible' : ''}`}>
            <div className="esc-col">
              <div className="esc-header">
                <div className="esc-icon red-esc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
                <div>
                  <div className="esc-title">Without Qnsult</div>
                  <div className="esc-sub">The standard engagement arc</div>
                </div>
              </div>
              {WITHOUT_TL.map((item, i) => (
                <div key={i} className="tl-item" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="tl-week red-week">{item.week}</div>
                  <div className="tl-con red-con" />
                  <div className="tl-body">
                    <div className="tl-title">{item.title}</div>
                    <div className="tl-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="esc-divider">
              <div className="esc-vl" /><div className="esc-vs">vs</div><div className="esc-vl" />
            </div>
            <div className="esc-col">
              <div className="esc-header">
                <div className="esc-icon pink-esc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></div>
                <div>
                  <div className="esc-title">With Qnsult</div>
                  <div className="esc-sub">Agents working beneath the surface</div>
                </div>
              </div>
              {WITH_TL.map((item, i) => (
                <div key={i} className="tl-item" style={{ animationDelay: `${i * 0.1 + 0.05}s` }}>
                  <div className="tl-week pink-week">{item.week}</div>
                  <div className="tl-con pink-con" />
                  <div className="tl-body">
                    <div className="tl-title">{item.title}</div>
                    <div className="tl-desc">{item.desc}</div>
                    {item.agent && <div className="tl-agent">{item.agent}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
            </div>
          </div>
        </section>

        <div className="l-divider" />

        {/* AGENT SYSTEM */}
        <section className="l-section agent-section">
          {/* landing_page_1 puzzle image — background accent */}
          <div className="agent-bg-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landing_page_1.png" alt="" className="agent-bg-img-el" />
          </div>
          <div className="section-label" data-reveal="left">The System</div>
          <h2 className="section-h2" data-reveal="left" style={{ transitionDelay: '0.1s' }}>12 agents. One <em>diagonal arrow</em>.</h2>
          <p className="section-sub" data-reveal="left" style={{ transitionDelay: '0.2s' }}>Every prescribed upstream move runs as an agent behaviour, continuously, across every client account. Click any agent to see what it watches.</p>
          <div className="agent-grid">
            {AGENTS.map((a, i) => (
              <div key={a.num} className={`agent-card ${activeAgent === i ? 'a-expanded' : ''}`} data-reveal={i % 2 === 0 ? 'left' : 'right'} style={{ transitionDelay: `${0.05 * i}s` }} onClick={() => setActiveAgent(activeAgent === i ? null : i)}>
                <div className="agent-inner">
                  <div className="agent-num">{a.num}</div>
                  <div className="agent-name">{a.name}</div>
                  <div className="agent-role">{a.role}</div>
                  <div className="agent-layer">{a.layer}</div>
                  {activeAgent === i && (
                    <div className="agent-detail">
                      <div className="agent-detail-hr" />
                      {a.signals.map((s, si) => (
                        <div key={si} className="agent-sig"><div className="as-dot" />{s}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="agent-hint">{activeAgent === i ? '− less' : '+ signals'}</div>
              </div>
            ))}
          </div>
          <div className="orch-card" data-reveal="scale" style={{ transitionDelay: '0.15s' }}>
            <div className="orch-glow" />
            <div className="orch-num">12</div>
            <div>
              <div className="orch-label">Orchestration · Both Axes</div>
              <div className="orch-title">Momentum Agent</div>
              <div className="orch-desc">Scores each client&apos;s trajectory simultaneously on both axes. Fires the right specialist at the right moment. Generates the Consultant Dashboard — the sole human-facing output — with every pattern stored in the Atlas Pattern Library, compounding with every engagement.</div>
            </div>
          </div>
        </section>

        <div className="l-divider" />

        {/* ABOUT */}
        <section className="about-section l-section">
          {/* Large logo watermark — gradient fade from right */}
          <div className="about-logo-watermark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" aria-hidden="true" className="about-logo-wm-img" />
          </div>

          <div className="about-header" data-reveal="left">
            <div className="section-label">About Qnsult</div>
            <h2 className="section-h2">Built for the consultancy<br />that refuses to play <em>defence</em>.</h2>
          </div>

          {/* Full-width paragraphs */}
          <div className="about-paras">
            <p className="about-para" data-reveal="up" style={{ transitionDelay: '0.1s' }}>
              Qnsult is a 12-agent intelligence system that operates beneath every engagement. While your team is heads-down in delivery, it continuously tracks exec contact frequency, maps strategic whitespace, and detects stall patterns — four to six weeks before any signal surfaces to the client.
            </p>
            <p className="about-para" data-reveal="up" style={{ transitionDelay: '0.22s' }}>
              Most firms discover the problem when the renewal call doesn&apos;t happen. Qnsult exists to close that window entirely: one always-on layer, across every account, producing a single human-facing dashboard with no noise and no distraction.
            </p>
          </div>

          {/* Features + image side-by-side */}
          <div className="about-grid">
            <div className="about-content" data-reveal="left" style={{ transitionDelay: '0.1s' }}>
              <div className="about-features">
                {ABOUT_FEATURES.map((f, i) => (
                  <div key={i} className="about-feat">
                    <div className="about-feat-ptr" style={{ background: f.color, boxShadow: `0 0 10px ${f.glow}, 0 0 4px ${f.color}` }} />
                    <div>
                      <div className="about-feat-title">{f.title}</div>
                      <div className="about-feat-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="about-stack">
                {['Google Cloud ADK', 'Gemini 2.0 Flash', 'MongoDB Atlas', 'Gmail API'].map(t => (
                  <div key={t} className="about-stack-badge">
                    <div className="asb-dot" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* macOS mockup with landing_page_4 */}
            <div className="about-mockup" data-reveal="right" style={{ transitionDelay: '0.2s' }}>
              <div className="platform-frame about-frame">
                <div className="platform-frame-top">
                  <div className="pf-dot" style={{ background: 'var(--red)' }} />
                  <div className="pf-dot" style={{ background: 'var(--amber)' }} />
                  <div className="pf-dot" style={{ background: 'var(--green)' }} />
                  <span className="pf-url">qnsult · intelligence capabilities · 12 agents active</span>
                </div>
                <div className="platform-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/landing_page_4.png" alt="Qnsult intelligence capabilities" className="about-img" />
                  <div className="about-img-overlay" />
                  <div className="about-frame-badge">
                    <div className="pb-dot" />
                    <span>Strategy · Stall Detection · Exec Mapping</span>
                  </div>
                </div>
              </div>
              <div className="about-frame-glow" />
            </div>
          </div>
        </section>

        <div className="l-divider" />

        {/* FINAL CTA */}
        <section className="final-cta">
          <div className="cta-card" data-reveal="scale">
            <div className="cta-orb" />
            <div className="cta-inner">
              {/* Logo column */}
              <div className="cta-logo-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="Qnsult" className="cta-logo-img" />
              </div>
              {/* Content column */}
              <div className="cta-content-col">
                <div className="section-label" style={{ marginBottom: 14 }}>Start now</div>
                <h3 className="cta-h3">Stop losing accounts you <em>already won</em>.</h3>
                <p className="cta-sub">Connect your Google Workspace. Qnsult reads Gmail for client signals, drafts stall recovery outreach, and labels executive threads — so nothing falls through during busy delivery periods.</p>
                <button className="hero-btn-primary" onClick={signInWithGoogle}>
                  <GoogleIcon />
                  Connect Google Workspace
                </button>
                <div className="cta-perms">
                  {['Gmail read access', 'Draft + send emails', 'Auto-label threads', 'Never posts without approval'].map(p => (
                    <div key={p} className="cta-perm"><div className="perm-dot" />{p}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="l-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <img src="/logo.svg" alt="Qnsult" style={{ width: '28px', height: '28px', objectFit: 'contain', opacity: 0.7 }} />
            <div className="l-footer-brand">Qn<em>sult</em></div>
          </div>
          <div className="l-footer-note">Built on Google Cloud ADK · MongoDB Atlas · Gemini 2.0 Flash</div>
        </footer>

      </div>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

const PARTICLES = [
  { x: '8%',  y: '12%', delay: '0s',    dur: '18s', size: '3px' },
  { x: '22%', y: '45%', delay: '3s',    dur: '22s', size: '2px' },
  { x: '55%', y: '8%',  delay: '7s',    dur: '16s', size: '4px' },
  { x: '75%', y: '30%', delay: '1.5s',  dur: '20s', size: '2px' },
  { x: '88%', y: '65%', delay: '5s',    dur: '25s', size: '3px' },
  { x: '35%', y: '78%', delay: '9s',    dur: '19s', size: '2px' },
  { x: '62%', y: '55%', delay: '2s',    dur: '23s', size: '3px' },
  { x: '15%', y: '88%', delay: '11s',   dur: '17s', size: '2px' },
  { x: '92%', y: '20%', delay: '6s',    dur: '21s', size: '3px' },
  { x: '48%', y: '92%', delay: '4s',    dur: '24s', size: '2px' },
]

const WF_AGENTS = [
  { id: 'AG-03', label: 'STALL DETECT', y: 58 },
  { id: 'AG-01', label: 'VALUE CHAIN',  y: 112 },
  { id: 'AG-04', label: 'RELATIONSHIP', y: 166 },
  { id: 'AG-02', label: 'GOAL ALIGN',   y: 220 },
]

const SIGNALS = [
  { type: 'warning', label: 'Exec contact gap: 14 days' },
  { type: 'danger', label: 'Stall signal detected' },
  { type: 'ok', label: 'Value chain expanding' },
]

const TESTIMONIALS = [
  {
    quote: "We lost our biggest client — $2.4M ARR — not because we did bad work. We did exactly what was scoped. The problem was nobody was watching what was happening at the executive level while we were heads-down in delivery.",
    name: "Sarah Whitmore",
    role: "Former Managing Director, Big 4 Advisory",
    initials: "SW",
  },
  {
    quote: "The moment your contact gets promoted or leaves, the clock starts. Six months later you're in a competitive RFP against firms who've been building that new executive relationship for years. We had no visibility.",
    name: "James Reiter",
    role: "COO, Mid-Market Consulting Group",
    initials: "JR",
  },
  {
    quote: "AI didn't kill our delivery practice overnight. It eroded it quarterly. By the time leadership noticed the margin compression, we'd already lost the strategic narrative to firms operating two tiers above us.",
    name: "Priya Nair",
    role: "VP Strategy, Digital Consulting Practice",
    initials: "PN",
  },
]

const WITHOUT_TL = [
  { week: 'Wk 0', title: 'Project begins', desc: 'Strong exec alignment. Energy high.' },
  { week: 'Wk 4', title: 'Delivery focus locks in', desc: 'Team bandwidth consumed. Exec cadence slips.' },
  { week: 'Wk 8', title: 'Last executive contact', desc: '"Let\'s catch up after launch." Nobody follows up.' },
  { week: 'Wk 12', title: 'Project delivered', desc: 'On scope, on budget. Client says "great work."' },
  { week: 'Wk 18', title: 'Silence', desc: 'No follow-up. Team reassigned. Relationship cold.' },
  { week: 'Wk 26', title: 'Client announces new initiative', desc: 'With a competitor. You find out on LinkedIn.' },
]

const WITH_TL = [
  { week: 'Wk 0', title: 'Project begins', desc: 'Agents establish baseline across all client signals.', agent: 'AG-02 · Goal Alignment' },
  { week: 'Wk 3', title: 'Cadence gap flagged', desc: 'Exec contact frequency drops below threshold.', agent: 'AG-04 · Relationship Agent' },
  { week: 'Wk 5', title: 'Stall signal detected', desc: '4-week lead time. Recovery window still open.', agent: 'AG-03 · Stall Detection' },
  { week: 'Wk 7', title: 'Strategic gap surfaced', desc: 'Value chain agent maps $800K+ adjacent opportunity.', agent: 'AG-01 · Value Chain' },
  { week: 'Wk 9', title: 'Outreach drafted + approved', desc: 'Qnsult drafts exec intro. Call booked within 48h.', agent: 'AG-12 · Momentum' },
  { week: 'Wk 12', title: 'Project delivered + next scoped', desc: 'New mandate active before current engagement closes.' },
]

const AGENTS = [
  { num: 'AG-01', name: 'Value Chain Agent', role: 'Scans gap between current delivery and client strategic priorities', layer: 'Layer 1 · Y-axis', signals: ['Strategic whitespace mapping', 'Scope vs. mandate gap scoring', 'Adjacent opportunity flagging'] },
  { num: 'AG-02', name: 'Goal Alignment', role: 'Structures client goals from meetings, documents, exec briefings', layer: 'Layer 1 · Semantic Backbone', signals: ['Meeting note parsing', 'OKR drift detection', 'Priority shift alerting'] },
  { num: 'AG-03', name: 'Stall Detection', role: 'Monitors project signals for stall indicators 4–6wk ahead', layer: 'Layer 1 · Y-axis', signals: ['Email cadence monitoring', 'Decision velocity tracking', 'Escalation pattern recognition'] },
  { num: 'AG-04', name: 'Relationship Agent', role: 'Tracks executive cadence, topics, influence mapping', layer: 'Layer 2 · X-axis', signals: ['Exec contact frequency', 'Influence map changes', 'Decision-maker turnover'] },
  { num: 'AG-05', name: 'Journey Design', role: 'Designs multi-year engagement roadmaps compounding each project', layer: 'Layer 2 · X-axis', signals: ['Project-to-project continuity', 'Narrative thread scoring', 'Strategic sequencing'] },
  { num: 'AG-06', name: 'AI Displacement Monitor', role: 'Live-tracks AI capability evolution, redraws danger zone', layer: 'Layer 3 · Defence', signals: ['Capability boundary tracking', 'Margin erosion signals', 'Service line risk scoring'] },
]

const ABOUT_FEATURES = [
  { color: '#FF2EBF', glow: 'rgba(255,46,191,0.5)',   title: '6-week stall lead time',          desc: 'Structural warning before exec contact fades — while the recovery window is still open.' },
  { color: '#9B30D9', glow: 'rgba(155,48,217,0.5)',   title: 'Always-on value chain mapping',   desc: 'Continuous identification of strategic whitespace adjacent to your current scope.' },
  { color: '#22C55E', glow: 'rgba(34,197,94,0.5)',    title: 'One dashboard. Zero noise.',      desc: 'Twelve agents distill into a single human-facing output. No alerts, no reports — just decisions.' },
  { color: '#818CF8', glow: 'rgba(129,140,248,0.5)',  title: 'Draft, review, approve',          desc: 'Qnsult writes the outreach. You decide what goes. It never sends without explicit sign-off.' },
]

const JOURNEY_STAGES = [
  { cx: 68,  label: 'Client Proposal',   sub: 'Goals aligned',        fill: '#22C55E', textFill: 'rgba(34,197,94,0.95)' },
  { cx: 188, label: 'Onboarding',        sub: 'Team engaged',          fill: '#22C55E', textFill: 'rgba(34,197,94,0.95)' },
  { cx: 308, label: 'Solution Drafting', sub: 'Deep work begins',      fill: '#9B30D9', textFill: 'rgba(155,48,217,0.95)' },
  { cx: 428, label: 'Pitching & Pricing',sub: 'Exec still in room',    fill: '#9B30D9', textFill: 'rgba(155,48,217,0.95)' },
  { cx: 548, label: 'Delivery Focus',    sub: 'Exec cadence fading',   fill: '#F59E0B', textFill: 'rgba(245,158,11,0.95)' },
]

const STYLES = `
/* === SCROLL REVEAL === */
[data-reveal] {
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-reveal="left"]  { transform: translateX(-60px); }
[data-reveal="right"] { transform: translateX(60px); }
[data-reveal="up"]    { transform: translateY(44px); }
[data-reveal="fade"]  { transform: none; }
[data-reveal="scale"] { transform: scale(0.93) translateY(24px); }
[data-reveal].is-visible { opacity: 1 !important; transform: none !important; }

/* === KEYFRAMES === */
@keyframes wave-gradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes glow-wave {
  0%,100% { box-shadow: 0 0 20px rgba(255,46,191,0.2), 0 0 60px rgba(155,48,217,0.06); }
  50%      { box-shadow: 0 0 40px rgba(255,46,191,0.5), 0 0 100px rgba(155,48,217,0.18); }
}
@keyframes border-wave {
  0%,100% { border-color: rgba(255,46,191,0.15); }
  50%      { border-color: rgba(155,48,217,0.35); }
}
@keyframes orb-drift-a {
  0%,100% { transform: translate(0,0) scale(1); opacity: 1; }
  33%     { transform: translate(60px,-45px) scale(1.08); opacity: 0.8; }
  66%     { transform: translate(-35px,28px) scale(0.95); opacity: 0.9; }
}
@keyframes orb-drift-b {
  0%,100% { transform: translate(0,0) scale(1); opacity: 0.9; }
  33%     { transform: translate(-45px,35px) scale(0.96); opacity: 1; }
  66%     { transform: translate(40px,-28px) scale(1.07); opacity: 0.8; }
}
@keyframes signal-float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-5px); }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes dot-pulse {
  0%,100% { opacity: 1; }
  50%     { opacity: 0.35; }
}
@keyframes scan-line {
  0%   { transform: translateY(-2px); opacity: 0; }
  3%   { opacity: 0.8; }
  97%  { opacity: 0.4; }
  100% { transform: translateY(100vh); opacity: 0; }
}
@keyframes particle-drift {
  0%   { transform: translateY(0px) translateX(0px) scale(1); opacity: 0; }
  8%   { opacity: 0.7; }
  50%  { transform: translateY(-40px) translateX(15px) scale(1.2); opacity: 0.4; }
  92%  { opacity: 0.3; }
  100% { transform: translateY(-80px) translateX(-10px) scale(0.8); opacity: 0; }
}
@keyframes platform-glow-pulse {
  0%,100% { opacity: 0.4; }
  50%      { opacity: 0.8; }
}
@keyframes wf-path-draw {
  from { stroke-dashoffset: 500; opacity: 0; }
  to   { stroke-dashoffset: 0; opacity: 1; }
}
@keyframes badge-float {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-4px); }
}
/* Journey keyframes */
@keyframes jrn-line-draw {
  from { stroke-dashoffset: 600; }
  to   { stroke-dashoffset: 0; }
}
@keyframes jrn-arc-draw {
  from { stroke-dashoffset: 400; }
  to   { stroke-dashoffset: 0; }
}
@keyframes jrn-node-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes jrn-wall-slam {
  0%   { opacity: 0; transform: scaleY(0.05); }
  60%  { opacity: 1; transform: scaleY(1.06); }
  100% { opacity: 1; transform: scaleY(1); }
}
@keyframes jrn-reveal-in {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes hgw-float-tl {
  0%,100% { transform: translate(0, 0); }
  50%      { transform: translate(-6px, -8px); }
}
@keyframes hgw-float-tr {
  0%,100% { transform: translate(0, 0); }
  50%      { transform: translate(6px, -8px); }
}
@keyframes hgw-float-bl {
  0%,100% { transform: translate(0, 0); }
  50%      { transform: translate(-6px, 8px); }
}
@keyframes hgw-float-br {
  0%,100% { transform: translate(0, 0); }
  50%      { transform: translate(6px, 8px); }
}
@keyframes hgw-ring-out {
  0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
}

/* === BASE === */
.lp-wrap { min-height: 100vh; background: var(--bg); position: relative; overflow-x: hidden; }

/* Scan line */
.scan-line {
  position: fixed; left: 0; right: 0; top: 0; height: 1px; z-index: 1; pointer-events: none;
  background: linear-gradient(90deg, transparent 0%, rgba(255,46,191,0.35) 30%, rgba(155,48,217,0.5) 50%, rgba(255,46,191,0.35) 70%, transparent 100%);
  animation: scan-line 12s linear infinite;
}

/* Floating particles */
.particle {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
  background: radial-gradient(circle, rgba(255,46,191,0.6) 0%, rgba(155,48,217,0.3) 60%, transparent 100%);
  animation: particle-drift var(--dur, 20s) ease-in-out infinite;
}

/* Ambient orbs */
.orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; will-change: transform; }
.orb-1 { width: 900px; height: 900px; top: -10%; right: -10%; background: radial-gradient(circle, rgba(155,48,217,0.12) 0%, transparent 65%); animation: orb-drift-a 20s ease-in-out infinite; }
.orb-2 { width: 700px; height: 700px; bottom: 5%; left: -10%; background: radial-gradient(circle, rgba(255,46,191,0.09) 0%, transparent 65%); animation: orb-drift-b 25s ease-in-out infinite; }
.orb-3 { width: 500px; height: 500px; top: 45%; left: 38%; background: radial-gradient(circle, rgba(155,48,217,0.06) 0%, transparent 65%); animation: orb-drift-a 30s ease-in-out infinite reverse; }

.grid-overlay {
  position: fixed; inset: 0;
  background-image: linear-gradient(rgba(255,46,191,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,46,191,0.018) 1px, transparent 1px);
  background-size: 44px 44px; pointer-events: none; z-index: 0;
}

/* NAV */
.l-nav {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 58px;
  background: rgba(9,9,15,0.88); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.l-brand { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.04em; color: var(--text-1); }
.l-brand em {
  font-style: normal;
  background: linear-gradient(90deg, var(--pink), var(--violet), var(--pink-hi), var(--violet), var(--pink));
  background-size: 300% 300%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: wave-gradient 4s ease infinite;
}
.l-brand-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--pink);
  background: var(--pink-dim); border: 1px solid rgba(255,46,191,0.2);
  padding: 2px 6px; border-radius: 3px; letter-spacing: 0.08em; text-transform: uppercase; margin-left: 10px;
}
.l-nav-right { display: flex; align-items: center; gap: 12px; }
.l-btn-ghost {
  padding: 7px 16px; border-radius: var(--r-sm); border: 1px solid var(--border);
  background: transparent; color: var(--text-2); font-family: 'Outfit', sans-serif;
  font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s;
}
.l-btn-ghost:hover { border-color: var(--border-md); color: var(--text-1); background: var(--bg-card); }
.l-btn-wave {
  padding: 8px 20px; border-radius: var(--r-sm);
  background: linear-gradient(135deg, var(--pink) 0%, var(--violet) 50%, var(--pink-hi) 100%);
  background-size: 200% 200%;
  color: #fff; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; border: none;
  animation: wave-gradient 3s ease infinite;
  transition: box-shadow 0.2s, transform 0.15s;
}
.l-btn-wave:hover { box-shadow: 0 0 28px rgba(255,46,191,0.5); transform: translateY(-1px); }

/* WALL QUOTE BANNER */
.wqb {
  position: relative; z-index: 1;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(255,46,191,0.04) 0%, transparent 100%);
  overflow: hidden;
}
.wqb-inner { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 56px 40px; }

/* Chess king image — background accent beside quote */
.wqb-chess-wrap {
  position: absolute; right: -2%; top: 0; bottom: 0; width: 48%;
  pointer-events: none; z-index: 0;
  /* Horizontal fade: transparent at left edge → opaque at center → fade right edge */
  -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 14%, black 32%, black 80%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 14%, black 32%, black 80%, transparent 100%);
}
.wqb-chess-img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center 18%;
  /* Shift hue toward the page's pink/violet palette */
  filter: hue-rotate(40deg) saturate(1.4) brightness(0.62);
  opacity: 0.42;
  /* Along the length: king (top) most opaque → chessboard base (bottom) fades to transparent */
  -webkit-mask-image: linear-gradient(to bottom, black 0%, rgba(0,0,0,0.88) 35%, rgba(0,0,0,0.32) 70%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 0%, rgba(0,0,0,0.88) 35%, rgba(0,0,0,0.32) 70%, transparent 100%);
}
.wqb-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,46,191,0.35), rgba(155,48,217,0.35), transparent); margin-bottom: 40px; }
.wqb-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--pink); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 20px; }
.wqb-quote {
  font-family: 'Cormorant Garant', Georgia, serif; font-weight: 600; font-style: italic;
  font-size: clamp(30px, 4.2vw, 56px); letter-spacing: -0.01em;
  color: var(--text-1); line-height: 1.22; margin: 0 0 44px; max-width: 620px;
}
.wqb-stats { display: flex; align-items: stretch; gap: 0; }
.wqb-stat { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.wqb-stat:not(:first-child) { padding-left: 40px; }
.wqb-vr { width: 1px; background: var(--border); flex-shrink: 0; margin: 0 40px; margin-left: 0; }
.wqb-num {
  font-family: 'Outfit', sans-serif; font-weight: 800;
  font-size: clamp(32px, 4vw, 46px); letter-spacing: -0.04em; line-height: 1;
  background: linear-gradient(135deg, var(--pink), var(--violet), var(--pink-hi), var(--pink));
  background-size: 300% 300%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: wave-gradient 5s ease infinite;
}
.wqb-label { font-family: 'Outfit', sans-serif; font-size: 13px; color: var(--text-2); line-height: 1.5; }

/* HERO */
.hero {
  position: relative; z-index: 1;
  padding: 72px 0 16px; text-align: center; animation: rise 0.7s ease both;
}

/* Giant brand display */
.hero-giant-wrap {
  position: relative; width: 100%; overflow: visible;
  display: flex; align-items: center; justify-content: center;
  padding: 56px 0 48px; margin: 20px 0 12px;
}
.hero-brand-giant {
  font-family: 'Outfit', sans-serif; font-weight: 800;
  font-size: clamp(100px, 19vw, 280px);
  letter-spacing: -0.055em; line-height: 0.85;
  position: relative; z-index: 2; user-select: none;
}
.hero-brand-giant em {
  font-style: normal;
  background: linear-gradient(90deg, var(--pink), var(--violet), var(--pink-hi), var(--violet), var(--pink));
  background-size: 300% 300%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: wave-gradient 4s ease infinite;
}
.hgw-chip {
  position: absolute; z-index: 3;
  display: flex; align-items: center; gap: 6px;
  background: rgba(9,9,15,0.72); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,46,191,0.22); border-radius: 20px;
  padding: 6px 14px;
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  color: var(--text-2); letter-spacing: 0.07em; text-transform: uppercase;
  white-space: nowrap; pointer-events: none;
}
.hgw-chip-tl { top: 14px; left: 7%;  animation: hgw-float-tl 4.2s ease-in-out infinite; }
.hgw-chip-tr { top: 14px; right: 7%; animation: hgw-float-tr 4.2s ease-in-out infinite 1.1s; }
.hgw-chip-bl { bottom: 14px; left: 9%;  animation: hgw-float-bl 4.2s ease-in-out infinite 2.2s; }
.hgw-chip-br { bottom: 14px; right: 9%; animation: hgw-float-br 4.2s ease-in-out infinite 0.7s; }
.hgw-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; animation: dot-pulse 2s ease-in-out infinite; }
.hgw-dot-green  { background: var(--green);  box-shadow: 0 0 6px var(--green); }
.hgw-dot-amber  { background: var(--amber);  box-shadow: 0 0 6px var(--amber);  animation-delay: 0.6s; }
.hgw-dot-violet { background: var(--indigo); box-shadow: 0 0 6px var(--indigo); animation-delay: 1.2s; }
.hgw-dot-pink   { background: var(--pink);   box-shadow: 0 0 6px var(--pink);   animation-delay: 1.8s; }
.hgw-ring {
  position: absolute; border-radius: 50%; pointer-events: none; z-index: 1;
  top: 50%; left: 50%; border: 1px solid rgba(255,46,191,0.12);
}
.hgw-ring-1 { width: 520px; height: 300px; animation: hgw-ring-out 3.4s ease-out infinite; }
.hgw-ring-2 { width: 740px; height: 420px; animation: hgw-ring-out 3.4s ease-out infinite 1.7s; }

.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--pink-dim); border: 1px solid rgba(255,46,191,0.2);
  border-radius: 20px; padding: 5px 14px; margin-bottom: 8px;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--pink); letter-spacing: 0.1em; text-transform: uppercase;
  animation: border-wave 4s ease infinite;
}
.hero-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); animation: dot-pulse 2.5s ease-in-out infinite; }
.hero-h1 {
  font-family: 'Outfit', sans-serif; font-weight: 800;
  font-size: clamp(40px, 6vw, 68px); letter-spacing: -0.04em;
  color: var(--text-1); line-height: 1.06; margin-bottom: 24px;
  max-width: 900px; margin-left: auto; margin-right: auto; padding: 0 40px;
}
.hero-h1 em {
  font-style: normal;
  background: linear-gradient(90deg, var(--pink), var(--violet), var(--pink-hi), var(--violet), var(--pink));
  background-size: 300% 300%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: wave-gradient 4s ease infinite;
}
.hero-sub {
  font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 400;
  color: var(--text-2); line-height: 1.65; max-width: 640px; margin: 0 auto 44px;
  padding: 0 40px;
}
.hero-cta { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; padding: 0 40px; }
.hero-btn-primary {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 28px; border-radius: var(--r-md);
  background: linear-gradient(135deg, var(--pink) 0%, var(--violet) 50%, var(--pink-hi) 100%);
  background-size: 200% 200%;
  color: #fff; font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700;
  cursor: pointer; border: none;
  animation: wave-gradient 3s ease infinite;
  transition: box-shadow 0.2s, transform 0.15s;
}
.hero-btn-primary:hover { box-shadow: 0 0 40px rgba(255,46,191,0.5); transform: translateY(-2px); }
.hero-btn-secondary {
  padding: 14px 24px; border-radius: var(--r-md);
  background: transparent; border: 1px solid var(--border-md);
  color: var(--text-2); font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 500;
  cursor: pointer; transition: all 0.15s;
}
.hero-btn-secondary:hover { border-color: var(--border-hi); color: var(--text-1); }
.hero-note { margin-top: 20px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-3); letter-spacing: 0.06em; padding: 0 40px; }

/* Floating signal chips */
.hero-signals { display: flex; justify-content: center; gap: 10px; margin-top: 44px; flex-wrap: wrap; padding: 0 40px; }

/* ── JOURNEY SECTION ── */
.jrn-section {
  position: relative; z-index: 1;
  max-width: 1000px; margin: 0 auto; padding: 0 40px 0;
  text-align: center;
}
.jrn-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  color: var(--text-3); letter-spacing: 0.18em; text-transform: uppercase;
  margin-bottom: 32px;
  display: flex; align-items: center; justify-content: center; gap: 12px;
}
.jrn-eyebrow::before, .jrn-eyebrow::after {
  content: ''; flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
}
.jrn-svg-wrap {
  background: var(--bg-card); border: 1px solid rgba(255,46,191,0.1);
  border-radius: var(--r-xl); padding: 24px 16px 16px;
  overflow: hidden; margin-bottom: 0;
  animation: border-wave 8s ease infinite;
}
.jrn-svg { width: 100%; height: auto; display: block; }

/* Default: journey elements hidden */
.jrn-pline { stroke-dashoffset: 600; }
.jrn-s0, .jrn-s1, .jrn-s2, .jrn-s3, .jrn-s4 { opacity: 0; }
.jrn-detect { opacity: 0; }
.jrn-wall-g { opacity: 0; transform-box: fill-box; transform-origin: 50% 50%; }
.jrn-post-g { opacity: 0; }
.jrn-arc    { stroke-dashoffset: 400; }

/* Triggered: animations play */
.jrn-go .jrn-pline  { animation: jrn-line-draw 3.4s cubic-bezier(0.4,0,0.2,1) 0.3s both; }
.jrn-go .jrn-s0     { animation: jrn-node-in 0.5s ease 0.6s both; }
.jrn-go .jrn-s1     { animation: jrn-node-in 0.5s ease 1.1s both; }
.jrn-go .jrn-s2     { animation: jrn-node-in 0.5s ease 1.6s both; }
.jrn-go .jrn-s3     { animation: jrn-node-in 0.5s ease 2.1s both; }
.jrn-go .jrn-s4     { animation: jrn-node-in 0.5s ease 2.6s both; }
.jrn-go .jrn-detect { animation: jrn-node-in 0.6s ease 3.0s both; }
.jrn-go .jrn-wall-g { animation: jrn-wall-slam 0.55s cubic-bezier(0.3,1.4,0.5,1) 3.6s both; }
.jrn-go .jrn-post-g { animation: jrn-node-in 0.7s ease 4.2s both; }
.jrn-go .jrn-arc    { animation: jrn-arc-draw 1.2s cubic-bezier(0.4,0,0.2,1) 4.4s both; }

/* Revelation text */
.jrn-reveal {
  opacity: 0; padding-top: 60px; padding-bottom: 80px;
}
.jrn-go .jrn-reveal {
  animation: jrn-reveal-in 1s ease 5.0s both;
}
.signal-chip {
  display: flex; align-items: center; gap: 7px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 20px; padding: 6px 14px;
  font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-2);
  letter-spacing: 0.06em; animation: signal-float 3s ease-in-out infinite, rise 0.6s ease both;
}
.sdot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.sdot-warning { background: var(--amber); box-shadow: 0 0 6px var(--amber); }
.sdot-danger  { background: var(--red);  box-shadow: 0 0 6px var(--red); animation: dot-pulse 1.5s ease-in-out infinite; }
.sdot-ok      { background: var(--green); box-shadow: 0 0 6px var(--green); }

/* PLATFORM VISUAL */
.platform-visual {
  position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: 0 40px 80px;
}
.platform-frame {
  border-radius: 16px; overflow: hidden;
  border: 1px solid rgba(255,46,191,0.18);
  box-shadow: 0 0 60px rgba(155,48,217,0.12), 0 0 120px rgba(255,46,191,0.06);
  animation: glow-wave 5s ease infinite;
}
.platform-frame-top {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; background: rgba(17,17,25,0.95);
  border-bottom: 1px solid rgba(255,46,191,0.1);
}
.pf-dot { width: 10px; height: 10px; border-radius: 50%; }
.pf-url {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  color: var(--text-3); letter-spacing: 0.08em; margin-left: 8px;
}
.platform-img-wrap {
  position: relative; overflow: hidden; background: #0a0a14;
}
.pf-content {
  background: rgba(9,9,15,0.97); padding: 24px 20px; overflow: hidden;
}
.pf-section-frame { margin-top: 36px; }
.platform-img {
  width: 100%; display: block;
  filter: hue-rotate(40deg) saturate(1.15) brightness(0.58);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%);
}
.platform-img-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(to bottom, rgba(9,9,15,0.6) 0%, transparent 12%, transparent 85%, rgba(9,9,15,0.8) 100%),
    linear-gradient(135deg, rgba(255,46,191,0.06) 0%, rgba(155,48,217,0.08) 100%);
}
.platform-badge {
  position: absolute; display: flex; align-items: center; gap: 6px;
  background: rgba(9,9,15,0.82); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,46,191,0.22); border-radius: 20px;
  padding: 5px 12px;
  font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-2);
  letter-spacing: 0.06em; animation: badge-float 3s ease-in-out infinite;
}
.platform-badge-tl { top: 16px; left: 16px; animation-delay: 0s; }
.platform-badge-tr { top: 16px; right: 16px; animation-delay: 1.5s; }
.pb-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); animation: dot-pulse 2s ease-in-out infinite; }
.pb-dot-violet { background: var(--pink); box-shadow: 0 0 6px var(--pink); }

/* STATS */
.stats-wrap { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: 0 40px 80px; }
.stats-bar {
  display: grid; grid-template-columns: repeat(3, 1fr);
  border: 1px solid rgba(255,46,191,0.12); border-radius: var(--r-xl); overflow: hidden;
  background: var(--bg-card); animation: border-wave 5s ease infinite;
}
.stat-cell { padding: 32px; text-align: center; border-right: 1px solid var(--border); }
.stat-cell:last-child { border-right: none; }
.stat-num {
  font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 46px; letter-spacing: -0.04em; line-height: 1; margin-bottom: 8px;
  background: linear-gradient(135deg, var(--pink), var(--violet), var(--pink-hi));
  background-size: 200% 200%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: wave-gradient 3.5s ease infinite;
}
.stat-label { font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px; color: var(--text-1); margin-bottom: 4px; }
.stat-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); letter-spacing: 0.08em; text-transform: uppercase; }

/* DIVIDER */
.l-divider { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; height: 1px; background: var(--border); }

/* SECTIONS */
.l-section { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 80px 40px; }
.section-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--pink); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 16px; }
.section-h2 { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: clamp(28px, 4vw, 44px); letter-spacing: -0.03em; color: var(--text-1); line-height: 1.1; margin-bottom: 16px; }
.section-h2 em {
  font-style: normal;
  background: linear-gradient(90deg, var(--pink), var(--violet), var(--pink));
  background-size: 200% 200%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: wave-gradient 4s ease infinite;
}
.section-sub { font-family: 'Outfit', sans-serif; font-size: 16px; color: var(--text-2); line-height: 1.65; max-width: 580px; margin-bottom: 48px; }

/* WORKFLOW */
.workflow-scene {
  position: relative; overflow: hidden;
  border-radius: var(--r-xl); padding: 40px 24px 32px;
  background: var(--bg-card); border: 1px solid rgba(255,46,191,0.1);
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  animation: border-wave 6s ease infinite;
}
.wf-logo-wm {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 52%; height: auto;
  opacity: 0.13; pointer-events: none; z-index: 0;
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, rgba(0,0,0,0.6) 55%, transparent 100%);
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, rgba(0,0,0,0.6) 55%, transparent 100%);
}
.workflow-scene.wf-visible { opacity: 1; transform: translateY(0); }
.workflow-svg { position: relative; z-index: 1; width: 100%; height: auto; display: block; }

/* CHART SECTION with image accent */
.chart-accent-wrap {
  display: grid; grid-template-columns: 180px 1fr; gap: 24px;
  align-items: center; margin-bottom: 48px;
}
.chart-accent-img-col { position: relative; }
.chart-accent-img {
  width: 100%; height: 280px; object-fit: cover; object-position: center;
  border-radius: var(--r-xl);
  filter: hue-rotate(15deg) saturate(1.4) brightness(0.55);
  -webkit-mask-image: radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 80%);
  mask-image: radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 80%);
}

/* WALL CHART */
.wall-chart-wrap { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl); padding: 32px 32px 20px; position: relative; overflow: hidden; }
.wcl-y { position: absolute; left: 10px; top: 50%; transform: translateY(-50%) rotate(-90deg); font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-3); letter-spacing: 0.1em; white-space: nowrap; }
.wall-chart { width: 100%; height: auto; display: block; }
.chart-legend { display: flex; gap: 24px; align-items: center; padding-top: 8px; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-2); letter-spacing: 0.06em; }
.legend-ln { width: 24px; height: 2px; border-radius: 1px; flex-shrink: 0; }

/* PROBLEM CARDS */
.problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.prob-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl); padding: 32px; position: relative; overflow: hidden; transition: border-color 0.3s, transform 0.2s; }
.prob-card:hover { border-color: var(--border-md); transform: translateY(-2px); }
.prob-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; opacity: 0.8; }
.prob-card.wall::before { background: linear-gradient(90deg, var(--amber), #F97316); }
.prob-card.danger::before { background: linear-gradient(90deg, var(--red), #F97316); }
.prob-glow { position: absolute; top: -60px; right: -60px; width: 220px; height: 220px; border-radius: 50%; opacity: 0.07; pointer-events: none; }
.amber-glow { background: radial-gradient(circle, var(--amber) 0%, transparent 70%); }
.red-glow   { background: radial-gradient(circle, var(--red) 0%, transparent 70%); }
.prob-icon { width: 40px; height: 40px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px; }
.wall-icon   { background: var(--amber-dim); }
.danger-icon { background: var(--red-dim); }
.prob-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 19px; letter-spacing: -0.01em; color: var(--text-1); margin-bottom: 12px; }
.prob-desc  { font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--text-2); line-height: 1.65; margin-bottom: 20px; }
.prob-signals { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.prob-signal { font-family: 'JetBrains Mono', monospace; font-size: 9px; padding: 4px 10px; border-radius: 4px; display: inline-block; width: fit-content; letter-spacing: 0.06em; }
.amber-signal { color: var(--amber); background: var(--amber-dim); }
.red-signal   { color: var(--red);   background: var(--red-dim); }
.prob-tag { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 9px; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.08em; text-transform: uppercase; }
.amber-tag { background: var(--amber-dim); color: var(--amber); }
.red-tag   { background: var(--red-dim);   color: var(--red); }

/* TESTIMONIALS */
.t-stage {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  max-width: 1000px; margin: 40px auto 0; padding: 0 40px;
  position: relative; z-index: 1;
}
.t-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl);
  padding: 28px; cursor: pointer; transition: all 0.4s;
  opacity: 0.45; transform: scale(0.975); position: relative; overflow: hidden;
}
.t-card.active {
  opacity: 1; transform: scale(1);
  border-color: rgba(255,46,191,0.25);
  box-shadow: 0 0 32px rgba(255,46,191,0.07);
  animation: border-wave 4s ease infinite;
}
.t-card:hover:not(.active) { opacity: 0.75; transform: scale(0.985); }
.t-qmark { font-family: Georgia, serif; font-size: 64px; line-height: 0.8; color: var(--pink); opacity: 0.25; margin-bottom: 12px; }
.t-body  { font-family: 'Outfit', sans-serif; font-size: 13.5px; color: var(--text-2); line-height: 1.7; margin-bottom: 20px; font-style: italic; }
.t-attr  { display: flex; align-items: center; gap: 12px; }
.t-avatar {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--pink-dim), var(--violet-dim));
  border: 1px solid rgba(255,46,191,0.25);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 11px; color: var(--pink);
}
.t-name { font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px; color: var(--text-1); }
.t-role { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); letter-spacing: 0.05em; margin-top: 2px; }
.t-nav  { display: flex; justify-content: center; gap: 8px; margin-top: 24px; position: relative; z-index: 1; }
.t-dot  { width: 6px; height: 6px; border-radius: 50%; border: none; cursor: pointer; background: var(--border-md); transition: all 0.25s; padding: 0; }
.t-dot.active { background: var(--pink); width: 22px; border-radius: 3px; }

/* ESCAPE TIMELINE */
.escape-grid {
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 0;
  opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease;
}
.escape-grid.esc-visible { opacity: 1; transform: translateY(0); }
.esc-col { padding: 20px; }
.esc-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
.esc-icon { width: 36px; height: 36px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; flex-shrink: 0; }
.red-esc-icon  { background: var(--red-dim);  color: var(--red); }
.pink-esc-icon { background: var(--pink-dim); color: var(--pink); }
.esc-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 16px; color: var(--text-1); }
.esc-sub   { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); letter-spacing: 0.06em; margin-top: 2px; }
.tl-item { display: flex; gap: 12px; margin-bottom: 20px; animation: slide-up 0.4s ease both; }
.tl-week { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.06em; flex-shrink: 0; width: 38px; margin-top: 2px; }
.red-week  { color: var(--red); }
.pink-week { color: var(--pink); }
.tl-con { width: 1px; flex-shrink: 0; margin-top: 10px; }
.red-con  { background: linear-gradient(180deg, rgba(239,68,68,0.35), transparent); }
.pink-con { background: linear-gradient(180deg, rgba(255,46,191,0.35), transparent); }
.tl-body  { flex: 1; }
.tl-title { font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px; color: var(--text-1); margin-bottom: 3px; }
.tl-desc  { font-family: 'Outfit', sans-serif; font-size: 12px; color: var(--text-2); line-height: 1.5; }
.tl-agent { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--pink); background: var(--pink-dim); padding: 2px 7px; border-radius: 3px; display: inline-block; margin-top: 6px; letter-spacing: 0.05em; }
.esc-divider { display: flex; flex-direction: column; align-items: center; padding: 20px 32px; }
.esc-vl { flex: 1; width: 1px; background: var(--border); }
.esc-vs { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 12px; color: var(--text-3); padding: 12px 0; }

/* AGENT SECTION */
.agent-section { overflow: hidden; }
.agent-bg-img {
  position: absolute; top: -40px; right: -80px; width: 380px; height: 380px;
  pointer-events: none; z-index: 0;
}
.agent-bg-img-el {
  width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
  filter: grayscale(1) sepia(1) hue-rotate(280deg) saturate(4) brightness(0.45);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 80%);
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 80%);
}

/* AGENT GRID */
.agent-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px; position: relative; z-index: 1; }
.agent-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-lg);
  cursor: pointer; transition: border-color 0.2s, background 0.2s; overflow: hidden;
}
.agent-card:hover { border-color: rgba(255,46,191,0.2); background: var(--bg-card2); }
.agent-card.a-expanded { border-color: rgba(255,46,191,0.3); background: var(--bg-card2); animation: border-wave 3s ease infinite; }
.agent-inner { padding: 20px; }
.agent-hint { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-3); letter-spacing: 0.08em; text-align: center; padding: 8px; border-top: 1px solid var(--border); background: var(--bg-inset); transition: color 0.15s; }
.agent-card:hover .agent-hint, .agent-card.a-expanded .agent-hint { color: var(--pink); }
.agent-num  { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--pink); letter-spacing: 0.1em; background: var(--pink-dim); border: 1px solid rgba(255,46,191,0.15); padding: 2px 7px; border-radius: 10px; display: inline-block; margin-bottom: 12px; }
.agent-name { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px; color: var(--text-1); margin-bottom: 6px; }
.agent-role { font-family: 'Outfit', sans-serif; font-size: 12px; color: var(--text-2); line-height: 1.5; }
.agent-layer { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-3); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 10px; }
.agent-detail { animation: rise 0.3s ease; }
.agent-detail-hr { height: 1px; background: var(--border); margin: 14px 0 12px; }
.agent-sig { display: flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-2); letter-spacing: 0.04em; margin-bottom: 7px; }
.as-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--pink); flex-shrink: 0; }

/* ORCH CARD */
.orch-card {
  background: rgba(255,46,191,0.05); border: 1px solid rgba(255,46,191,0.15);
  border-radius: var(--r-xl); padding: 36px 40px;
  display: flex; align-items: center; gap: 40px;
  position: relative; overflow: hidden; z-index: 1;
  animation: border-wave 4s ease infinite, glow-wave 4s ease infinite;
}
.orch-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--pink), var(--violet), transparent); animation: wave-gradient 4s ease infinite; background-size: 200% 100%; }
.orch-glow { position: absolute; bottom: -80px; right: -80px; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(255,46,191,0.09) 0%, transparent 70%); pointer-events: none; animation: orb-drift-b 12s ease-in-out infinite; }
.orch-num {
  font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 80px; letter-spacing: -0.05em; line-height: 1; flex-shrink: 0;
  background: linear-gradient(135deg, var(--pink), var(--violet), var(--pink-hi), var(--pink));
  background-size: 300% 300%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: wave-gradient 3s ease infinite;
}
.orch-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; }
.orch-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 22px; letter-spacing: -0.02em; color: var(--text-1); margin-bottom: 8px; }
.orch-desc  { font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--text-2); line-height: 1.6; }

/* ABOUT SECTION */
.about-section { position: relative; overflow: hidden; padding-top: 80px; padding-bottom: 80px; }
.about-logo-watermark {
  position: absolute; right: -6%; top: 60px;
  width: 46%; pointer-events: none; z-index: 0;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.7) 65%, transparent 100%),
                      linear-gradient(to bottom, black 0%, black 60%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.7) 65%, transparent 100%),
              linear-gradient(to bottom, black 0%, black 60%, transparent 100%);
  -webkit-mask-composite: intersect;
  mask-composite: intersect;
}
.about-logo-wm-img { width: 100%; height: auto; opacity: 0.42; }
.about-header { position: relative; z-index: 1; margin-bottom: 40px; }

.about-paras { position: relative; z-index: 1; margin-bottom: 52px; max-width: 780px; }

.about-para {
  font-family: 'Outfit', sans-serif; font-size: 16px; color: var(--text-2);
  line-height: 1.75; margin-bottom: 16px;
}
.about-para:last-of-type { margin-bottom: 0; }

.about-grid {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 56px; align-items: start;
}

.about-content { display: flex; flex-direction: column; }

.about-features {
  display: flex; flex-direction: column; gap: 24px;
}
.about-feat {
  display: flex; gap: 14px; align-items: flex-start;
}
.about-feat-ptr {
  width: 9px; height: 9px; border-radius: 2px;
  transform: rotate(45deg); flex-shrink: 0; margin-top: 5px;
  transition: transform 0.25s, box-shadow 0.25s;
}
.about-feat:hover .about-feat-ptr { transform: rotate(45deg) scale(1.4); }
.about-feat-title {
  font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px;
  color: var(--text-1); margin-bottom: 4px; letter-spacing: -0.01em;
}
.about-feat-desc {
  font-family: 'Outfit', sans-serif; font-size: 13px; color: var(--text-2); line-height: 1.6;
}

.about-stack {
  display: flex; gap: 8px; flex-wrap: wrap;
  margin-top: 32px; padding-top: 24px;
  border-top: 1px solid var(--border);
}
.about-stack-badge {
  display: flex; align-items: center; gap: 6px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--r-sm); padding: 5px 12px;
  font-family: 'JetBrains Mono', monospace; font-size: 8px;
  color: var(--text-3); letter-spacing: 0.08em; text-transform: uppercase;
  transition: border-color 0.2s, color 0.2s;
}
.about-stack-badge:hover { border-color: rgba(255,46,191,0.25); color: var(--text-2); }
.asb-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--pink); box-shadow: 0 0 4px var(--pink);
  flex-shrink: 0; animation: dot-pulse 2.5s ease-in-out infinite;
}

/* Mockup column */
.about-mockup { position: relative; }
.about-frame {
  box-shadow:
    0 0 0 1px rgba(255,46,191,0.15),
    0 20px 60px rgba(155,48,217,0.18),
    0 4px 16px rgba(0,0,0,0.4);
}
.about-img {
  width: 100%; display: block;
  filter: hue-rotate(15deg) saturate(1.35) brightness(0.72);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 90%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 90%, transparent 100%);
}
.about-img-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(to bottom, rgba(9,9,15,0.55) 0%, transparent 14%, transparent 86%, rgba(9,9,15,0.7) 100%),
    linear-gradient(135deg, rgba(255,46,191,0.05) 0%, rgba(155,48,217,0.08) 100%);
}
.about-frame-badge {
  position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 7px;
  background: rgba(9,9,15,0.82); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,46,191,0.22); border-radius: 20px;
  padding: 6px 16px; white-space: nowrap;
  font-family: 'JetBrains Mono', monospace; font-size: 8.5px;
  color: var(--text-2); letter-spacing: 0.06em;
  animation: badge-float 3.5s ease-in-out infinite;
}
.about-frame-glow {
  position: absolute; left: 10%; right: 10%; bottom: -40px; height: 80px;
  background: radial-gradient(ellipse at 50% 0%, rgba(155,48,217,0.25) 0%, transparent 70%);
  border-radius: 50%; filter: blur(20px); pointer-events: none; z-index: -1;
}

@media (max-width: 720px) {
  .about-paras { max-width: 100%; }
  .about-grid { grid-template-columns: 1fr; }
  .about-mockup { display: none; }
}

/* FINAL CTA */
.final-cta { position: relative; z-index: 1; max-width: 780px; margin: 0 auto; padding: 80px 40px 120px; }
.cta-card {
  background: var(--bg-card); border: 1px solid rgba(255,46,191,0.15);
  border-radius: var(--r-xl); padding: 40px 48px 40px 20px;
  position: relative; overflow: hidden;
  animation: border-wave 5s ease infinite, glow-wave 5s ease infinite;
}
.cta-orb { position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 420px; height: 420px; border-radius: 50%; background: radial-gradient(circle, rgba(255,46,191,0.12) 0%, transparent 65%); pointer-events: none; animation: orb-drift-a 12s ease-in-out infinite; }
.cta-inner { display: flex; align-items: flex-start; gap: 24px; position: relative; z-index: 1; }
.cta-logo-col { flex-shrink: 0; display: flex; align-items: flex-start; justify-content: center; margin-top: -16px; }
.cta-logo-img { width: 140px; height: 140px; object-fit: contain; }
.cta-content-col { flex: 1; text-align: left; }
.cta-h3 { position: relative; z-index: 1; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 36px; letter-spacing: -0.03em; color: var(--text-1); margin-bottom: 16px; line-height: 1.15; }
.cta-h3 em {
  font-style: normal;
  background: linear-gradient(90deg, var(--pink), var(--violet), var(--pink));
  background-size: 200% 200%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: wave-gradient 3.5s ease infinite;
}
.cta-sub { position: relative; z-index: 1; font-family: 'Outfit', sans-serif; font-size: 15px; color: var(--text-2); line-height: 1.65; margin-bottom: 36px; max-width: 520px; }
.cta-perms { display: flex; justify-content: center; gap: 20px; margin-top: 24px; flex-wrap: wrap; }
.cta-perm  { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); letter-spacing: 0.06em; text-transform: uppercase; }
.perm-dot  { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }

/* FOOTER */
.l-footer { position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; }
.l-footer-brand { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 16px; letter-spacing: -0.03em; color: var(--text-3); }
.l-footer-brand em {
  font-style: normal;
  background: linear-gradient(90deg, var(--pink-lo), var(--violet));
  background-size: 200% 200%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: wave-gradient 5s ease infinite;
}
.l-footer-note { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-3); letter-spacing: 0.06em; }

/* RESPONSIVE */
@media (max-width: 720px) {
  .problem-grid, .agent-grid, .t-stage { grid-template-columns: 1fr; }
  .escape-grid { grid-template-columns: 1fr; }
  .esc-divider { display: none; }
  .wqb-chess-wrap { display: none; }
  .wqb-stats { flex-direction: column; }
  .wqb-vr { display: none; }
  .wqb-stat:not(:first-child) { padding-left: 0; padding-top: 20px; border-top: 1px solid var(--border); }
  .stats-bar { grid-template-columns: 1fr; }
  .stat-cell { border-right: none; border-bottom: 1px solid var(--border); }
  .stat-cell:last-child { border-bottom: none; }
  .hero-h1 { font-size: 36px; }
  .l-nav { padding: 0 20px; }
  .l-section { padding: 60px 20px; }
  .orch-card { flex-direction: column; gap: 20px; padding: 28px; }
  .cta-card { padding: 40px 28px; }
  .chart-accent-wrap { grid-template-columns: 1fr; }
  .chart-accent-img-col { display: none; }
  .agent-bg-img { display: none; }
}
`
