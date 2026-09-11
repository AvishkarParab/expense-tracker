---
description: Apply the expense-tracker architecture, workflow, and verification guardrails to every project change.
applyTo: '**/*'
---

# Expense Tracker Project Guardrails

Before making or reviewing changes in this repository, read
`project_architecture_frontend_roadmap.md` at the repository root. Treat that
document as the current source of truth for architecture, infrastructure,
security expectations, API references, frontend conventions, roadmap status,
and verification commands.

## Working rules

- Do not assume project structure, framework behavior, endpoint contracts,
  environment values, or deployment details. Inspect the relevant files and
  explain the evidence behind implementation decisions.
- Preserve the decoupled FastAPI/PostgreSQL backend and Angular 22 standalone
  frontend architecture described by the roadmap.
- Keep Angular domain models, API DTOs, and form interfaces separated in their
  documented directories. Maintain barrel exports and path-alias usage.
- Follow the documented security and production constraints. Never commit
  secrets, credentials, or unredacted deployment connection strings.
- Use the roadmap's database migration workflow and environment-specific
  configuration rather than inventing a parallel process.
- Before committing or pushing, run the smallest relevant documented quality
  gates. Use `pytest` and `verify-prod-backend.bat` for backend changes, and
  `npx ng lint` and `npx ng build` for frontend changes; run additional checks
  when the change crosses boundaries.
- If the roadmap conflicts with code or an unstated requirement is ambiguous,
  stop and inspect further or ask for clarification instead of silently
  choosing an assumption.
- Keep the roadmap updated when an implementation materially changes its
  architecture, infrastructure, endpoint reference, quality gates, or roadmap
  status.
- Work directly on the `main` branch for this project. Keep changes
  uncommitted unless the user explicitly requests a commit, and never push
  without explicit approval.

## Reporting

For completed work, provide a concise step-by-step summary of what was
inspected, changed, and verified. Explicitly call out assumptions, unresolved
ambiguities, failed checks, and any follow-up required.

## Learnings

- Frontend visual work should use shared CSS custom properties from
  `frontend/src/styles.scss` for colors, typography, borders, and shadows;
  component SCSS should consume those tokens rather than introducing isolated
  theme values.
- Preserve existing layout dimensions and alignment when refining styles.
  Limit visual cleanup to tokens, surfaces, typography, states, and responsive
  presentation unless a layout change is explicitly requested.
- Use consistent, noticeable motion timing for animations and hover
  transitions. Prefer smooth ease-out curves and avoid abrupt or jittery
  effects; use 500ms as the standard duration unless a longer one-pass
  sweep is intentional; respect `prefers-reduced-motion` for non-essential
  animations.
