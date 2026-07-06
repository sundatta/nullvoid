import { getPrisma } from '../client.js';

export class LevelingRepository {
  async getProfile(userId: string, guildId: string) {
    await Promise.all([
      getPrisma().user.upsert({ where: { id: userId }, update: {}, create: { id: userId, discordId: userId, username: userId, discriminator: '0000' } }),
      getPrisma().guild.upsert({ where: { id: guildId }, update: {}, create: { id: guildId, name: guildId, ownerId: '' } }),
    ]);
    return getPrisma().levelingProfile.upsert({
      where: { userId_guildId: { userId, guildId } },
      update: {},
      create: { userId, guildId },
    });
  }

  async addXp(userId: string, guildId: string, amount: number, type: 'message' | 'voice') {
    const updateData = type === 'message'
      ? { xp: { increment: amount }, totalXp: { increment: amount }, messageXp: { increment: amount }, lastMessage: new Date() }
      : { xp: { increment: amount }, totalXp: { increment: amount }, voiceXp: { increment: amount }, lastVoice: new Date() };

    return getPrisma().levelingProfile.update({
      where: { userId_guildId: { userId, guildId } },
      data: updateData,
    });
  }

  async setLevel(userId: string, guildId: string, level: number) {
    return getPrisma().levelingProfile.update({
      where: { userId_guildId: { userId, guildId } },
      data: { level },
    });
  }

  async setPrestige(userId: string, guildId: string, prestige: number) {
    return getPrisma().levelingProfile.update({
      where: { userId_guildId: { userId, guildId } },
      data: { prestige, xp: 0, level: 0 },
    });
  }

  async getLeaderboard(guildId: string, limit = 10) {
    return getPrisma().levelingProfile.findMany({
      where: { guildId },
      orderBy: [{ prestige: 'desc' }, { level: 'desc' }, { xp: 'desc' }],
      take: limit,
    });
  }

  async addLevelReward(guildId: string, level: number, roleId: string) {
    return getPrisma().levelReward.upsert({
      where: { guildId_level: { guildId, level } },
      update: { roleId },
      create: { guildId, level, roleId },
    });
  }

  async getLevelRewards(guildId: string) {
    return getPrisma().levelReward.findMany({
      where: { guildId },
      orderBy: { level: 'asc' },
    });
  }

  async removeLevelReward(guildId: string, level: number) {
    return getPrisma().levelReward.delete({
      where: { guildId_level: { guildId, level } },
    });
  }
}
