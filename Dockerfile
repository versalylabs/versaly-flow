# ==============================================================================
# Versaly Flow - Production Multi-Stage Containerfile
# Base Image: node:22-alpine (minimal security footprint)
# Aligned to Port 3000 daemon execution
# ==============================================================================

# STAGE 1: Dependency & Asset Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies with frozen lockfile for deterministic build
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source and compile production assets
COPY . .
RUN npm run build

# STAGE 2: Hardened Production Runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Install lightweight init system and healthcheck probe binaries
RUN apk add --no-cache dumb-init wget curl

# Copy runtime files
COPY package*.json ./
RUN npm ci --only=production --prefer-offline --no-audit && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dev-server.js ./dev-server.js

# Run as non-privileged system user for container security
USER node

EXPOSE 3000

# Container liveness health check
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/healthz || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dev-server.js"]
