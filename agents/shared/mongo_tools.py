"""
Async wrappers around MongoDB MCP — hardcode database="consultiq".
Each call opens a fresh MCP session so there are no event-loop conflicts.
"""
import asyncio
import os
from dotenv import dotenv_values
from mcp.client.stdio import StdioServerParameters, stdio_client
from mcp import ClientSession

_ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
_DB = "consultiq"


def _params():
    env = dotenv_values(_ENV_PATH)
    return StdioServerParameters(
        command="npx",
        args=["-y", "mongodb-mcp-server@latest"],
        env={
            "MDB_MCP_API_CLIENT_ID": env["MDB_MCP_API_CLIENT_ID"],
            "MDB_MCP_API_CLIENT_SECRET": env["MDB_MCP_API_CLIENT_SECRET"],
            "MDB_MCP_CONNECTION_STRING": env["MDB_MCP_CONNECTION_STRING"],
        },
    )


async def _call(tool: str, args: dict) -> str:
    text = None
    try:
        async with stdio_client(_params()) as (r, w):
            async with ClientSession(r, w) as session:
                await session.initialize()
                result = await session.call_tool(tool, args)
                text = result.content[0].text if result.content else "No result"
    except Exception as e:
        # Ignore anyio TaskGroup cleanup noise if result was already captured
        if text is None:
            text = f"MongoDB error: {e}"
    return text or "No result"


async def mongo_find(collection: str, filter: dict, limit: int = 10) -> str:
    """Query documents from the consultiq MongoDB database."""
    return await _call("find", {"database": _DB, "collection": collection, "filter": filter, "limit": limit})


async def mongo_insert(collection: str, documents: list) -> str:
    """Insert documents into the consultiq MongoDB database."""
    return await _call("insert-many", {"database": _DB, "collection": collection, "documents": documents})


async def mongo_update(collection: str, filter: dict, update: dict) -> str:
    """Update documents in the consultiq MongoDB database."""
    return await _call("update-many", {"database": _DB, "collection": collection, "filter": filter, "update": update})
