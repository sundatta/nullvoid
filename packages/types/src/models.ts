export interface GuildSettings {
  id: string;
  name: string;
  icon: string | null;
  ownerId: string;
  locale: string;
  prefix: string;
  premium: boolean;
  premiumSince: Date | null;
  modules: GuildModuleState[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GuildModuleState {
  id: string;
  guildId: string;
  moduleName: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  discordId: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  locale: string;
  premium: boolean;
  premiumSince: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModCase {
  id: string;
  guildId: string;
  userId: string;
  moderatorId: string;
  type: 'ban' | 'kick' | 'warn' | 'mute' | 'softban' | 'tempban' | 'timeout';
  reason: string;
  duration: number | null;
  evidence: string[];
  active: boolean;
  auto: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Warning {
  id: string;
  guildId: string;
  userId: string;
  moderatorId: string;
  reason: string;
  points: number;
  expired: boolean;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  guildId: string;
  channelId: string;
  creatorId: string;
  claimerId: string | null;
  panelId: string | null;
  department: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'claimed' | 'closed' | 'archived';
  rating: number | null;
  closeReason: string | null;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string;
  content: string;
  attachments: string[];
  createdAt: Date;
}

export interface TicketPanel {
  id: string;
  guildId: string;
  channelId: string;
  messageId: string | null;
  title: string;
  description: string;
  department: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'button' | 'select';
  createdAt: Date;
  updatedAt: Date;
}

export interface EconomyProfile {
  id: string;
  userId: string;
  guildId: string;
  wallet: number;
  bank: number;
  bankMax: number;
  totalEarned: number;
  totalSpent: number;
  dailyStreak: number;
  lastDaily: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EconomyItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  roleId: string | null;
  stackable: boolean;
  sellable: boolean;
  createdAt: Date;
}

export interface EconomyTransaction {
  id: string;
  fromId: string;
  toId: string;
  guildId: string;
  amount: number;
  type: string;
  description: string;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  userId: string;
  guildId: string;
  itemId: string;
  quantity: number;
  createdAt: Date;
}

export interface LevelingProfile {
  id: string;
  userId: string;
  guildId: string;
  xp: number;
  level: number;
  totalXp: number;
  voiceXp: number;
  messageXp: number;
  prestige: number;
  dailyStreak: number;
  lastMessage: Date | null;
  lastVoice: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LevelReward {
  id: string;
  guildId: string;
  level: number;
  roleId: string;
  createdAt: Date;
}

export interface MusicQueue {
  id: string;
  guildId: string;
  tracks: unknown[];
  currentTrack: number;
  loopMode: 'none' | 'track' | 'queue';
  volume: number;
  filters: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicPlaylist {
  id: string;
  userId: string;
  guildId: string;
  name: string;
  description: string;
  tracks: unknown[];
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIProviderConfig {
  id: string;
  guildId: string;
  provider: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIConversation {
  id: string;
  guildId: string;
  channelId: string;
  userId: string;
  messages: unknown[];
  context: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Giveaway {
  id: string;
  guildId: string;
  channelId: string;
  messageId: string;
  prize: string;
  description: string;
  winners: number;
  endAt: Date;
  ended: boolean;
  requirements: Record<string, unknown>;
  bonusRoleIds: string[];
  blacklistedRoleIds: string[];
  createdBy: string;
  createdAt: Date;
}

export interface GiveawayEntry {
  id: string;
  giveawayId: string;
  userId: string;
  entries: number;
  createdAt: Date;
}

export interface ReactionRole {
  id: string;
  guildId: string;
  channelId: string;
  messageId: string;
  emoji: string;
  roleId: string;
  type: 'reaction' | 'button' | 'select';
  createdAt: Date;
}

export interface WelcomeSettings {
  id: string;
  guildId: string;
  enabled: boolean;
  welcomeChannelId: string | null;
  goodbyeChannelId: string | null;
  welcomeMessage: string;
  goodbyeMessage: string;
  welcomeImage: string | null;
  autoRoleId: string | null;
  captchaEnabled: boolean;
  rulesChannelId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationSettings {
  id: string;
  guildId: string;
  enabled: boolean;
  type: 'captcha' | 'button' | 'role' | 'age' | 'email';
  verifiedRoleId: string | null;
  logChannelId: string | null;
  minAccountAge: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoggingSettings {
  id: string;
  guildId: string;
  enabled: boolean;
  logChannelId: string | null;
  options: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PremiumSubscription {
  id: string;
  guildId: string | null;
  userId: string | null;
  type: 'guild' | 'user';
  tier: 'basic' | 'pro' | 'enterprise';
  startAt: Date;
  endAt: Date;
  active: boolean;
  createdAt: Date;
}

export interface AnalyticsEvent {
  id: string;
  guildId: string;
  type: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  guildId: string;
  type: string;
  theme: string;
  title: string;
  subtitle: string;
  published: boolean;
  domain: string | null;
  customDomain: string | null;
  sections: PortfolioSection[];
  projects: PortfolioProject[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioSection {
  id: string;
  portfolioId: string;
  type: string;
  title: string;
  content: Record<string, unknown>;
  order: number;
  visible: boolean;
}

export interface PortfolioProject {
  id: string;
  portfolioId: string;
  title: string;
  description: string;
  images: string[];
  url: string | null;
  github: string | null;
  technologies: string[];
  status: string;
  order: number;
  visible: boolean;
}

export interface SchedulerTask {
  id: string;
  guildId: string;
  type: string;
  executeAt: Date;
  executed: boolean;
  data: Record<string, unknown>;
  createdAt: Date;
}

export interface AuditLogEntry {
  id: string;
  guildId: string;
  userId: string;
  action: string;
  targetId: string;
  reason: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface Backup {
  id: string;
  guildId: string;
  data: Record<string, unknown>;
  createdAt: Date;
}
