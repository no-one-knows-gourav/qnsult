#!/usr/bin/env python3
"""
Seed MongoDB with a test client document using the ADK runner.
Run once: python seed_db.py
"""
import asyncio
from dotenv import load_dotenv
from google.adk import Runner
from google.adk.agents import Agent
from google.adk.sessions import InMemorySessionService
from google.genai import types
from agents.shared.mongodb_toolset import get_mongodb_toolset

load_dotenv()

seed_agent = Agent(
    name="seed_agent",
    model="gemini-2.5-flash",
    tools=[get_mongodb_toolset()],
    instruction="You are a database seeder. Insert documents into MongoDB exactly as instructed. Do not modify field names or values.",
)

SEED_PROMPT = """
Insert the following document into the MongoDB database 'qnsult', collection 'clients'.
Use insertOne. Insert exactly this document, no changes:

{
  "client_id": "acme-001",
  "company_name": "Acme Corp",
  "client_domain": "acme.com",
  "status": "active",
  "industry": "technology",
  "company_size": "mid-market",
  "exec_contacts": [
    { "name": "Jane Smith", "email": "jane@acme.com", "role": "CTO" }
  ],
  "primary_contacts": ["ops@acme.com"],
  "contract_end_date": "2025-09-30",
  "contract_value": 240000,
  "project_name": "Digital Transformation Phase 2",
  "current_service_type": "advisory",
  "engagement_start_date": "2024-06-01"
}

After inserting, confirm the inserted document's _id and all field values.
"""

async def main():
    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name="seed", user_id="seeder", session_id="seed-001"
    )

    runner = Runner(
        agent=seed_agent,
        app_name="seed",
        session_service=session_service,
    )

    print("Seeding MongoDB 'clients' collection...")

    async for event in runner.run_async(
        user_id="seeder",
        session_id="seed-001",
        new_message=types.Content(
            role="user",
            parts=[types.Part(text=SEED_PROMPT)]
        ),
    ):
        if event.is_final_response() and event.content:
            for part in event.content.parts:
                if hasattr(part, "text") and part.text:
                    print(part.text)

    print("\nDone.")

if __name__ == "__main__":
    asyncio.run(main())
