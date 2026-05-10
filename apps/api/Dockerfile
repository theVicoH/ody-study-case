FROM oven/bun:1.3.11-alpine AS base
RUN apk add --no-cache libc6-compat curl
RUN bun install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune api --docker

FROM oven/bun:1.3.11-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=base /app/out/json/ .
COPY --from=base /app/out/bun.lock ./bun.lock
COPY --from=base /app/bunfig.toml ./bunfig.toml
RUN bun install --frozen-lockfile

FROM installer AS builder
COPY --from=base /app/out/full/ .
RUN bun run build --filter=api

FROM oven/bun:1.3.11-alpine AS prod
RUN apk add --no-cache libc6-compat curl
RUN addgroup -S -g 1001 bunuser && adduser -S -u 1001 -G bunuser bunuser
WORKDIR /app
COPY --from=builder /app/apps/api/.output ./.output
USER bunuser
EXPOSE 3001
CMD ["bun", "run", ".output/index.js"]
