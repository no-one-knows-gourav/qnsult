FROM python:3.12-slim

# Node.js is required — mongo_tools.py spawns the mongodb-mcp-server binary
RUN apt-get update && apt-get install -y nodejs npm curl && rm -rf /var/lib/apt/lists/*
# Install globally so mongo_tools.py can run it as a direct binary (~0.5-1.5s startup)
# without npm package resolution overhead per call
RUN npm install -g mongodb-mcp-server && \
    mongodb-mcp-server --version 2>/dev/null || true

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy agent package only — .env, token.json, credentials.json come from Cloud Run secrets/env
COPY agents/ ./agents/
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8080
CMD ["./start.sh"]
