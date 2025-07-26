##### DEPENDENCIES

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies based on the preferred package manager

COPY package.json ./

RUN npm i

##### BUILDER

FROM node:20-alpine AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV AUTH_TRUST_HOST=true
RUN touch build.db
ENV DATABASE_URL="file:/build.db"
ENV AUTH_SECRET=""
ENV NEXT_PUBLIC_CLIENTVAR=${NEXT_PUBLIC_CLIENTVAR}

ENV SKIP_ENV_VALIDATION=1
RUN npm run build

##### RUNNER

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY drizzle ./drizzle
COPY migrate.js ./migrate.js

EXPOSE 3000
ENV PORT=3000

CMD ["/bin/sh", "-c", "node /app/migrate.js && node /app/server.js"]
