import { NextRequest, NextResponse } from 'next/server'

const ADK_BASE = process.env.ADK_SERVER_URL ?? 'http://localhost:8000'
const APP_NAME = 'agents'

function extractReply(events: unknown[]): string | null {
  if (!Array.isArray(events)) return null
  // Walk in reverse — take the last meaningful text from any agent
  for (let i = events.length - 1; i >= 0; i--) {
    const ev = events[i] as Record<string, unknown>
    const content = ev.content as Record<string, unknown> | undefined
    if (!content) continue
    const parts = content.parts as Array<Record<string, unknown>> | undefined
    if (!parts) continue
    const text = parts.map(p => (p.text as string) ?? '').join('').trim()
    if (text) return text
  }
  return null
}

export async function POST(req: NextRequest) {
  const {
    patternName,
    trigger,
    category,
    difficulty,
    owner,
    successRate,
    deployments,
    sessionId,
    userId = 'dashboard-user',
  } = await req.json() as {
    patternName: string
    trigger: string
    category: string
    difficulty: string
    owner: string
    successRate: string
    deployments: number
    sessionId: string
    userId?: string
  }

  if (!patternName || !sessionId) {
    return NextResponse.json({ error: 'patternName and sessionId required' }, { status: 400 })
  }

  // Ensure ADK session exists (idempotent)
  try {
    await fetch(
      `${ADK_BASE}/apps/${APP_NAME}/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) }
    )
  } catch {
    return NextResponse.json(
      { error: 'ADK server unreachable — run `adk start` in the Terminal tab first.' },
      { status: 503 }
    )
  }

  const message = `Arm the following consulting strategy as an active deployment trigger in the pattern library:

Pattern: ${patternName}
Category: ${category}
Trigger condition: ${trigger}
Difficulty: ${difficulty}
Owner role: ${owner}
Historical success rate: ${successRate}
Total deployments: ${deployments}

Please do the following:
1. Use mongo_upsert to record this in the 'pattern_library' collection: { pattern_name: "${patternName}", category: "${category}", status: "armed", trigger: "${trigger}", armed_at: "<now ISO>" }
2. Use mongo_upsert to update AG-11 in 'agent_status': { agent_id: "AG-11", status: "Active", last_action: "Pattern armed: ${patternName} — will trigger on: ${trigger}", updated_at: "<now ISO>" }

Confirm when both writes are done and tell me the pattern is live.`

  let runRes: Response
  try {
    runRes = await fetch(
      `${ADK_BASE}/apps/${APP_NAME}/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}/runs`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_message: { role: 'user', parts: [{ text: message }] } }),
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
      { error: 'Agent returned no confirmation. Check ADK server logs.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ reply })
}
