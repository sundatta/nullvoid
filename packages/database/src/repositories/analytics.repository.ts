import { getPrisma } from '../client.js';

export class AnalyticsRepository {
  async track(guildId: string, type: string, metadata: Record<string, unknown> = {}) {
    return getPrisma().analyticsEvent.create({
      data: { guildId, type, metadata: JSON.stringify(metadata) },
    });
  }

  async getByType(guildId: string, type: string, from?: Date, to?: Date) {
    const where: Record<string, unknown> = { guildId, type };
    if (from || to) {
      where.timestamp = {};
      if (from) (where.timestamp as Record<string, Date>).gte = from;
      if (to) (where.timestamp as Record<string, Date>).lte = to;
    }
    return getPrisma().analyticsEvent.findMany({ where });
  }

  async getCountByType(guildId: string, type: string, from?: Date, to?: Date) {
    const where: Record<string, unknown> = { guildId, type };
    if (from || to) {
      where.timestamp = {};
      if (from) (where.timestamp as Record<string, Date>).gte = from;
      if (to) (where.timestamp as Record<string, Date>).lte = to;
    }
    return getPrisma().analyticsEvent.count({ where });
  }

  async getGroupedByType(guildId: string, from: Date, to: Date) {
    const events = await getPrisma().analyticsEvent.findMany({
      where: {
        guildId,
        timestamp: { gte: from, lte: to },
      },
    });

    const grouped: Record<string, number> = {};
    for (const event of events) {
      grouped[event.type] = (grouped[event.type] ?? 0) + 1;
    }
    return grouped;
  }

  async getDailyStats(guildId: string, days = 30) {
    const from = new Date();
    from.setDate(from.getDate() - days);

    return getPrisma().analyticsEvent.findMany({
      where: {
        guildId,
        timestamp: { gte: from },
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  async cleanup(before: Date): Promise<number> {
    const result = await getPrisma().analyticsEvent.deleteMany({
      where: { timestamp: { lt: before } },
    });
    return result.count;
  }
}
