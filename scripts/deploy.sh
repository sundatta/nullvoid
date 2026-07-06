#!/bin/bash
# NullVoid — Production Deployment Script

set -e

echo "=== NullVoid Deployment ==="

ENV=${1:-production}
echo "Environment: $ENV"

# Build all packages
echo "Building packages..."
pnpm install --frozen-lockfile
pnpm run build

# Run database migrations
echo "Running database migrations..."
pnpm prisma:migrate

# Start services
if [ "$ENV" = "production" ]; then
  echo "Starting production services..."
  docker-compose -f docker/docker-compose.prod.yml up -d --build
else
  echo "Starting development services..."
  docker-compose -f docker/docker-compose.yml up -d
fi

echo ""
echo "=== Deployment Complete ==="
