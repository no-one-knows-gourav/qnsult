'use client'

const GMAIL_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

async function gmailFetch(accessToken: string, path: string, options?: RequestInit) {
  const res = await fetch(`${GMAIL_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) throw new Error(`Gmail API error: ${res.status} ${await res.text()}`)
  return res.json()
}

export async function listThreads(accessToken: string, query = '', maxResults = 20) {
  const params = new URLSearchParams({ maxResults: String(maxResults), ...(query && { q: query }) })
  return gmailFetch(accessToken, `/threads?${params}`)
}

export async function getThread(accessToken: string, threadId: string) {
  return gmailFetch(accessToken, `/threads/${threadId}?format=full`)
}

export async function sendEmail(accessToken: string, to: string, subject: string, body: string) {
  const raw = btoa(
    `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}`
  ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return gmailFetch(accessToken, '/messages/send', {
    method: 'POST',
    body: JSON.stringify({ raw }),
  })
}

export async function createDraft(accessToken: string, to: string, subject: string, body: string) {
  const raw = btoa(
    `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}`
  ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return gmailFetch(accessToken, '/drafts', {
    method: 'POST',
    body: JSON.stringify({ message: { raw } }),
  })
}

export async function labelMessage(accessToken: string, messageId: string, labelIds: string[]) {
  return gmailFetch(accessToken, `/messages/${messageId}/modify`, {
    method: 'POST',
    body: JSON.stringify({ addLabelIds: labelIds }),
  })
}

export async function listLabels(accessToken: string) {
  return gmailFetch(accessToken, '/labels')
}
