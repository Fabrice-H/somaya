# SO'MAYA — boutique en ligne & administration

Boutique de mode et accessoires pour femme basée à Abidjan. Monorepo pnpm : le site Next.js, une API NestJS et deux packages partagés.

```
apps/web        Site vitrine, boutique, espace client et administration (Next.js 16, Vercel)
apps/api        Webhooks (Jèko, WhatsApp), tâches planifiées, connecteurs (NestJS, Docker sur VPS)
packages/db     Schéma Drizzle et migrations (Neon Postgres)
packages/core   Logique métier serveur partagée (événements, automatisations, stock, fidélité, paiements, WhatsApp, Vendia)
```

## Démarrage

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # puis renseigner les valeurs
cp apps/api/.env.example apps/api/.env
pnpm db:migrate
pnpm dev        # site sur http://localhost:3000
pnpm dev:api    # API sur http://localhost:4000
```

Pendant le développement, `pnpm watch:packages` recompile `packages/*` à chaque modification.

## Commandes

| Commande | Rôle |
| --- | --- |
| `pnpm typecheck` / `pnpm lint` / `pnpm test` | vérifications sur tout le workspace |
| `pnpm format` | Prettier sur les apps et les packages |
| `pnpm db:generate` / `pnpm db:migrate` | migrations Drizzle (`packages/db`) |
| `pnpm build` | compile packages, site et API |

## Déploiement

- **Site** : Vercel, Root Directory `apps/web` (le `vercel.json` du dossier installe et compile depuis la racine du monorepo). Variables : voir `apps/web/.env.example`.
- **API** : `docker compose -f apps/api/docker-compose.yml up -d --build` sur le VPS, avec `apps/api/.env` renseigné (voir `apps/api/.env.example`). Exposer le port 4000 derrière un reverse proxy HTTPS et déclarer les URLs de webhooks chez Jèko (`/webhooks/jeko`) et Meta (`/webhooks/whatsapp`).
- Le site et l'API partagent la même base Neon et le même `CRON_SECRET` (utilisé par l'API pour invalider le cache du site via `POST /api/revalidate`).

## Contact

Réalisé par [SEGNOX Studio](https://segnox.com)
