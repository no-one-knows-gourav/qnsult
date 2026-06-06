import os
from datetime import datetime, timedelta, timezone
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

CALENDAR_SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']


def _calendar():
    token_path = os.environ.get('GMAIL_TOKEN_PATH', 'token.json')
    creds = Credentials.from_authorized_user_file(token_path, CALENDAR_SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(token_path, 'w') as f:
            f.write(creds.to_json())
    return build('calendar', 'v3', credentials=creds)


def list_calendar_events(
    query: str = '',
    days_back: int = 60,
    days_forward: int = 14,
    max_results: int = 50,
) -> dict:
    """List calendar events, optionally filtered by a text search.

    Args:
        query: Text search across event title and description
        days_back: How many past days to include (default 60)
        days_forward: How many future days to include (default 14)
        max_results: Maximum events to return

    Returns:
        dict with 'events' list and 'total' count. Each event has id, summary,
        start, end, attendees, attendee_count, description, location.
    """
    now = datetime.now(timezone.utc)
    kwargs = {
        'calendarId': 'primary',
        'timeMin': (now - timedelta(days=days_back)).isoformat(),
        'timeMax': (now + timedelta(days=days_forward)).isoformat(),
        'maxResults': max_results,
        'singleEvents': True,
        'orderBy': 'startTime',
    }
    if query:
        kwargs['q'] = query

    result = _calendar().events().list(**kwargs).execute()
    events = []
    for e in result.get('items', []):
        attendees = [a.get('email', '') for a in e.get('attendees', [])]
        events.append({
            'event_id': e.get('id', ''),
            'summary': e.get('summary', 'No title'),
            'start': e.get('start', {}).get('dateTime', e.get('start', {}).get('date', '')),
            'end': e.get('end', {}).get('dateTime', e.get('end', {}).get('date', '')),
            'attendees': attendees,
            'attendee_count': len(attendees),
            'description': e.get('description', '')[:500],
            'location': e.get('location', ''),
        })

    return {'events': events, 'total': len(events)}


def get_calendar_event(event_id: str) -> dict:
    """Get full details of a specific calendar event.

    Args:
        event_id: The Google Calendar event ID

    Returns:
        dict with full event detail including all attendees with response status
    """
    e = _calendar().events().get(calendarId='primary', eventId=event_id).execute()
    attendees = [
        {
            'email': a.get('email', ''),
            'displayName': a.get('displayName', ''),
            'responseStatus': a.get('responseStatus', ''),
        }
        for a in e.get('attendees', [])
    ]
    return {
        'event_id': e.get('id', ''),
        'summary': e.get('summary', ''),
        'start': e.get('start', {}),
        'end': e.get('end', {}),
        'attendees': attendees,
        'description': e.get('description', ''),
        'location': e.get('location', ''),
        'organizer': e.get('organizer', {}),
    }
