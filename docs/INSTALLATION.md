# Installation Guide

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (optional, for database services)
- PostgreSQL 16 (if not using Docker)
- Redis 7 (if not using Docker)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/nullvoid/nullvoid.git
   cd nullvoid
   ```

2. Run setup:
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. Configure environment variables in `.env`

4. Start development:
   ```bash
   pnpm dev
   ```

## Manual Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your credentials

4. Start database services:
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

5. Generate Prisma client and push schema:
   ```bash
   pnpm prisma:generate
   pnpm prisma:push
   ```

6. Start development servers:
   ```bash
   pnpm dev
   ```

## Services

| Service    | Port | URL                    |
|------------|------|------------------------|
| Dashboard  | 3000 | http://localhost:3000   |
| API        | 3001 | http://localhost:3001   |
| PostgreSQL | 5432 | localhost:5432          |
| Redis      | 6379 | localhost:6379          |
| Swagger UI | 3001 | http://localhost:3001/docs |
