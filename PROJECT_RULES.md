# Expense Tracker Project Context & Conventions

### 1. Stack & Infrastructure

- **Backend**: FastAPI (`--app-dir backend`)
- **Database**: PostgreSQL 16 on Docker (`expense_tracker_db`, port mapped `5433:5432`)
- **ORM**: SQLAlchemy 2.0+ (`Mapped`, `mapped_column`, `select()`, and `db.get()`)
- **Migrations**: Alembic (managed under `backend/alembic/`)
- **Auth**: JWT via `pyjwt[crypto]` + Argon2 hashing via `pwdlib[argon2]` (`OAuth2PasswordBearer` on `/api/v1/auth/login`)

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
- email-validator>=2.1.0,<3.0.0

### 3. Engineering & Architecture Patterns

- **Validation**: All incoming request models MUST use `pydantic.Field` with explicit bounds (`min_length`, `max_length`, `gt`, `le`, `examples`) to prevent DoS attacks and maintain clear API documentation.
- **Database Lifecycle**: Schema updates are executed strictly via Alembic revisions (`alembic revision --autogenerate`, `alembic upgrade head`). Never run `Base.metadata.create_all()`.
- **Imports & Type Safety**: Model cross-references use `from __future__ import annotations` and `if TYPE_CHECKING:` to prevent runtime circular imports while preserving linter auto-completion.
- **Dependency Modularity**: Dependencies reside in domain modules under `app/api/deps/` (`auth.py`, `expense.py`) and are cleanly re-exported via `app/api/deps/__init__.py`.
- **Resource Ownership**:
  - Write operations derive `user_id` exclusively from `get_current_user` (never from request bodies).
  - Single-entity operations use sub-dependencies (e.g., `get_valid_expense`) to enforce user scoping and return `404` directly on non-owned or missing records.
  - Router-level dependencies (`APIRouter(dependencies=[...])`) are reserved for broad security gates where handlers do not require the `user` object directly. Handlers needing user state inject `current_user: Annotated[User, Depends(...)]`.
- **Client Testing Convention**: `/auth/login` expects `application/x-www-form-urlencoded` payloads (`username`, `password`). Postman tests parse `responseJson.access_token` into a collection variable `{{access_token}}` automatically.

### 4. Completed Modules

- Containerized PostgreSQL environment with volume persistence.
- Alembic baseline setup with `users` and `expenses` tables.
- Auth Module (`POST /auth/register`, `POST /auth/login`).
- Expense Module: User-scoped CRUD (Create, Bulk Create, List with filtering/pagination, Get by ID, Patch, Delete).
