# Project Overview & Architecture Status

**1. System Summary**
Production-ready Expense Tracker backend built with FastAPI, PostgreSQL, and Alembic, paired with an enterprise-grade Angular 22 frontend workspace.

- **Backend Live Base URL:** [https://expense-tracker-api-1bok.onrender.com](https://expense-tracker-api-1bok.onrender.com)
- **API Prefix:** `/api/v1`
- **Architecture:** Decoupled FastAPI REST API communicating over an internal network with a managed PostgreSQL instance, paired with a modular Angular 22 standalone client.
- **Security & Production Guardrails:**
  - Interactive API documentation (/docs, /redoc) is locked down (returns 404) in production.
  - Secret key validation enforced via Pydantic settings in production mode.
  - Multi-stage Docker container runs under a non-root user (appuser).
  - Concurrency optimized to 2 Uvicorn workers to prevent memory exhaustion on free-tier limits.
  - Frontend strict dependency validation via native npm peer dependency checking (no global overrides like `legacy-peer-deps=true` to maintain enterprise code integrity).

**2. Infrastructure & Hosting Details**
| Component | Platform | Configuration / Notes |
| :--- | :--- | :--- |
| **Backend API** | Render Web Service | Runtime: Docker (`backend/Dockerfile`), Region: Singapore |
| **Database** | Render PostgreSQL | Managed PostgreSQL instance, Region: Singapore |
| **Internal DB Connection** | Private Network | Used by Render Web Service: `postgresql://dbuser:...@dpg-...:5432/expensedb_dqx7` |
| **External DB Connection** | SSL Enabled | Used for local migrations: `postgresql://dbuser:...@dpg-...-a.singapore-postgres.render.com/expensedb_dqx7?sslmode=require` |

**3. Database Migration Workflow**
`backend/alembic/env.py` supports dynamic URL overrides via `-x url=...`.
- **Local Development:** Runs against local Docker PostgreSQL (`localhost:5433`) using `.env` values.
- **Commands:**
  - `alembic revision --autogenerate -m "migration_name"`
  - `alembic -x url="..." upgrade head`

**4. Verification & Quality Gates (Enterprise Standards)**
Run these checks before committing changes or pushing to main:
- **Backend:**
  - `pytest`
  - `verify-prod-backend.bat` (Validates Docker container construction, environment variable parsing, non-root user privileges, and health check endpoints under production constraints).
- **Frontend (Angular 22 Workspace):**
  - `npx ng lint` (Enforced via `@angular-eslint`)
  - `npx ng build` (Powered by the modern `esbuild` application builder)

**5. Angular 22 Frontend Architecture Patterns**
- **Strict Folder Separation of Concerns:**
  - `core/models/`: Core domain entities live at the root.
  - `core/models/_dtos/`: Strict API request/response contracts (decoupled from domain logic).
  - `core/models/_forms/`: Signal Form interfaces for UI components.
  - Barrel exports (`index.ts`) maintained across all directories for clean path-aliased imports (`@core`, etc.).
- **API Request Standard:**
  - `core/services/api.service.ts` is the single generic HTTP request layer.
  - Feature services own feature-specific API operations and live beside their feature components.
  - Feature services delegate request construction to `ApiService`; components handle returned data, loading state, and errors.
  - Shared API paths, storage keys, content types, and reusable messages are defined as uppercase constants in `core/_utilities/constants.ts`.
  - New endpoints must be added to the relevant object in `API_ENDPOINTS` rather than hardcoded inside feature services or components.
  - Shared infrastructure uses path aliases such as `@core`, `@models`, `@features`, and `@env`; relative imports are reserved for files in the same feature or directory.
- **Reactive Performance:**
  - Leveraging Angular 22 production-ready Signal APIs and stable Signal Forms.
  - Default `OnPush` change detection natively utilized for optimal DOM rendering performance.
- **Responsive Styling:**
  - `src/styles.scss` is the single SCSS entry point and loads the global `base` module.
  - `src/styles/_base.scss` owns the internal SCSS composition and imports themes,
    buttons, and layout styles.
  - `src/styles/_layout.scss` composes shell, header/sidebar navigation, and form modules.
  - Theme tokens are defined in `src/styles/_themes.scss` through CSS custom properties.
  - Global resets and reusable defaults belong in `src/styles/_base.scss`.
  - Responsive application-shell rules belong in `src/styles/_shell.scss`.
  - Header, sidebar, form/card, and button styles remain in their dedicated modules.
  - Components consume theme variables instead of hardcoding light/dark colors.
  - The application shell uses a minimal header and flexible content region; redundant sidebars and duplicate navigation should be avoided.
  - Layouts must support both mobile and laptop widths using responsive CSS grid/flex rules without wasting viewport space.
  - Authentication pages use a centered card layout; authenticated pages use a compact responsive sidebar workspace.

**Completed Frontend Foundations**
- Reusable Signal Forms `InputTextComponent` with bracket-bound inputs,
  `[formField]` integration, and field-level validation messages.
- Reusable server-error `FormErrorsComponent` for API submission messages,
  including accessible alert markup and smooth, reduced-motion-aware entrance
  animation.
- Login and registration forms use standalone Signal Forms with extracted
  feature models, initial state, schemas, and barrel exports.
- Generic `ResultKind` response formatting and `toResultKind$()` operator
  centralize successful/error API handling.
- `ApiService` supports optional request configuration with page-level loading
  by default and sender-specific loading through `LoaderService`.
- Reusable page loader, sender-specific submit loading, and auth button states
  are implemented through the core UI/services barrels.
- Core UI, services, models, operators, and feature model barrels are in place.
- Authentication pages use shared theme tokens, centered cards, responsive
  spacing, animated card entry, and opt-in button shine hover styling.
- SCSS is modularized into theme, base, buttons, layout, shell, forms, header,
  sidebar, and navigation composition modules.
- Standard motion timing is 500ms for normal transitions and entrance
  animations; longer timings are reserved for intentional one-pass effects,
  and non-essential motion respects `prefers-reduced-motion`.
- Frontend changes are developed directly on `main` and remain uncommitted
  unless a commit is explicitly requested.

**6. Live API Endpoints Reference**
- `GET /docs` -> 404 Not Found (Swagger lockdown active)
- `GET /api/v1/health` -> 200 OK (`{"status": "healthy", "database": "connected"}`)
- `POST /api/v1/auth/register` -> 201 Created
- `POST /api/v1/auth/login` -> 200 OK (Returns JWT `access_token`)
- `GET /api/v1/expenses/` -> 200 OK (Protected: requires Bearer token)
- `POST /api/v1/expenses/` -> 201 Created (Protected: requires Bearer token)

**7. Next Phase: Angular 22 Implementation Roadmap**
- [x] Scaffold Angular workspace and migrate cleanly to Angular 22 with modern esbuild and Vitest configurations.
- [x] Establish strict domain models, DTOs, and form interfaces with barrel exports and path aliases.
- [ ] Configure environment variables (`src/environments/environment.ts` pointing to `https://expense-tracker-api-1bok.onrender.com/api/v1`).
- [ ] Implement `AuthService` and functional HTTP Interceptor for automatic JWT Bearer token injection.
- [x] Build Signal-based login and registration forms.
- [ ] Construct responsive dashboard views (expense overview, category filtering, and item entry).
- [ ] Add `http://localhost:4200` to `ALLOWED_ORIGINS` in Render backend environment settings to allow local frontend development without CORS issues.