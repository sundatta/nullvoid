
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('@prisma/client/runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.GuildScalarFieldEnum = {
  id: 'id',
  name: 'name',
  icon: 'icon',
  ownerId: 'ownerId',
  locale: 'locale',
  prefix: 'prefix',
  premium: 'premium',
  premiumSince: 'premiumSince',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GuildModuleStateScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  moduleName: 'moduleName',
  enabled: 'enabled',
  settings: 'settings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  discordId: 'discordId',
  username: 'username',
  discriminator: 'discriminator',
  avatar: 'avatar',
  locale: 'locale',
  premium: 'premium',
  premiumSince: 'premiumSince',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ModCaseScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  userId: 'userId',
  moderatorId: 'moderatorId',
  type: 'type',
  reason: 'reason',
  duration: 'duration',
  evidence: 'evidence',
  active: 'active',
  auto: 'auto',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WarningScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  userId: 'userId',
  moderatorId: 'moderatorId',
  reason: 'reason',
  points: 'points',
  expired: 'expired',
  createdAt: 'createdAt'
};

exports.Prisma.TicketScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  channelId: 'channelId',
  creatorId: 'creatorId',
  claimerId: 'claimerId',
  panelId: 'panelId',
  department: 'department',
  priority: 'priority',
  status: 'status',
  rating: 'rating',
  closeReason: 'closeReason',
  closedAt: 'closedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TicketMessageScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  authorId: 'authorId',
  content: 'content',
  attachments: 'attachments',
  createdAt: 'createdAt'
};

exports.Prisma.TicketPanelScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  channelId: 'channelId',
  messageId: 'messageId',
  title: 'title',
  description: 'description',
  department: 'department',
  priority: 'priority',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EconomyProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  guildId: 'guildId',
  wallet: 'wallet',
  bank: 'bank',
  bankMax: 'bankMax',
  totalEarned: 'totalEarned',
  totalSpent: 'totalSpent',
  dailyStreak: 'dailyStreak',
  lastDaily: 'lastDaily',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EconomyItemScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  category: 'category',
  roleId: 'roleId',
  stackable: 'stackable',
  sellable: 'sellable',
  createdAt: 'createdAt'
};

exports.Prisma.InventoryItemScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  guildId: 'guildId',
  itemId: 'itemId',
  quantity: 'quantity',
  createdAt: 'createdAt'
};

exports.Prisma.EconomyTransactionScalarFieldEnum = {
  id: 'id',
  fromId: 'fromId',
  toId: 'toId',
  guildId: 'guildId',
  amount: 'amount',
  type: 'type',
  description: 'description',
  createdAt: 'createdAt'
};

exports.Prisma.LevelingProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  guildId: 'guildId',
  xp: 'xp',
  level: 'level',
  totalXp: 'totalXp',
  voiceXp: 'voiceXp',
  messageXp: 'messageXp',
  prestige: 'prestige',
  dailyStreak: 'dailyStreak',
  lastMessage: 'lastMessage',
  lastVoice: 'lastVoice',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LevelRewardScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  level: 'level',
  roleId: 'roleId',
  createdAt: 'createdAt'
};

exports.Prisma.MusicQueueScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  tracks: 'tracks',
  currentTrack: 'currentTrack',
  loopMode: 'loopMode',
  volume: 'volume',
  filters: 'filters',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MusicPlaylistScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  guildId: 'guildId',
  name: 'name',
  description: 'description',
  tracks: 'tracks',
  private: 'private',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AIProviderConfigScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  provider: 'provider',
  apiKey: 'apiKey',
  model: 'model',
  temperature: 'temperature',
  maxTokens: 'maxTokens',
  enabled: 'enabled',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AIConversationScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  channelId: 'channelId',
  userId: 'userId',
  messages: 'messages',
  context: 'context',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GiveawayScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  channelId: 'channelId',
  messageId: 'messageId',
  prize: 'prize',
  description: 'description',
  winners: 'winners',
  endAt: 'endAt',
  ended: 'ended',
  requirements: 'requirements',
  bonusRoleIds: 'bonusRoleIds',
  blacklistedRoleIds: 'blacklistedRoleIds',
  createdBy: 'createdBy',
  createdAt: 'createdAt'
};

