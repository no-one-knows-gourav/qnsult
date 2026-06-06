import os
import base64
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

GMAIL_SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.compose',
]


def _gmail():
    token_path = os.environ.get('GMAIL_TOKEN_PATH', 'token.json')
    creds = Credentials.from_authorized_user_file(token_path, GMAIL_SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(token_path, 'w') as f:
            f.write(creds.to_json())
    return build('gmail', 'v1', credentials=creds)


def list_gmail_threads(query: str, max_results: int = 20) -> dict:
    """Search Gmail threads using a Gmail search query string.

    Args:
        query: Gmail search query, e.g. 'from:client@company.com after:2024/01/01'
        max_results: Max number of threads to return (default 20)

    Returns:
        dict with 'threads' (list of {threadId, snippet}) and 'resultSizeEstimate'
    """
    result = _gmail().users().threads().list(
        userId='me', q=query, maxResults=max_results
    ).execute()
    return {
        'threads': result.get('threads', []),
        'resultSizeEstimate': result.get('resultSizeEstimate', 0),
    }


def get_gmail_thread(thread_id: str) -> dict:
    """Get full content of a Gmail thread including all messages.

    Args:
        thread_id: Gmail thread ID

    Returns:
        dict with thread messages, each containing sender, subject, date, snippet, body
    """
    thread = _gmail().users().threads().get(
        userId='me', id=thread_id, format='full'
    ).execute()

    messages = []
    for msg in thread.get('messages', []):
        headers = {h['name']: h['value'] for h in msg['payload'].get('headers', [])}
        body = ''
        payload = msg['payload']
        if 'parts' in payload:
            for part in payload['parts']:
                if part['mimeType'] == 'text/plain' and 'data' in part.get('body', {}):
                    body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8', errors='ignore')
                    break
        elif 'data' in payload.get('body', {}):
            body = base64.urlsafe_b64decode(payload['body']['data']).decode('utf-8', errors='ignore')

        messages.append({
            'message_id': msg['id'],
            'sender': headers.get('From', ''),
            'to': headers.get('To', ''),
            'subject': headers.get('Subject', ''),
            'date': headers.get('Date', ''),
            'snippet': msg.get('snippet', ''),
            'body': body[:2000],
        })

    return {
        'thread_id': thread_id,
        'messages': messages,
        'message_count': len(messages),
    }


def create_gmail_draft(to: str, subject: str, body: str, cc: str = '') -> dict:
    """Create a Gmail draft. NEVER sends automatically — requires human approval.

    Args:
        to: Recipient email address
        subject: Email subject line
        body: Plain text email body
        cc: Optional CC addresses (comma-separated)

    Returns:
        dict with draft_id and confirmation that it is saved as a draft only
    """
    lines = [f'To: {to}', f'Subject: {subject}']
    if cc:
        lines.append(f'Cc: {cc}')
    lines += ['', body]
    raw = base64.urlsafe_b64encode('\n'.join(lines).encode()).decode()

    draft = _gmail().users().drafts().create(
        userId='me', body={'message': {'raw': raw}}
    ).execute()

    return {
        'status': 'draft_created',
        'draft_id': draft['id'],
        'note': 'Saved to Gmail Drafts. Awaiting human review — will NOT send automatically.',
    }
