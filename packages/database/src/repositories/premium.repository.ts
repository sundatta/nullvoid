import { getPrisma } from '../client.js';

export class PremiumRepository {
  async createSubscription(data: {
    guildId?: string;
    userId?: string;
    type: string;
    tier: string;
    startAt: Date;
    endAt: Date;
  }) {
    return getPrisma().premiumSubscription.create({ data });
  }

  async isGuildPremium(guildId: string): Promise<boolean> {
    const sub = await getPrisma().premiumSubscription.findFirst({
      where: { guildId, active: true, endAt: { gte: new Date() } },
    });
    return !!sub;
  }

  async isUserPremium(userId: string): Promise<boolean> {
    const sub = await getPrisma().premiumSubscription.findFirst({
      where: { userId, active: true, endAt: { gte: new Date() } },
    });
    return !!sub;
  }

  async getGuildSubscription(guildId: string) {
    return getPrisma().premiumSubscription.findFirst({
      where: { guildId, active: true },
      orderBy: { endAt: 'desc' },
    });
  }

  async getUserSubscription(userId: string) {
    return getPrisma().premiumSubscription.findFirst({
      where: { userId, active: true },
      orderBy: { endAt: 'desc' },
    });
  }

  async expireSubscription(id: string) {
    return getPrisma().premiumSubscription.update({
      where: { id },
      data: { active: false },
    });
  }

  async expireAllOverdue(): Promise<number> {
    const result = await getPrisma().premiumSubscription.updateMany({
      where: { active: true, endAt: { lt: new Date() } },
      data: { active: false },
    });
    return result.count;
  }

  async getActiveSubscriptions() {
    return getPrisma().premiumSubscription.findMany({
      where: { active: true, endAt: { gte: new Date() } },
    });
  }
}
