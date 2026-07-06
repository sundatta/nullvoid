export const PermissionLevel = {
  EVERYONE: 0,
  MEMBER: 1,
  MODERATOR: 2,
  ADMINISTRATOR: 3,
  GUILD_OWNER: 4,
  BOT_OWNER: 5,
} as const;

export type PermissionLevel = (typeof PermissionLevel)[keyof typeof PermissionLevel];

export const PERMISSION_LABELS: Record<PermissionLevel, string> = {
  [PermissionLevel.EVERYONE]: 'Everyone',
  [PermissionLevel.MEMBER]: 'Member',
  [PermissionLevel.MODERATOR]: 'Moderator',
  [PermissionLevel.ADMINISTRATOR]: 'Administrator',
  [PermissionLevel.GUILD_OWNER]: 'Guild Owner',
  [PermissionLevel.BOT_OWNER]: 'Bot Owner',
};

export const MODULE_DEFAULT_PERMISSIONS: Record<string, PermissionLevel> = {
  moderation: PermissionLevel.MODERATOR,
  automod: PermissionLevel.ADMINISTRATOR,
  ai: PermissionLevel.EVERYONE,
  tickets: PermissionLevel.EVERYONE,
  economy: PermissionLevel.EVERYONE,
  leveling: PermissionLevel.EVERYONE,
  music: PermissionLevel.EVERYONE,
  logging: PermissionLevel.ADMINISTRATOR,
  welcome: PermissionLevel.ADMINISTRATOR,
  verification: PermissionLevel.ADMINISTRATOR,
  'reaction-roles': PermissionLevel.ADMINISTRATOR,
  giveaways: PermissionLevel.MODERATOR,
  scheduler: PermissionLevel.MODERATOR,
  portfolio: PermissionLevel.EVERYONE,
};
