##### DEPENDENCIES

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json ./
RUN npm i

##### BUILDER

FROM node:20-alpine AS builder

ARG NEXT_PUBLIC_CLIENTVAR

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV SKIP_ENV_VALIDATION=1
# PocketBase runs in the same container, so this is always localhost
ENV POCKETBASE_URL=http://localhost:8080
ENV NEXT_PUBLIC_HOST=https://timesheet.helbling.uk
RUN npm run build

##### GO SETUP BINARY

FROM golang:1.24-alpine AS go-builder

WORKDIR /pb_setup
COPY pb_setup/ .
RUN go build -o pb_setup .

##### RUNNER

FROM node:20-alpine AS runner

RUN apk add --no-cache wget

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG_ENABLED=true
ENV NEW_RELIC_LOG=stdout
# PocketBase runs in the same container
ENV POCKETBASE_URL=http://localhost:8080

# Go setup/migrations binary (acts as the PocketBase server with embedded migrations)
COPY --from=go-builder /pb_setup/pb_setup /pb/pb_setup

# Next.js app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000 8080

ENV PORT=3000
ENV TZ=Europe/London

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["/entrypoint.sh"]
