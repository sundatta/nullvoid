# Docker Guide

## Prerequisites

- Docker Engine 24+
- Docker Compose v2+

## Development Environment

Start required services:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

This starts PostgreSQL and Redis containers.

## Production Deployment

1. Set environment variables:
   ```bash
   export DISCORD_TOKEN=your_token
   export DISCORD_CLIENT_ID=your_client_id
   export DISCORD_CLIENT_SECRET=your_client_secret
   export JWT_SECRET=your_jwt_secret
   export DASHBOARD_URL=https://your-dashboard.com
   ```

2. Build and start all services:
   ```bash
   docker-compose -f docker/docker-compose.prod.yml up -d --build
   ```

## Commands

```bash
# View logs
docker-compose logs -f bot

# Stop services
docker-compose -f docker/docker-compose.prod.yml down

# Restart a specific service
docker-compose restart api

# Build a specific service
docker-compose build bot
```

## Volumes

Data is persisted in Docker volumes:

- `postgres-data`: Database files
- `redis-data`: Redis cache data
