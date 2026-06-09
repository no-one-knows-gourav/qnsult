import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADK_BASE = process.env.ADK_SERVER_URL ?? 'http://localhost:8000'
const APP_NAME = 'agents'
const CRON_SECRET = process.env.CRON_SECRET ?? ''

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

/** Clear stale agent-generated rows before a fresh run so the UI shows only current output. */
async function flushStale(clientId?: string | null) {
  try {
    const sb = adminSupabase()
    if (clientId) {
      await sb.from('action_items').delete().eq('client_id', clientId).eq('completed', false)
      await sb.from('dashboard_queue').delete().filter('payload->>client_id', 'eq', clientId)
      await sb.from('gmail_threads').delete().eq('client_id', clientId).eq('summary', 'DRAFT')
    } else {
      // Triage: clear all pending agent output
      await sb.from('action_items').delete().eq('completed', false)
      await sb.from('dashboard_queue').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await sb.from('gmail_threads').delete().eq('summary', 'DRAFT')
    }
  } catch {
    // Non-fatal — run continues even if flush fails
  }
}

function extractReply(events: unknown[]): string | null {
  if (!Array.isArray(events)) return null
  for (let i = events.length - 1; i >= 0; i--) {
    const ev = events[i] as Record<string, unknown>
    const parts = ((ev.content as Record<string, unknown> | undefined)?.parts as Array<Record<string, unknown>> | undefined)
    const text = parts?.map(p => p.text as string ?? '').join('').trim()
    if (text) return text
  }
  return null
}

async function ensureSession(userId: string, sessionId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${ADK_BASE}/apps/${APP_NAME}/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }
    )
    return res.ok || res.status === 409
  } catch {
    return false
  }
}

function makeRunBody(userId: string, sessionId: string, message: string): string {
  return JSON.stringify({
    appName: APP_NAME,
    userId,
    sessionId,
    newMessage: { role: 'user', parts: [{ text: message }] },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    mode: 'triage' | 'client'
    clientName?: string
    clientId?: string | null
    sessionId?: string
    userId?: string
  }

  const { mode, clientName, clientId, userId = 'dashboard-user' } = body
  const sessionId = body.sessionId ?? `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  // Cron requests may supply an optional secret — reject only if the header is present but wrong
  const cronHeader = req.headers.get('x-cron-secret')
  if (cronHeader && CRON_SECRET && cronHeader !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sessionOk = await ensureSession(userId, sessionId)
  if (!sessionOk) {
    return NextResponse.json(
      { error: 'ADK server unreachable — check that qnsult-adk is running on Cloud Run.' },
      { status: 503 }
    )
  }

  const message =
    mode === 'triage'
      ? 'run daily triage'
      : `analyse client ${clientName ?? clientId ?? 'unknown'}`

  const runBody = makeRunBody(userId, sessionId, message)
  const headers = { 'Content-Type': 'application/json' }

  if (mode === 'triage') {
    // Flush stale items from previous run, then fire-and-forget.
    // Agents will repopulate action_items + dashboard_queue fresh.
    await flushStale()
    void fetch(`${ADK_BASE}/run`, {
      method: 'POST',
      headers,
      body: runBody,
      signal: AbortSignal.timeout(290_000),
    }).catch(() => {})

    return NextResponse.json(
      { status: 'started', message: 'Triage running — dashboard will update automatically as agents complete each client' },
      { status: 202 }
    )
  }

  // Single-client: flush that client's stale items, then wait up to 120s
  await flushStale(clientId)
  try {
    const res = await fetch(`${ADK_BASE}/run`, {
      method: 'POST',
      headers,
      body: runBody,
      signal: AbortSignal.timeout(120_000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText)
      return NextResponse.json({ error: `ADK error: ${errText}` }, { status: 502 })
    }

    const events = await res.json() as unknown[]
    const reply = extractReply(events)

    return NextResponse.json({
      message: reply
        ? `Analysis complete — ${reply.slice(0, 140)}${reply.length > 140 ? '…' : ''}`
        : `Analysis for ${clientName} running in background — dashboard will update shortly`,
    })
  } catch {
    return NextResponse.json({
      message: `Analysis for ${clientName} is running — the dashboard will update as agents complete`,
    })
  }
}
