import type {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  ButtonInteraction,
  StringSelectMenuInteraction,
  ModalSubmitInteraction,
  AutocompleteInteraction,
  ClientEvents,
} from 'discord.js';

export interface BotOptions {
  token: string;
  clientId: string;
  intents: number[];
  partials: number[];
  shardCount?: number;
  cacheGuilds?: boolean;
  cacheUsers?: boolean;
  cacheMessages?: boolean;
}

export interface ModuleManifest {
  name: string;
  description: string;
  version: string;
  commands: string[];
  events: string[];
  dependencies?: string[];
  defaultEnabled: boolean;
}

export interface CommandContext {
  interaction:
    | ChatInputCommandInteraction
    | ContextMenuCommandInteraction
    | ButtonInteraction
    | StringSelectMenuInteraction
    | ModalSubmitInteraction;
  args: Record<string, unknown>;
  guildId: string;
  userId: string;
  memberPermissions: bigint;
  isPremium: boolean;
  locale: string;
}

export type EventHandler<T extends keyof ClientEvents = keyof ClientEvents> = (
  ...args: ClientEvents[T]
) => Promise<void> | void;

export type Middleware = (context: CommandContext, next: () => Promise<void>) => Promise<void>;

export type InteractionHandler =
  | ChatInputCommandInteraction
  | ContextMenuCommandInteraction
  | ButtonInteraction
  | StringSelectMenuInteraction
  | ModalSubmitInteraction
  | AutocompleteInteraction;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface WebSocketMessage {
  event: string;
  data: unknown;
  timestamp: number;
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    connected: boolean;
    latency: number;
  };
  redis: {
    connected: boolean;
    latency: number;
  };
  discord: {
    connected: boolean;
    guilds: number;
    users: number;
    shards: number;
  };
  version: string;
}

export interface Job {
  name: string;
  schedule: string;
  handler: () => Promise<void>;
  enabled: boolean;
}

export interface JobSchedule {
  cron: string;
  timezone: string;
  maxRetries: number;
  timeoutMs: number;
}

export interface ShardStats {
  id: number;
  status: number;
  guilds: number;
  users: number;
  ping: number;
  uptime: number;
  memory: number;
}

export interface BotStats {
  guilds: number;
  users: number;
  shards: number;
  commands: number;
  uptime: number;
  memory: {
    used: number;
    total: number;
  };
  ping: number;
  readyAt: Date | null;
}
