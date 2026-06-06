import os
from google.adk.tools.mcp_tool.mcp_toolset import McpToolset, StdioServerParameters


def get_mongodb_toolset() -> McpToolset:
    """Returns an MCPToolset connected to MongoDB Atlas via mongodb-mcp-server.

    Reads credentials from environment variables. Call load_dotenv() before
    instantiating agents so these are present.
    """
    return McpToolset(
        connection_params=StdioServerParameters(
            command="npx",
            args=["-y", "mongodb-mcp-server@latest"],
            env={
                "MDB_MCP_API_CLIENT_ID": os.environ["MDB_MCP_API_CLIENT_ID"],
                "MDB_MCP_API_CLIENT_SECRET": os.environ["MDB_MCP_API_CLIENT_SECRET"],
            },
        )
    )
