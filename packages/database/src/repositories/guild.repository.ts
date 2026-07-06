import { getPrisma } from '../client.js';
import type { Guild } from '@prisma/client';

export class GuildRepository {
  async findById(id: string): Promise<Guild | null> {
    return getPrisma().guild.findUnique({
      where: { id },
      include: { modules: true },
    });
  }

  async upsert(id: string, name: string, ownerId: string, icon?: string | null): Promise<Guild> {
    return getPrisma().guild.upsert({
      where: { id },
      update: { name, ownerId, icon: icon ?? undefined },
      create: { id, name, ownerId, icon: icon ?? null },
    });
  }

  async update(id: string, data: Partial<Guild>): Promise<Guild> {
    return getPrisma().guild.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await getPrisma().guild.delete({ where: { id } });
  }

  async getAll(limit = 100, offset = 0): Promise<Guild[]> {
    return getPrisma().guild.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCount(): Promise<number> {
    return getPrisma().guild.count();
  }

  async setModule(guildId: string, moduleName: string, enabled: boolean): Promise<void> {
    await getPrisma().guildModuleState.upsert({
      where: { guildId_moduleName: { guildId, moduleName } },
      update: { enabled },
      create: { guildId, moduleName, enabled },
    });
  }

  async getModuleState(guildId: string, moduleName: string): Promise<boolean> {
    const module = await getPrisma().guildModuleState.findUnique({
      where: { guildId_moduleName: { guildId, moduleName } },
    });
    return module?.enabled ?? true;
  }
}
