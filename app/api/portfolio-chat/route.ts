import { NextRequest, NextResponse } from 'next/server'

const ADK_BASE = process.env.ADK_SERVER_URL ?? 'http://localhost:8000'
const APP_NAME = 'agents'

function extractReply(events: unknown[]): string | null {
  if (!Array.isArray(events)) return null
  // First pass: prefer portfolio_chat_agent's own reply
  for (let i = events.length - 1; i >= 0; i--) {
    const ev = events[i] as Record<string, unknown>
    if ((ev.author as string | undefined) !== 'portfolio_chat_agent') continue
    const parts = ((ev.content as Record<string, unknown> | undefined)?.parts as Array<Record<string, unknown>> | undefined)
    const text = parts?.map(p => p.text as string ?? '').join('').trim()
    if (text) return text
  }
  // Fallback: last text from any agent (handles cases where momentum_agent replies directly)
  for (let i = events.length - 1; i >= 0; i--) {
    const ev = events[i] as Record<string, unknown>
    const parts = ((ev.content as Record<string, unknown> | undefined)?.parts as Array<Record<string, unknown>> | undefined)
    const text = parts?.map(p => p.text as string ?? '').join('').trim()
    if (text) return text
  }
  return null
}

export async function POST(req: NextRequest) {
  const { message, sessionId, userId = 'dashboard-user' } = await req.json() as {
    message: string
    sessionId: string
    userId?: string
  }

  if (!message?.trim() || !sessionId) {
    return NextResponse.json({ error: 'message and sessionId required' }, { status: 400 })
  }

  // Ensure the session exists (idempotent)
  try {
    await fetch(
      `${ADK_BASE}/apps/${APP_NAME}/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }
    )
  } catch {
    return NextResponse.json(
      { error: 'ADK server unreachable — check that qnsult-adk is running.' },
      { status: 503 }
    )
  }

  // ADK 2.x: POST /run with appName/userId/sessionId in body
  let runRes: Response
  try {
    runRes = await fetch(`${ADK_BASE}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appName: APP_NAME,
        userId,
        sessionId,
        newMessage: { role: 'user', parts: [{ text: message }] },
      }),
      signal: AbortSignal.timeout(60_000),
    })
  } catch {
    return NextResponse.json(
      { error: 'ADK server unreachable — check that qnsult-adk is running.' },
      { status: 503 }
    )
  }

  if (!runRes.ok) {
    const errText = await runRes.text().catch(() => runRes.statusText)
    return NextResponse.json({ error: `ADK error: ${errText}` }, { status: 502 })
  }

  const events = await runRes.json() as unknown[]
  const reply = extractReply(events)

  if (!reply) {
    return NextResponse.json(
      { error: 'Agent returned no text. Check ADK server logs.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ reply })
}
