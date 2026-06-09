"""
Async wrappers around Supabase REST API.
Uses the service role key to bypass RLS — agents write on behalf of the system.
All public tables (agent_status, client_scores, engagements, etc.) are writable here.
"""
import asyncio
import os
from dotenv import dotenv_values
from supabase import create_client

_ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
_env = dotenv_values(_ENV_PATH)

_URL = _env.get("SUPABASE_URL", "")
_KEY = _env.get("SUPABASE_SERVICE_ROLE_KEY", "")


def _client():
    return create_client(_URL, _KEY)


async def supabase_upsert(table: str, data: dict, on_conflict: str = "client_id") -> str:
    """Upsert a row into a Supabase table. on_conflict is the primary key column."""
    def _run():
        result = _client().table(table).upsert(data, on_conflict=on_conflict).execute()
        return f"upserted {len(result.data)} row(s) into {table}"
    try:
        return await asyncio.to_thread(_run)
    except Exception as e:
        return f"Supabase upsert error ({table}): {e}"


async def supabase_insert(table: str, data: dict) -> str:
    """Insert a single row into a Supabase table."""
    def _run():
        result = _client().table(table).insert(data).execute()
        return f"inserted {len(result.data)} row(s) into {table}"
    try:
        return await asyncio.to_thread(_run)
    except Exception as e:
        return f"Supabase insert error ({table}): {e}"


async def supabase_select(table: str, filters: dict | None = None, limit: int = 100) -> list:
    """Select rows from a Supabase table. Returns list of dicts. filters is {col: value}."""
    def _run():
        q = _client().table(table).select("*")
        if filters:
            for col, val in filters.items():
                q = q.eq(col, val)
        result = q.limit(limit).execute()
        return result.data or []
    try:
        return await asyncio.to_thread(_run)
    except Exception:
        return []
