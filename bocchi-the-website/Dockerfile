FROM imbios/bun-node:18-slim AS deps
ARG DEBIAN_FRONTEND=noninteractive
ARG NEXT_PUBLIC_WEBSITE_URL
ARG NEXT_PUBLIC_START_DATE

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build the app
FROM deps AS builder
WORKDIR /app
COPY . .

ENV DATABASE_URL=db/db.sqlite
ENV NEXT_PUBLIC_WEBSITE_URL=$NEXT_PUBLIC_WEBSITE_URL
ENV NEXT_PUBLIC_START_DATE=$NEXT_PUBLIC_START_DATE
ENV NODE_ENV production
RUN bun run build

# Production image, copy all the files and run next
FROM node:18-slim AS runner
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder  /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

VOLUME /app/public/img
VOLUME /app/db

EXPOSE 3001

ENV PORT 3001
CMD ["node", "server.js"]
