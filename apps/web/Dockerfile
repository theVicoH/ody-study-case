FROM oven/bun:1.3.11-alpine AS builder
RUN apk add --no-cache libc6-compat curl
WORKDIR /app
COPY . .
RUN bun install
RUN bun run --filter=web build

FROM oven/bun:1.3.11-alpine AS prod
RUN apk add --no-cache libc6-compat curl
RUN addgroup -S -g 1001 bunuser && adduser -S -u 1001 -G bunuser bunuser
WORKDIR /app
COPY --from=builder /app/apps/web/.output ./.output
USER bunuser
EXPOSE 3000
CMD ["bun", "run", ".output/server/index.mjs"]
