# Sultan Bazar — Development Guide for Agents

## Purpose

This repository is an existing Sultan Bazar e-commerce application. Improve it incrementally without breaking current business behavior. Read this file, then `docs/audit/MASTER_AUDIT_SUMMARY.md`, before changing application code.

The platform is **Cash on Delivery (COD) only**. Do not introduce or recommend Stripe, SSLCommerz, bKash, Nagad, card processing, or any other online payment integration.

## Repository map

| Location | Responsibility |
|---|---|
| `sultan-bazar-client/` | Next.js 16 App Router customer storefront and admin dashboard |
| `sultan-bazar-server/` | Express 5 / TypeScript API |
| `sultan-bazar-server/src/app/modules/` | Domain modules: auth, user, category, product, cart, order, upload |
| `docs/audit/` | Source-backed audit, security findings, feature gaps, tests, and roadmap |
| `PROGRESS.md` | Delivery checklist; update it as tasks are completed |

## Architecture at a glance

- Client: Next.js, React, TypeScript, Tailwind CSS, Redux Toolkit/RTK Query, Axios, shadcn/Radix UI.
- Server: Express, TypeScript, MongoDB/Mongoose, Zod, bcrypt, JWT.
- Main API base: `/api/v1`.
- Roles: `user`, `admin`, `superAdmin`.
- Main entities: `User`, `Category`, `Product` with variants, `Cart`, `Order`.
- Authenticated API calls currently send a bearer token from client local storage. The server also sets cookies; treat this inconsistency as a planned security fix, not as behavior to expand.

## Non-negotiable safety rules

1. Preserve real working behavior unless an approved task explicitly changes it.
2. Never read, print, commit, or report secret values from `.env` files.
3. Do not install packages, run migrations, modify deployment settings, delete records/files, or add payment gateways unless explicitly approved.
4. For order totals, prices, shipping, discounts, stock, and permissions: the server is authoritative. Never trust client-calculated values.
5. Do not claim a check passed unless it was actually run and its result recorded.
6. Before modifying a domain, inspect its route, validation, controller, service, model, client API slice, and UI callers.
7. Update `PROGRESS.md` in the same change set when completing a roadmap item. Use `✅` only for work that is implemented and verified. Use `🟡` for work in progress and `⬜` for not started.

## Reusable and clean-code conventions

The current client contains oversized pages and repeated UI/data logic. Refactor only while preserving behavior and keeping changes focused.

### Client structure

- Keep route composition in `app/**/page.tsx`; move substantial UI sections into feature components.
- Put genuinely cross-feature UI in `components/shared/` and primitive UI in `components/ui/`.
- Prefer feature-local components next to their route/domain when reuse is limited to one feature.
- Extract repeated fetching/mutation orchestration into `hooks/` (for example, `useCheckout`, `useOrderActions`) only when it makes dependencies and error handling clearer.
- Put API access in RTK Query slices under `redux/api/`; do not embed raw API calls throughout UI.
- Put shared DTOs/domain types in `types/`; do not use `any` as an escape hatch.
- Put pure formatting/mapping/calculation helpers in `utils/` and keep them side-effect free.
- Reuse standard components for loading, error, empty state, money display, form field errors, order-status badges, confirmation dialogs, and tables.

### Server structure

- Keep routing and authorization declarations in `route.*.ts` / `router.*.ts`.
- Keep Zod request schemas in `validation.*.ts`.
- Keep controllers thin: obtain request data, invoke service, return response.
- Keep business/integrity logic in services; keep persistence definitions/indexes in models.
- Add explicit types for input/output and avoid `any` at service boundaries.
- Centralize repeated authorization or order-status transition rules as policy/helper modules with tests.

### File-size and extraction rule

There is no fixed line count, but extract a component/function when it has a distinct responsibility, repeated markup/logic, or makes the parent difficult to scan. Do not split files merely to create indirection. A good parent reads like a concise composition of named sections.

## Critical known risks — fix first

1. Guest checkout uses a default/shared password and exposes it in checkout UI.
2. Order requests accept a client-supplied `discount`.
3. Order creation, stock changes, cart clearing, and cancellation are not transactional/idempotent.
4. API data model/validation allow non-COD payment values.
5. `isBlocked` is not enforced during login/authentication.
6. Product rating endpoint lacks delivered-order ownership and duplicate-review authorization.
7. Public catalog can request non-active statuses; search/sort/pagination are not sufficiently bounded.

Read `docs/audit/SECURITY_AUDIT.md` for exact code evidence and recommendations.

## Working sequence

1. Work on **one sub-phase only** (for example, `1.1 Guest identity redesign`). Do not begin the next sub-phase while the current one is active.
2. Read its audit evidence and checklist, inspect the related code/tests, and state assumptions in the hand-off notes.
3. Make the smallest cohesive implementation for that sub-phase only. Refactor surrounding code only when it clearly improves reuse/maintainability.
4. Add or update the tests needed for that sub-phase.
5. Run targeted checks, then the required build/lint checks. Fix failures caused by the current work.
6. Mark the sub-phase `✅` in `PROGRESS.md` only after its implementation and required checks pass; otherwise retain `🟡` and record the blocker.
7. Commit and push the completed, verified sub-phase. Record the commit reference and verification outcome in `PROGRESS.md`.
8. Only then begin the next sub-phase.

## Current verification baseline

- Server: `npm.cmd run build` in `sultan-bazar-server/` passed during audit.
- Client: `npm.cmd run lint` in `sultan-bazar-client/` failed during audit with 100 errors and 57 warnings.
- No automated test files or test scripts were found during audit.

## Detailed references

- `docs/audit/PROJECT_OVERVIEW.md`
- `docs/audit/FRONTEND_UI_UX_AUDIT.md`
- `docs/audit/BACKEND_ARCHITECTURE_AUDIT.md`
- `docs/audit/SECURITY_AUDIT.md`
- `docs/audit/ECOMMERCE_FEATURE_GAP_ANALYSIS.md`
- `docs/audit/PERFORMANCE_SEO_AUDIT.md`
- `docs/audit/TESTING_STRATEGY.md`
- `docs/audit/IMPLEMENTATION_ROADMAP.md`

