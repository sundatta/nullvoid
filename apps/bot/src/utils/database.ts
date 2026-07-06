import { getPrisma } from '@nullvoid/database';

export async function ensureUser(userId: string, username?: string): Promise<void> {
  const data: { username?: string; discordId?: string } = {};
  if (username) { data.username = username; data.discordId = userId; }
  await getPrisma().user.upsert({
    where: { id: userId },
    update: data,
    create: { id: userId, discordId: userId, username: username ?? userId, discriminator: '0000' },
  });
}

export async function ensureGuild(guildId: string, name?: string): Promise<void> {
  const data: { name?: string } = {};
  if (name) data.name = name;
  await getPrisma().guild.upsert({
    where: { id: guildId },
    update: data,
    create: { id: guildId, name: name ?? guildId, ownerId: '' },
  });
}

export async function ensureUserAndGuild(userId: string, guildId: string, username?: string, guildName?: string): Promise<void> {
  await Promise.all([ensureUser(userId, username), ensureGuild(guildId, guildName)]);
}
