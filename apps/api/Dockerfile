# syntax=docker/dockerfile:1.7
# Build depuis la racine du monorepo : docker build -f apps/api/Dockerfile -t somaya-api .

FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/db/package.json packages/db/
COPY packages/core/package.json packages/core/
RUN pnpm install --frozen-lockfile --filter @somaya/api... --ignore-scripts
COPY packages packages
COPY apps/api apps/api
RUN pnpm --filter @somaya/db build && pnpm --filter @somaya/core build && pnpm --filter @somaya/api build
RUN pnpm --filter @somaya/api... prune --prod

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
WORKDIR /repo
COPY --from=build --chown=app:app /repo/node_modules ./node_modules
COPY --from=build --chown=app:app /repo/package.json ./package.json
COPY --from=build --chown=app:app /repo/packages/db/package.json /repo/packages/db/dist ./packages/db/
COPY --from=build --chown=app:app /repo/packages/core/package.json ./packages/core/package.json
COPY --from=build --chown=app:app /repo/packages/core/dist ./packages/core/dist
COPY --from=build --chown=app:app /repo/packages/db/dist ./packages/db/dist
COPY --from=build --chown=app:app /repo/packages/db/node_modules ./packages/db/node_modules
COPY --from=build --chown=app:app /repo/packages/core/node_modules ./packages/core/node_modules
COPY --from=build --chown=app:app /repo/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=app:app /repo/apps/api/dist ./apps/api/dist
COPY --from=build --chown=app:app /repo/apps/api/node_modules ./apps/api/node_modules
USER app
WORKDIR /repo/apps/api
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD wget -qO- http://127.0.0.1:4000/health >/dev/null || exit 1
CMD ["node", "dist/main.js"]
