import { NextRequest, NextResponse } from 'next/server'

const ADK_BASE = process.env.ADK_SERVER_URL ?? 'http://localhost:8000'
const APP_NAME = 'agents'

// Extract the last text content produced by portfolio_chat_agent from ADK event stream
function extractReply(events: unknown[]): string | null {
  if (!Array.isArray(events)) return null
  // Walk events in reverse — find the last model turn from portfolio_chat_agent
  for (let i = events.length - 1; i >= 0; i--) {
    const ev = events[i] as Record<string, unknown>
    const author = ev.author as string | undefined
    if (author !== 'portfolio_chat_agent') continue
    const content = ev.content as Record<string, unknown> | undefined
    if (!content) continue
    const parts = content.parts as Array<Record<string, unknown>> | undefined
    if (!parts) continue
    const text = parts.map(p => p.text as string ?? '').join('').trim()
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

  // Ensure the session exists in ADK (idempotent — creates only if new)
  try {
    await fetch(`${ADK_BASE}/apps/${APP_NAME}/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
  } catch {
    return NextResponse.json(
      { error: 'ADK server unreachable — run `adk start` in the Terminal tab first.' },
      { status: 503 }
    )
  }

  // Send the message and get agent events
  let runRes: Response
  try {
    runRes = await fetch(
      `${ADK_BASE}/apps/${APP_NAME}/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}/runs`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_message: {
            role: 'user',
            parts: [{ text: message }],
          },
        }),
        signal: AbortSignal.timeout(60_000),
      }
    )
  } catch {
    return NextResponse.json(
      { error: 'ADK server unreachable — run `adk start` in the Terminal tab first.' },
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
