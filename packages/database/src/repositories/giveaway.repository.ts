import { getPrisma } from '../client.js';

export class GiveawayRepository {
  async create(data: {
    guildId: string;
    channelId: string;
    messageId: string;
    prize: string;
    winners: number;
    endAt: Date;
    createdBy: string;
    description?: string;
    requirements?: Record<string, unknown>;
    bonusRoleIds?: string[];
    blacklistedRoleIds?: string[];
  }) {
    await getPrisma().guild.upsert({ where: { id: data.guildId }, update: {}, create: { id: data.guildId, name: data.guildId, ownerId: '' } });
    return getPrisma().giveaway.create({
      data: {
        ...data,
        description: data.description ?? null,
        requirements: JSON.stringify(data.requirements ?? {}),
        bonusRoleIds: JSON.stringify(data.bonusRoleIds ?? []),
        blacklistedRoleIds: JSON.stringify(data.blacklistedRoleIds ?? []),
      },
    });
  }

  async findById(id: string) {
    return getPrisma().giveaway.findUnique({ where: { id }, include: { entries: true } });
  }

  async findByMessage(messageId: string) {
    return getPrisma().giveaway.findUnique({ where: { messageId }, include: { entries: true } });
  }

  async getActiveGiveaways() {
    return getPrisma().giveaway.findMany({
      where: { ended: false, endAt: { lte: new Date() } },
      include: { entries: true },
    });
  }

  async getPendingGiveaways(guildId?: string) {
    const where = guildId ? { guildId, ended: false } : { ended: false };
    return getPrisma().giveaway.findMany({
      where,
      include: { entries: true },
    });
  }

  async end(id: string) {
    return getPrisma().giveaway.update({ where: { id }, data: { ended: true } });
  }

  async addEntry(giveawayId: string, userId: string, entries = 1) {
    return getPrisma().giveawayEntry.upsert({
      where: { giveawayId_userId: { giveawayId, userId } },
      update: { entries: { increment: entries } },
      create: { giveawayId, userId, entries },
    });
  }

  async getEntries(giveawayId: string) {
    return getPrisma().giveawayEntry.findMany({ where: { giveawayId } });
  }

  async delete(id: string) {
    return getPrisma().giveaway.delete({ where: { id } });
  }
}
