# syntax=docker/dockerfile:1
# Multi-stage Dockerfile optimized for Google Cloud Run

# --- Stage 1: Build the Nitro server and assets ---
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy application source code
COPY . .

# Build the production server bundle (outputs to .output/)
ENV NODE_ENV=production
RUN npm run build

# --- Stage 2: Minimal Production Runtime ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Google Cloud Run injects PORT (default 8080)
ENV PORT=8080
ENV HOST=0.0.0.0

# Create non-root system user for security
USER node

# Copy only the compiled server and public assets from builder
COPY --from=builder --chown=node:node /app/.output ./.output
COPY --from=builder --chown=node:node /app/package.json ./package.json

EXPOSE 8080

# Launch Nitro standalone HTTP server
CMD ["node", ".output/server/index.mjs"]
