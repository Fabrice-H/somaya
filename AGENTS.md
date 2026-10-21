<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `apps/web/node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Monorepo

pnpm workspaces. Run everything from the root: `pnpm dev` (site), `pnpm dev:api` (API), `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm format`, `pnpm db:generate`, `pnpm db:migrate`. `packages/*` compile to `dist/` and must be built (`pnpm build:packages`, or `pnpm watch:packages` while developing) before the apps can import them.

- `apps/web` Next.js storefront + admin. Deployed on Vercel with Root Directory `apps/web` (`vercel.json` runs install and build from the repo root).
- `apps/api` NestJS. Owns everything that is not a page or a server action: inbound webhooks (`/webhooks/jeko`, `/webhooks/whatsapp`), scheduled jobs (`src/cron`, manual triggers under `/cron/*` guarded by `CRON_SECRET`), the outbox poller that runs `outbox` automations (Vendia and other connectors) from `domain_events`. Deployed with Docker (`apps/api/Dockerfile`, `docker-compose.yml`). Controllers stay thin and call `@somaya/core`.
- `packages/db` Drizzle schema (`src/schema.ts`), migrations (`drizzle/`), lazy `db` client built from `DATABASE_URL`. Exposed as `@somaya/db` and `@somaya/db/schema`.
- `packages/core` server-side domain logic shared by both apps: events bus, automations, stock, loyalty, customers, payments, WhatsApp, Vendia. Exposed as `@somaya/core/<path>`. No Next.js, no React, no `server-only` here; cache invalidation goes through `shared/cache.ts` (`invalidateTags`), which the site binds to `revalidateTag` in `src/instrumentation.ts` and the API binds to `POST /api/revalidate` on the site.

# Architecture (apps/web)

- `src/app` holds routes only. Pages stay thin: load data through a feature query, render a feature component. Storefront routes live in the `(site)` group, which provides header, footer and WhatsApp button.
- `src/features/<domain>` groups everything for one domain (products, catalog, lots, cart, checkout, orders, categories, settings, home, brand, media, auth…). New domains follow the same layout:
  - `components/` visual only (`components/admin/` for back-office UI)
  - `hooks/`, `stores/` client state
  - `server/queries.ts` reads, `import "server-only"`, cached with `unstable_cache` + feature cache tag; admin reads call `assertAdmin()` first
  - `server/actions.ts` `"use server"` mutations only: auth check, zod validation, db write, `revalidateTag(TAG, "max")`
  - `server/mappers.ts` DB row to DTO, `types.ts` types only, `schemas.ts` zod, `constants.ts`, `utils.ts` pure functions
  - When a file lives in `packages/core`, the web copy is a one-line re-export (`export * from "@somaya/core/features/…"`). Edit the core file, not the shim.
- `src/shared` holds cross-feature code: `components/` (layout, ui, listing, admin, icons), `config/` (site, navigation), `hooks/`, `lib/` (db, format, phone, sanitize, utils).
- Server actions receive untrusted input: never trust prices, totals or ids from the client; re-read them from the database.
- Domain events: server actions call `emitEvent()`; `inline` automations (stock, loyalty) run immediately in the emitting process; `outbox` automations (Vendia, notifications) are picked up by the API from `domain_events` where `dispatched_at IS NULL`.
- No comments in code. Format with `pnpm format`, check with `pnpm typecheck` and `pnpm lint`.
