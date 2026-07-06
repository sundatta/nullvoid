#!/bin/bash
# NullVoid — Development Setup Script

set -e

echo "=== NullVoid Setup ==="

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js is required. Install Node.js 20+."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "Installing pnpm..."; npm install -g pnpm; }
command -v docker >/dev/null 2>&1 || echo "Warning: Docker is not installed. Database services won't be available."

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Setup environment
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "Please edit .env with your configuration."
fi

# Generate Prisma client
echo "Generating Prisma client..."
pnpm prisma:generate

# Start infrastructure
if command -v docker &> /dev/null; then
  echo "Starting Docker services..."
  docker-compose -f docker/docker-compose.yml up -d postgres redis
  echo "Waiting for database..."
  sleep 3
fi

# Push database schema
echo "Pushing database schema..."
pnpm prisma:push

echo ""
echo "=== Setup Complete ==="
echo "Run 'pnpm dev' to start all services"
