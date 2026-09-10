# Project Overview & Architecture Status

**1\. System Summary**Production-ready Expense Tracker backend built with FastAPI, PostgreSQL, and Alembic, containerized via multi-stage Docker builds and hosted on Render.

- **Live Base URL:** \[https://expense-tracker-api-1bok.onrender.com\](https://expense-tracker-api-1bok.onrender.com)
- **API Prefix:** /api/v1
- **Architecture:** Decoupled FastAPI REST API communicating over an internal network with a managed PostgreSQL instance.
- **Security & Production Guardrails:**
  - Interactive API documentation (/docs, /redoc) is locked down (returns 404) in production.
  - Secret key validation enforced via Pydantic settings in production mode.
  - Multi-stage Docker container runs under a non-root user (appuser).
  - Concurrency optimized to 2 Uvicorn workers to prevent memory exhaustion on free-tier limits.

**2\. Infrastructure & Hosting Details\*\***ComponentPlatformConfiguration / NotesBackend API**Render Web ServiceRuntime: Docker (backend/Dockerfile), Region: Singapore**Database**Render PostgreSQLManaged PostgreSQL instance, Region: Singapore**Internal DB Connection**Private NetworkUsed by Render Web Service: postgresql://dbuser:...@dpg-...:5432/expensedb_dqx7**External DB Connection**SSL EnabledUsed for local migrations: postgresql://dbuser:...@dpg-...-a.singapore-postgres.render.com/expensedb_dqx7?sslmode=require**3\. Database Migration Workflow\*\*backend/alembic/env.py supports dynamic URL overrides via -x url=....

- **Local Development:** Runs against local Docker PostgreSQL (localhost:5433) using .env values.
- alembic revision --autogenerate -m "migration_name"
- alembic -x url="postgresql://dbuser:4EvNbhgFVfGGLbZdwKbfRDQTSUAiOuJn@dpg-dagj07gu01pc7383o4c0-a.singapore-postgres.render.com/expensedb_dqx7?sslmode=require" upgrade head

**4\. Verification & Quality Gates**Run these checks before committing backend changes or pushing to main:

- pytest
- verify-prod-backend.batValidates Docker container construction, environment variable parsing, non-root user privileges, and health check endpoints under production constraints.

**5\. Live API Endpoints Reference**

- GET /docs -> 404 Not Found (Swagger lockdown active)
- GET /api/v1/health -> 200 OK ({"status": "healthy", "database": "connected"})
- POST /api/v1/auth/register -> 201 Created
- POST /api/v1/auth/login -> 200 OK (Returns JWT access_token)
- GET /api/v1/expenses/ -> 200 OK (Protected: requires Bearer )
- POST /api/v1/expenses/ -> 201 Created (Protected: requires Bearer )

**6\. Next Phase: Angular Frontend Roadmap**

- Scaffold the Angular application inside the repository workspace.
- Configure environment configurations (src/environments/environment.ts pointing to \[https://expense-tracker-api-1bok.onrender.com/api/v1\](https://expense-tracker-api-1bok.onrender.com/api/v1)).
- Implement an HTTP Interceptor for automatic JWT Bearer token injection.
- Construct authentication services (Login, Registration, Token storage).
- Build modern responsive dashboard views: expense overview, category filtering, and item entry.
- Add http://localhost:4200 to ALLOWED_ORIGINS in Render environment settings to allow local frontend development without CORS issues.
