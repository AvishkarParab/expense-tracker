# Expense Tracker Project Context & Conventions

### 1. Stack & Architecture

- Backend: FastAPI (`--app-dir backend`)
- Database: PostgreSQL 16 on Docker (host mapped port `5433:5432`)
- Container Name: `expense_tracker_db`
- ORM: SQLAlchemy 2.0+ (Mapped / mapped_column syntax)
- Schema Migrations: Alembic (managed via `backend/alembic/`)
- Auth: JWT via `pyjwt[crypto]` + Argon2 via `pwdlib[argon2]`

### 2. Dependency Pinning Standard

Strict `>=min_version,<next_major_version` convention:

- fastapi>=0.111.0,<1.0.0
- uvicorn[standard]>=0.30.0,<1.0.0
- pydantic-settings>=2.3.0,<3.0.0
- sqlalchemy>=2.0.30,<3.0.0
- psycopg2-binary>=2.9.9,<3.0.0
- alembic>=1.13.0,<2.0.0
- pwdlib[argon2]>=0.2.0,<1.0.0
- pyjwt[crypto]>=2.8.0,<3.0.0
- python-multipart>=0.0.9,<1.0.0

### 3. Engineering & Style Rules

- Path Resolution: VS Code analysis path includes `./backend`. Keep circular model imports separated using `if TYPE_CHECKING:` and `from __future__ import annotations`.
- Pydantic Schemas: All incoming request models MUST use `pydantic.Field` with explicit bounds (e.g., `min_length`, `max_length`, `ge`, `le`, `examples`) to prevent DoS and enforce strict contracts.
- Database Lifecycle: Table creation is strictly managed by Alembic revisions (`alembic revision --autogenerate`, `alembic upgrade head`). No `Base.metadata.create_all()` in app startup or lifespan handlers.
- Multi-step Execution: Group related steps together cleanly, prioritize scannability, and provide copy-paste code blocks.
