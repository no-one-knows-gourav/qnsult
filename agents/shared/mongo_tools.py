"""
MongoDB MCP tools — per-call MCP session via subprocess.

On Cloud Run, 'mongodb-mcp-server' is globally installed (npm install -g).
Direct binary startup: ~0.5-1.5s per call.

On local dev, falls back to 'npx -y mongodb-mcp-server@latest' which uses
the npx cache (~2-3s with cached package, ~15-20s on first cold download).

The key improvement vs the original: we use the direct binary on production,
eliminating npm package resolution overhead from every single call.
"""
import asyncio
import json
import os
import shutil

from dotenv import dotenv_values
from mcp.client.stdio import StdioServerParameters, stdio_client
from mcp import ClientSession

_ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".env")

# Collections automatically mirrored to Supabase on write
_MIRROR_UPSERT = {"agent_status", "client_scores", "engagements"}
_MIRROR_INSERT = {"competitive_threats", "momentum_history", "dashboard_queue", "outreach_drafts"}

# Single-user hackathon setup — profile id for sgsahoo77@gmail.com
_PROFILE_USER_ID = "5e904f15-f2ed-4bb6-80ab-3553abe24832"

# Use the installed binary if available (Cloud Run), fall back to npx (local dev)
_MDB_BINARY = shutil.which("mongodb-mcp-server")


def _params() -> StdioServerParameters:
    env = dotenv_values(_ENV_PATH)
    if _MDB_BINARY:
        # Direct binary — no npm resolution overhead (~0.5-1.5s startup)
        cmd, args = _MDB_BINARY, []
    else:
        # npx fallback — uses cache if available (~2-3s), downloads if not
        cmd, args = "npx", ["-y", "mongodb-mcp-server@latest"]
    return StdioServerParameters(
        command=cmd,
        args=args,
        env={
            "MDB_MCP_API_CLIENT_ID":     env.get("MDB_MCP_API_CLIENT_ID",     os.environ.get("MDB_MCP_API_CLIENT_ID", "")),
            "MDB_MCP_API_CLIENT_SECRET": env.get("MDB_MCP_API_CLIENT_SECRET", os.environ.get("MDB_MCP_API_CLIENT_SECRET", "")),
            "MDB_MCP_CONNECTION_STRING": env.get("MDB_MCP_CONNECTION_STRING", os.environ.get("MDB_MCP_CONNECTION_STRING", "")),
            "PATH": os.environ.get("PATH", ""),
        },
    )


async def _call(tool: str, args: dict) -> str:
    # Capture result BEFORE exiting the context managers.
    # The anyio stdout_reader raises BrokenResourceError on teardown — that's
    # benign noise from the subprocess closing; we suppress it if the call succeeded.
    result_text: str | None = None
    try:
        async with stdio_client(_params()) as (r, w):
            async with ClientSession(r, w) as session:
                await session.initialize()
                result = await session.call_tool(tool, args)
                content = result.content
                if content and hasattr(content[0], "text"):
                    result_text = content[0].text
                else:
                    result_text = json.dumps([getattr(c, "text", str(c)) for c in content])
    except Exception as e:
        if result_text is None:
            result_text = f"MongoDB MCP error: {e}"
        # else: exception is cleanup noise after a successful call — ignore
    return result_text


# ── Supabase mirror helpers ───────────────────────────────────────────────────

async def _mirror_upsert(collection: str, data: dict) -> None:
    try:
        from agents.shared.supabase_tools import supabase_upsert
        on_conflict = "agent_id" if collection == "agent_status" else "client_id"
        await supabase_upsert(collection, data, on_conflict=on_conflict)
    except Exception:
        pass


def _map_urgency(raw) -> str:
    if isinstance(raw, str) and raw in ("crit", "high", "medium", "low"):
        return raw
    if isinstance(raw, (int, float)):
        if raw >= 4: return "crit"
        if raw == 3: return "high"
        return "medium"
    return "medium"


async def _mirror_insert(collection: str, data: dict) -> None:
    try:
        import uuid
        from agents.shared.supabase_tools import supabase_insert
        if collection == "outreach_drafts":
            # Mirror agent-created drafts into gmail_threads so the Mails tab shows them.
            # summary="DRAFT" is used by flushStale() to identify agent-generated rows.
            draft_type_label = data.get("draft_type", "draft").replace("_", " ").title()
            await supabase_insert("gmail_threads", {
                "id":          str(uuid.uuid4()),
                "user_id":     _PROFILE_USER_ID,
                "thread_id":   data.get("draft_id", f"draft-{uuid.uuid4()}"),
                "client_id":   data.get("client_id"),
                "subject":     data.get("subject", "(no subject)"),
                "sender":      "sgsahoo77@gmail.com",
                "preview":     f"[{draft_type_label}] — awaiting your approval in Gmail Drafts",
                "summary":     "DRAFT",
                "received_at": data.get("created_at"),
            })
            return  # raw outreach_drafts row stays in MongoDB only
        if collection == "dashboard_queue":
            action_text = data.get("action_text", "")
            if action_text:
                # Write a live action item so the dashboard panel reflects agent output
                await supabase_insert("action_items", {
                    "id":           str(uuid.uuid4()),
                    "client_id":    data.get("client_id"),
                    "description":  action_text,
                    "urgency":      _map_urgency(data.get("urgency")),
                    "due_date":     data.get("deadline"),
                    "source_agent": data.get("source_agent", "unknown"),
                    "owner":        data.get("owner", "Account team"),
                    "completed":    False,
                })
            # Also write the raw queue event — Realtime subscription uses this to
            # trigger dashboard refreshes and show the notification badge
            data = {
                "agent_id":   data.get("source_agent", "unknown"),
                "event_type": "alert",
                "payload": {
                    "client_id":   data.get("client_id"),
                    "action_text": action_text,
                    "urgency":     data.get("urgency"),
                    "deadline":    data.get("deadline"),
                },
            }
        await supabase_insert(collection, data)
    except Exception:
        pass


# ── Public tool functions (same signatures the agents reference) ──────────────

async def mongo_find(collection: str, filter: dict, limit: int = 10) -> str:
    """Query documents from the consultiq MongoDB database."""
    return await _call("find", {
        "database":   "consultiq",
        "collection": collection,
        "filter":     filter,
        "limit":      limit,
    })


async def mongo_insert(collection: str, documents: list) -> str:
    """Insert documents into the consultiq MongoDB database."""
    result = await _call("insert-many", {
        "database":   "consultiq",
        "collection": collection,
        "documents":  documents,
    })
    if collection in _MIRROR_INSERT:
        for doc in documents:
            await _mirror_insert(collection, doc)
    return result


async def mongo_update(collection: str, filter: dict, update: dict) -> str:
    """Update documents in the consultiq MongoDB database."""
    return await _call("update-many", {
        "database":   "consultiq",
        "collection": collection,
        "filter":     filter,
        "update":     update,
        "upsert":     False,
    })


async def mongo_upsert(collection: str, filter: dict, data: dict) -> str:
    """Upsert a document — insert if not found, update if found."""
    result = await _call("update-many", {
        "database":   "consultiq",
        "collection": collection,
        "filter":     filter,
        "update":     {"$set": data},
        "upsert":     True,
    })
    if collection in _MIRROR_UPSERT:
        await _mirror_upsert(collection, {**filter, **data})
    return result
