# Development Guide

## Project Structure

```
NullVoid/
├── apps/
│   ├── bot/          # Discord bot
│   ├── dashboard/    # Web dashboard (Next.js)
│   └── api/          # REST API (Fastify)
├── packages/
│   ├── database/     # Prisma & repositories
│   ├── shared/       # Shared constants & utilities
│   ├── logger/       # Pino logger
│   ├── utils/        # Common utilities
│   ├── config/       # Configuration
│   └── types/        # TypeScript types
├── docker/           # Docker configurations
└── docs/             # Documentation
```

## Adding a Command

1. Create a file in `apps/bot/src/commands/<category>/<name>.ts`
2. Extend `BaseCommand` and implement the `execute` method
3. The command is auto-loaded on restart

## Adding a Module

1. Create a directory in `apps/bot/src/modules/<name>/`
2. Create an index file that exports a class extending `BaseModule`
3. Register commands and events in `onEnable`

## Database Changes

1. Edit `packages/database/prisma/schema.prisma`
2. Run `pnpm prisma:migrate` to create a migration
3. Run `pnpm prisma:generate` to update the client

## Testing

```bash
# Unit tests
pnpm test

# API tests
pnpm --filter @nullvoid/api test

# Dashboard e2e tests
pnpm --filter @nullvoid/dashboard test:e2e
```

## Code Quality

```bash
# Lint check
pnpm lint

# Type check
pnpm typecheck

# Format
pnpm format
```
