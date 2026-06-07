import os
from dotenv import dotenv_values
from google.adk.tools.mcp_tool.mcp_toolset import McpToolset, StdioConnectionParams
from mcp.client.stdio import StdioServerParameters

_toolset: McpToolset | None = None

_ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".env")


def get_mongodb_toolset() -> McpToolset:
    global _toolset
    if _toolset is None:
        # Read .env directly to avoid stale os.environ from earlier imports
        env = dotenv_values(_ENV_PATH)
        _toolset = McpToolset(
            connection_params=StdioConnectionParams(
                server_params=StdioServerParameters(
                    command="npx",
                    args=["-y", "mongodb-mcp-server@latest"],
                    env={
                        "MDB_MCP_API_CLIENT_ID": env["MDB_MCP_API_CLIENT_ID"],
                        "MDB_MCP_API_CLIENT_SECRET": env["MDB_MCP_API_CLIENT_SECRET"],
                        "MDB_MCP_CONNECTION_STRING": env["MDB_MCP_CONNECTION_STRING"],
                    },
                ),
                timeout=60.0,
            )
        )
    return _toolset
