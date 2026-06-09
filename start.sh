#!/bin/sh
set -e

# Reconstruct .env from Cloud Run environment variables
cat > /app/.env << EOF
MDB_MCP_API_CLIENT_ID=${MDB_MCP_API_CLIENT_ID}
MDB_MCP_API_CLIENT_SECRET=${MDB_MCP_API_CLIENT_SECRET}
MDB_MCP_CONNECTION_STRING=${MDB_MCP_CONNECTION_STRING}
GOOGLE_CLOUD_PROJECT=${GOOGLE_CLOUD_PROJECT}
GOOGLE_CLOUD_LOCATION=${GOOGLE_CLOUD_LOCATION}
GOOGLE_GENAI_USE_VERTEXAI=${GOOGLE_GENAI_USE_VERTEXAI}
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
EOF

# Write OAuth files from Secret Manager env vars (Cloud Run can't mount two
# secrets as files in the same directory, so we use env var mode instead)
printf '%s' "${GMAIL_TOKEN_JSON}" > /app/token.json
printf '%s' "${GOOGLE_CREDS_JSON}" > /app/credentials.json

export GMAIL_TOKEN_PATH=/app/token.json
# credentials.json is OAuth client-only (for setup); Vertex AI uses Cloud Run workload identity ADC

exec adk api_server . --port ${PORT:-8080} --host 0.0.0.0