exports.Prisma.GiveawayEntryScalarFieldEnum = {
  id: 'id',
  giveawayId: 'giveawayId',
  userId: 'userId',
  entries: 'entries',
  createdAt: 'createdAt'
};

exports.Prisma.ReactionRoleScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  channelId: 'channelId',
  messageId: 'messageId',
  emoji: 'emoji',
  roleId: 'roleId',
  type: 'type',
  createdAt: 'createdAt'
};

exports.Prisma.WelcomeSettingsScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  enabled: 'enabled',
  welcomeChannelId: 'welcomeChannelId',
  goodbyeChannelId: 'goodbyeChannelId',
  welcomeMessage: 'welcomeMessage',
  goodbyeMessage: 'goodbyeMessage',
  welcomeImage: 'welcomeImage',
  autoRoleId: 'autoRoleId',
  captchaEnabled: 'captchaEnabled',
  rulesChannelId: 'rulesChannelId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VerificationSettingsScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  enabled: 'enabled',
  type: 'type',
  verifiedRoleId: 'verifiedRoleId',
  logChannelId: 'logChannelId',
  minAccountAge: 'minAccountAge',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LoggingSettingsScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  enabled: 'enabled',
  logChannelId: 'logChannelId',
  options: 'options',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PremiumSubscriptionScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  userId: 'userId',
  type: 'type',
  tier: 'tier',
  startAt: 'startAt',
  endAt: 'endAt',
  active: 'active',
  createdAt: 'createdAt'
};

exports.Prisma.AnalyticsEventScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  type: 'type',
  metadata: 'metadata',
  timestamp: 'timestamp'
};

exports.Prisma.PortfolioScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  guildId: 'guildId',
  type: 'type',
  theme: 'theme',
  title: 'title',
  subtitle: 'subtitle',
  about: 'about',
  published: 'published',
  domain: 'domain',
  customDomain: 'customDomain',
  sections: 'sections',
  projects: 'projects',
  socialLinks: 'socialLinks',
  seo: 'seo',
  views: 'views',
  resume: 'resume',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SchedulerTaskScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  type: 'type',
  executeAt: 'executeAt',
  executed: 'executed',
  data: 'data',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogEntryScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  userId: 'userId',
  action: 'action',
  targetId: 'targetId',
  reason: 'reason',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.BackupScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  data: 'data',
  createdAt: 'createdAt'
};

exports.Prisma.InviteScalarFieldEnum = {
  id: 'id',
  guildId: 'guildId',
  uses: 'uses',
  maxUses: 'maxUses',
  code: 'code',
  inviterId: 'inviterId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Guild: 'Guild',
  GuildModuleState: 'GuildModuleState',
  User: 'User',
  ModCase: 'ModCase',
  Warning: 'Warning',
  Ticket: 'Ticket',
  TicketMessage: 'TicketMessage',
  TicketPanel: 'TicketPanel',
  EconomyProfile: 'EconomyProfile',
  EconomyItem: 'EconomyItem',
  InventoryItem: 'InventoryItem',
  EconomyTransaction: 'EconomyTransaction',
  LevelingProfile: 'LevelingProfile',
  LevelReward: 'LevelReward',
  MusicQueue: 'MusicQueue',
  MusicPlaylist: 'MusicPlaylist',
  AIProviderConfig: 'AIProviderConfig',
  AIConversation: 'AIConversation',
  Giveaway: 'Giveaway',
  GiveawayEntry: 'GiveawayEntry',
  ReactionRole: 'ReactionRole',
  WelcomeSettings: 'WelcomeSettings',
  VerificationSettings: 'VerificationSettings',
  LoggingSettings: 'LoggingSettings',
  PremiumSubscription: 'PremiumSubscription',
  AnalyticsEvent: 'AnalyticsEvent',
  Portfolio: 'Portfolio',
  SchedulerTask: 'SchedulerTask',
  AuditLogEntry: 'AuditLogEntry',
  Backup: 'Backup',
  Invite: 'Invite'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
