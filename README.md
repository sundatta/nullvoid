# NullVoid

Enterprise-Grade Discord Bot — AI, Moderation, Tickets, Economy, Leveling, Music & Portfolio Generator

[![CI](https://github.com/nullvoid/nullvoid/actions/workflows/ci.yml/badge.svg)](https://github.com/nullvoid/nullvoid/actions)
[![Discord](https://img.shields.io/discord/PLACEHOLDER)](https://discord.gg/nullvoid)

## Overview

NullVoid is a modular, production-ready Discord bot designed for scale. Built with clean architecture, SOLID principles, and horizontal scalability in mind.

## Features

- **Moderation** — Ban, kick, warn, timeout, purge, lock, slowmode, case management
- **Auto Moderation** — Anti-spam, anti-raid, anti-link, anti-scam, anti-NSFW
- **AI** — Multi-provider (OpenAI, Gemini, Claude, Groq, OpenRouter, NVIDIA, Ollama)
- **Tickets** — Panels, departments, claiming, transcripts, ratings
- **Economy** — Wallet, bank, daily, jobs, shop, trading, gambling, achievements
- **Leveling** — XP, voice XP, prestige, rank cards, leaderboards, rewards
- **Music** — Lavalink, YouTube, Spotify, SoundCloud, filters, equalizer, lyrics
- **Portfolio Generator** — Create, edit, publish professional portfolio websites
- **Dashboard** — Full web dashboard with analytics and live preview

## Quick Start

```bash
git clone https://github.com/nullvoid/nullvoid.git
cd nullvoid
cp .env.example .env
pnpm install
docker-compose -f docker/docker-compose.yml up -d
pnpm prisma:generate
pnpm prisma:push
pnpm dev
```

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Docker Guide](docs/DOCKER.md)
- [API Documentation](docs/API.md)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Bot | TypeScript, discord.js v14 |
| Dashboard | Next.js 14, React 18, Tailwind CSS |
| API | Fastify, JWT, WebSockets |
| Database | PostgreSQL, Prisma ORM, Redis |
| Infrastructure | Docker, GitHub Actions |

## Architecture

```
apps/
├── bot/        # Discord bot (commands, events, modules)
├── dashboard/  # Web dashboard (Next.js)
└── api/        # REST API + WebSocket (Fastify)
packages/
├── database/   # Prisma schemas & repositories
├── shared/     # Shared constants, errors, events
├── logger/     # Pino logging
├── utils/      # Utilities (cache, rate-limit, retry)
├── config/     # Zod-validated configuration
└── types/      # TypeScript type definitions
```

## License

Proprietary — All rights reserved.
