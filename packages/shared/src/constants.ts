export const BOT_NAME = 'NullVoid';
export const BOT_VERSION = '1.0.0';
export const BOT_INVITE_URL = 'https://discord.com/oauth2/authorize?client_id=PLACEHOLDER&permissions=8&scope=bot%20applications.commands';
export const SUPPORT_SERVER_URL = 'https://discord.gg/nullvoid';
export const WEBSITE_URL = 'https://nullvoid.dev';
export const DOCS_URL = 'https://docs.nullvoid.dev';
export const API_PREFIX = '/api/v1';

export const EMBED_COLORS = {
  PRIMARY: 0x5865F2,
  SUCCESS: 0x57F287,
  WARNING: 0xFEE75C,
  ERROR: 0xED4245,
  INFO: 0x5865F2,
  TRANSPARENT: 0x2B2D31,
} as const;

export const LIMITS = {
  MAX_GUILDS: 100_000,
  MAX_USERS_PER_GUILD: 1_000_000,
  MAX_CASES_PER_PAGE: 25,
  MAX_TICKETS_PER_GUILD: 50,
  MAX_ECONOMY_TRANSACTION_AMOUNT: 1_000_000_000,
  MAX_LEVEL: 1000,
  MAX_PRESTIGE: 100,
  MAX_QUEUE_SIZE: 500,
  MAX_PLAYLIST_SIZE: 200,
  MAX_GIVEAWAY_ENTRIES: 10_000,
  CACHE_TTL_DEFAULT: 300,
  RATE_LIMIT_MAX: 10,
  RATE_LIMIT_WINDOW_MS: 1000,
} as const;

export const CDN_URLS = {
  NULLVOID_LOGO: 'https://cdn.nullvoid.dev/logo.png',
  NULLVOID_ICON: 'https://cdn.nullvoid.dev/icon.png',
  DEFAULT_RANK_CARD: 'https://cdn.nullvoid.dev/rank/default.png',
} as const;

export const AI_PROVIDERS = ['openai', 'gemini', 'claude', 'groq', 'openrouter', 'nvidia-nim', 'ollama'] as const;
export type AIProvider = (typeof AI_PROVIDERS)[number];

export const PORTFOLIO_TYPES = ['developer', 'designer', 'artist', 'photographer', 'student', 'freelancer', 'company', 'startup', 'personal', 'custom'] as const;
export type PortfolioType = (typeof PORTFOLIO_TYPES)[number];

export const MODULE_NAMES = [
  'moderation', 'automod', 'ai', 'tickets', 'economy', 'leveling',
  'music', 'logging', 'welcome', 'verification', 'reaction-roles',
  'giveaways', 'scheduler', 'portfolio',
] as const;
export type ModuleName = (typeof MODULE_NAMES)[number];

export const LANGUAGES = ['en', 'es', 'fr', 'de', 'ja', 'hi'] as const;
export type Language = (typeof LANGUAGES)[number];
