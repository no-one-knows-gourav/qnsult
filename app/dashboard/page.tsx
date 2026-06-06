'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const supabase = createClient()
  const router = useRouter()
  const [userInitial, setUserInitial] = useState('S')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const auth = supabase.auth
    auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/'); return }
      const name = user.user_metadata?.full_name || user.email || 'S'
      setUserInitial(name.charAt(0).toUpperCase())
      setUserName(name.split(' ')[0])
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
            <div className="user-avatar" title={userName}>{userInitial}</div>
            <button className="btn btn-red" onClick={signOut} style={{ fontSize: 11, padding: '6px 12px' }}>Sign out</button>
          </div>
        </header>

        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="nav-section">
            {[
              { ico: '⌂', label: 'Home' },
              { ico: '◎', label: 'Clients' },
              { ico: '⟁', label: 'Engagements' },
              { ico: '◈', label: 'Action Items', count: '3', countClass: 'nc-red' },
              { ico: '⬡', label: 'Agent Events' },
              { ico: '▦', label: 'Portfolio Intelligence', active: true },
            ].map((item) => (
              <div key={item.label} className={`nav-link${item.active ? ' active' : ''}`}>
                <span className="nav-ico">{item.ico}</span>
                {item.label}
                {item.count && <span className={`nav-count ${item.countClass}`}>{item.count}</span>}
              </div>
            ))}
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Risk</div>
            <div className="nav-link"><span className="nav-ico">⚠</span>Stall Detection<span className="nav-count nc-red">2</span></div>
            <div className="nav-link"><span className="nav-ico">◌</span>AI Danger Zone<span className="nav-count nc-amber">5</span></div>
            <div className="nav-link"><span className="nav-ico">⊕</span>Competitive Risk</div>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Workstation</div>
            <div className="nav-link"><span className="nav-ico">◇</span>Pattern Library<span className="nav-count nc-pink">14</span></div>
            <div className="nav-link"><span className="nav-ico">⚙</span>Settings</div>
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
        <main className="main">

          {/* Page header */}
          <div className="page-head">
            <div>
              <div className="page-title">Portfolio <span>Intelligence</span></div>
              <div className="page-sub">Friday, 6 June 2026 · W-23 · Synced 07:31 UTC</div>
            </div>
            <div className="head-actions">
              <button className="btn btn-ghost">≡ Filters</button>
              <button className="btn btn-ghost">⊞ This Month</button>
              <button className="btn btn-pink">▶ Run Momentum</button>
            </div>
          </div>

          {/* Filter row */}
          <div className="filter-row">
            <div className="filter-chip active"><span className="chip-dot" />All Clients (11)</div>
            <div className="filter-chip">Stalling (2)</div>
            <div className="filter-chip">At Risk (3)</div>
            <div className="filter-chip">Accelerating (4)</div>
          </div>

          {/* KPI row */}
          <div className="kpi-row">
            <div className="kpi green-kpi">
              <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--green)' }}>↗</div><div className="kpi-value">4</div><span className="kpi-delta delta-up">+2 wk</span></div>
              <div className="kpi-label">Accelerating Accounts</div>
            </div>
            <div className="kpi amber-kpi">
              <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--amber)' }}>⚠</div><div className="kpi-value">3</div><span className="kpi-delta delta-dn">+1</span></div>
              <div className="kpi-label">At Risk Accounts</div>
            </div>
            <div className="kpi red-kpi">
              <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--red)' }}>↓</div><div className="kpi-value">2</div><span className="kpi-delta delta-flat">—</span></div>
              <div className="kpi-label">Stalling Accounts</div>
            </div>
            <div className="kpi indigo-kpi">
              <div className="kpi-main-row"><div className="kpi-icon-wrap" style={{ color: 'var(--indigo)' }}>⬡</div><div className="kpi-value">12</div><span className="kpi-delta delta-up">94%</span></div>
              <div className="kpi-label">Agents Live</div>
            </div>
            <div className="kpi">
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
                  <div className="tab">Δ Trend</div>
                  <div className="tab">AI Risk</div>
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
                    <div className="client-row" key={c.name}>
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

          {/* Quadrant scatter */}
          <div className="card quadrant-card">
            <div className="card-hd">
              <div className="card-hd-title"><div className="title-pip" />Two-Axis Portfolio Map</div>
              <div className="tab-group">
                <div className="tab active">Live</div>
                <div className="tab">Δ WoW</div>
                <div className="tab">AI Exposure</div>
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
                  <text x="432" y="56" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)">Pinnacle</text>
                  <circle cx="389" cy="80" r="8" fill="rgba(255,46,191,0.1)" stroke="#FF2EBF" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <circle cx="389" cy="80" r="4" fill="#FF2EBF" fillOpacity="0.8"/>
                  <text x="399" y="77" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)">Meridian</text>
                  <circle cx="343" cy="106" r="8" fill="rgba(129,140,248,0.1)" stroke="#818CF8" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <circle cx="343" cy="106" r="4" fill="#818CF8" fillOpacity="0.8"/>
                  <text x="353" y="103" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)">Apex Dyn.</text>
                  <circle cx="318" cy="88" r="8" fill="rgba(129,140,248,0.1)" stroke="#818CF8" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <circle cx="318" cy="88" r="4" fill="#818CF8" fillOpacity="0.8"/>
                  <text x="328" y="85" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)">NovaTech</text>
                  <circle cx="247" cy="154" r="8" fill="rgba(155,48,217,0.1)" stroke="#9B30D9" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <circle cx="247" cy="154" r="4" fill="#9B30D9" fillOpacity="0.8"/>
                  <text x="257" y="151" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)">Stratford</text>
                  <circle cx="276" cy="175" r="8" fill="rgba(155,48,217,0.1)" stroke="#9B30D9" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <circle cx="276" cy="175" r="4" fill="#9B30D9" fillOpacity="0.8"/>
                  <text x="286" y="172" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)">Lumis</text>
                  <circle cx="180" cy="189" r="8" fill="rgba(245,158,11,0.1)" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <circle cx="180" cy="189" r="4" fill="#F59E0B" fillOpacity="0.8"/>
                  <text x="190" y="186" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)">Vantage</text>
                  <circle cx="163" cy="203" r="8" fill="rgba(245,158,11,0.1)" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <circle cx="163" cy="203" r="4" fill="#F59E0B" fillOpacity="0.8"/>
                  <text x="173" y="200" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)">Redwood</text>
                  <circle cx="213" cy="212" r="8" fill="rgba(245,158,11,0.1)" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <circle cx="213" cy="212" r="4" fill="#F59E0B" fillOpacity="0.8"/>
                  <text x="223" y="209" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)">Corestone</text>
                  <g className="qpulse"><circle cx="121" cy="261" r="12" fill="rgba(239,68,68,0.06)"/></g>
                  <circle cx="121" cy="261" r="8" fill="rgba(239,68,68,0.12)" stroke="#EF4444" strokeWidth="1.5"/>
                  <circle cx="121" cy="261" r="4" fill="#EF4444"/>
                  <text x="131" y="258" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="#EF4444">Halcyon ⚠</text>
                  <circle cx="138" cy="270" r="8" fill="rgba(239,68,68,0.12)" stroke="#EF4444" strokeWidth="1.5"/>
                  <circle cx="138" cy="270" r="4" fill="#EF4444"/>
                  <text x="148" y="281" fontFamily="Outfit" fontSize="9" fontWeight="700" fill="#EF4444">Drift ⚠</text>
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
                  <div key={r.name} className="qside-item" style={r.highlight ? { borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' } : {}}>
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
                  <div key={a.client + a.date} className={`action-item urg-${a.urgency}`}>
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
                  <div className="stream-item" key={i}>
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

        </main>
      </div>
    </>
  )
}
