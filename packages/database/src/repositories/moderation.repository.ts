import { getPrisma } from '../client.js';

export interface CreateModCaseData {
  guildId: string;
  userId: string;
  moderatorId: string;
  type: string;
  reason: string;
  duration?: number | null;
  evidence?: string[];
  auto?: boolean;
}

export class ModerationRepository {
  async createCase(data: CreateModCaseData) {
    return getPrisma().modCase.create({
      data: {
        ...data,
        evidence: JSON.stringify(data.evidence ?? []),
        duration: data.duration ?? null,
        auto: data.auto ?? false,
      },
    });
  }

  async getCase(id: string) {
    return getPrisma().modCase.findUnique({ where: { id } });
  }

  async getCasesByUser(guildId: string, userId: string) {
    return getPrisma().modCase.findMany({
      where: { guildId, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActiveCases(guildId: string) {
    return getPrisma().modCase.findMany({
      where: { guildId, active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCase(id: string, data: Partial<CreateModCaseData & { active: boolean }>) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.evidence) updateData.evidence = JSON.stringify(data.evidence);
    return getPrisma().modCase.update({ where: { id }, data: updateData });
  }

  async getCasesPaginated(guildId: string, page = 1, pageSize = 25) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      getPrisma().modCase.findMany({
        where: { guildId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      getPrisma().modCase.count({ where: { guildId } }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async createWarning(data: { guildId: string; userId: string; moderatorId: string; reason: string; points?: number }) {
    return getPrisma().warning.create({ data });
  }

  async getWarningsByUser(guildId: string, userId: string) {
    return getPrisma().warning.findMany({
      where: { guildId, userId, expired: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async expireWarning(id: string) {
    return getPrisma().warning.update({ where: { id }, data: { expired: true } });
  }

  async getWarningPoints(guildId: string, userId: string): Promise<number> {
    const result = await getPrisma().warning.aggregate({
      where: { guildId, userId, expired: false },
      _sum: { points: true },
    });
    return result._sum.points ?? 0;
  }
}
