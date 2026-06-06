#!/usr/bin/env python3
"""
One-time OAuth setup for Qnsult Gmail + Calendar access.

Run this once:  python setup_oauth.py

It opens a browser, asks you to sign in with the consultant's Google account,
and saves credentials to token.json. The agents read token.json on every run
and auto-refresh when the access token expires.

Prerequisites (before running this):
  1. In Google Cloud Console → APIs & Services → Credentials
     → Create OAuth 2.0 Client ID → Application type: Desktop App
     → Download JSON → rename file to credentials.json
     → Place credentials.json in this directory (next to this script)
  2. In Google Cloud Console → APIs & Services → Library, enable:
     - Gmail API
     - Google Calendar API
  3. pip install -r requirements.txt
"""

import os
import sys
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/calendar.readonly',
]

CREDS_PATH = os.environ.get('GOOGLE_OAUTH_CREDENTIALS_PATH', 'credentials.json')
TOKEN_PATH = os.environ.get('GMAIL_TOKEN_PATH', 'token.json')


def main():
    if not os.path.exists(CREDS_PATH):
        print(f"\n✗  {CREDS_PATH} not found.")
        print("\nTo fix:")
        print("  1. Go to https://console.cloud.google.com/apis/credentials")
        print("  2. Create OAuth 2.0 Client ID → Desktop App")
        print("  3. Download JSON → rename to credentials.json → place here")
        sys.exit(1)

    print("\nOpening browser for Google OAuth consent...")
    print("Sign in with the consultant's Google account (the one whose Gmail you want to read).\n")

    flow = InstalledAppFlow.from_client_secrets_file(CREDS_PATH, SCOPES)
    creds = flow.run_local_server(port=0)

    with open(TOKEN_PATH, 'w') as f:
        f.write(creds.to_json())

    print(f"\n✓  token.json saved. OAuth setup complete.")
    print(f"\nYou can now run the agents:")
    print(f"  cd consultiq && PYTHONPATH=. adk web")


if __name__ == '__main__':
    main()
