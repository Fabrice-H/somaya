<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Architecture

- `src/app` holds routes only. Pages stay thin: load data through a feature query, render a feature component. Storefront routes live in the `(site)` group, which provides header, footer and WhatsApp button.
- `src/features/<domain>` groups everything for one domain (products, catalog, lots, cart, checkout, orders, categories, settings, home, brand, media, auth…). New domains (loyalty, customers, payments, automations) follow the same layout:
  - `components/` visual only (`components/admin/` for back-office UI)
  - `hooks/`, `stores/` client state
  - `server/queries.ts` reads, `import "server-only"`, cached with `unstable_cache` + feature cache tag; admin reads call `assertAdmin()` first
  - `server/actions.ts` `"use server"` mutations only: auth check, zod validation, db write, `revalidateTag(TAG, "max")`
  - `server/mappers.ts` DB row to DTO, `types.ts` types only, `schemas.ts` zod, `constants.ts`, `utils.ts` pure functions
- `src/shared` holds cross-feature code: `components/` (layout, ui, listing, admin, icons), `config/` (site, navigation), `hooks/`, `lib/` (db, format, phone, sanitize, utils).
- Server actions receive untrusted input: never trust prices, totals or ids from the client; re-read them from the database.
- No comments in code. Format with `pnpm format`, check with `pnpm typecheck` and `pnpm lint`.
