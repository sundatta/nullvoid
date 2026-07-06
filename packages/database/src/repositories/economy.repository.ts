import { getPrisma } from '../client.js';

export class EconomyRepository {
  async getProfile(userId: string, guildId: string) {
    await this.ensureParentRecords(userId, guildId);
    return getPrisma().economyProfile.upsert({
      where: { userId_guildId: { userId, guildId } },
      update: {},
      create: { userId, guildId },
    });
  }

  private async ensureParentRecords(userId: string, guildId: string) {
    await Promise.all([
      getPrisma().user.upsert({ where: { id: userId }, update: {}, create: { id: userId, discordId: userId, username: userId, discriminator: '0000' } }),
      getPrisma().guild.upsert({ where: { id: guildId }, update: {}, create: { id: guildId, name: guildId, ownerId: '' } }),
    ]);
  }

  async updateWallet(userId: string, guildId: string, amount: number) {
    return getPrisma().economyProfile.update({
      where: { userId_guildId: { userId, guildId } },
      data: { wallet: { increment: amount } },
    });
  }

  async updateBank(userId: string, guildId: string, amount: number) {
    return getPrisma().economyProfile.update({
      where: { userId_guildId: { userId, guildId } },
      data: { bank: { increment: amount } },
    });
  }

  async transfer(fromId: string, toId: string, guildId: string, amount: number, description: string) {
    const fromProfile = await this.getProfile(fromId, guildId);

    if (fromProfile.wallet < amount) throw new Error('Insufficient funds');

    await Promise.all([
      getPrisma().economyProfile.update({
        where: { userId_guildId: { userId: fromId, guildId } },
        data: { wallet: { decrement: amount }, totalSpent: { increment: amount } },
      }),
      getPrisma().economyProfile.update({
        where: { userId_guildId: { userId: toId, guildId } },
        data: { wallet: { increment: amount }, totalEarned: { increment: amount } },
      }),
    ]);

    return getPrisma().economyTransaction.create({
      data: { fromId, toId, guildId, amount, type: 'transfer', description },
    });
  }

  async getLeaderboard(guildId: string, field: 'wallet' | 'bank' | 'totalEarned' = 'wallet', limit = 10) {
    return getPrisma().economyProfile.findMany({
      where: { guildId },
      orderBy: { [field]: 'desc' },
      take: limit,
    });
  }

  async createItem(data: { name: string; description: string; price: number; category: string }) {
    return getPrisma().economyItem.create({ data });
  }

  async getItems(category?: string) {
    const where = category ? { category } : {};
    return getPrisma().economyItem.findMany({ where });
  }

  async addToInventory(userId: string, guildId: string, itemId: string, quantity = 1) {
    return getPrisma().inventoryItem.upsert({
      where: { userId_guildId_itemId: { userId, guildId, itemId } },
      update: { quantity: { increment: quantity } },
      create: { userId, guildId, itemId, quantity },
    });
  }

  async getInventory(userId: string, guildId: string) {
    return getPrisma().inventoryItem.findMany({
      where: { userId, guildId },
      include: { item: true },
    });
  }
}
