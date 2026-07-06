import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

function findEnvFile(): string | undefined {
  let dir = resolve(process.cwd());
  for (let i = 0; i < 5; i++) {
    const candidate = resolve(dir, '.env');
    if (existsSync(candidate)) return candidate;
    const parent = resolve(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }
  return undefined;
}

dotenvConfig({ path: findEnvFile() });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),

  DATABASE_URL: z.string().default('file:./nullvoid.db'),

  API_PORT: z.coerce.number().int().positive().default(3001),
  API_URL: z.string().url().default('http://localhost:3001'),
  JWT_SECRET: z.string().min(32).default('local-dev-jwt-secret-at-least-32-chars!!'),

  DASHBOARD_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),

  OPENAI_API_KEY: z.string().optional().default(''),
  GEMINI_API_KEY: z.string().optional().default(''),
  ANTHROPIC_API_KEY: z.string().optional().default(''),
  GROQ_API_KEY: z.string().optional().default(''),
  OPENROUTER_API_KEY: z.string().optional().default(''),
  NVIDIA_NIM_API_KEY: z.string().optional().default(''),
  OLLAMA_URL: z.string().url().default('http://localhost:11434'),

  LAVALINK_HOST: z.string().default('localhost'),
  LAVALINK_PORT: z.coerce.number().int().positive().default(2333),
  LAVALINK_PASSWORD: z.string().default('youshallnotpass'),

  PORTFOLIO_DOMAIN: z.string().default('localhost:3000'),
});

function parseConfig() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const config = parseConfig();
export type Config = z.infer<typeof envSchema>;
