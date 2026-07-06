import { getPrisma } from '../client.js';
import type { User } from '@prisma/client';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return getPrisma().user.findUnique({ where: { id } });
  }

  async findByDiscordId(discordId: string): Promise<User | null> {
    return getPrisma().user.findUnique({ where: { discordId } });
  }

  async upsert(discordId: string, username: string, discriminator: string, avatar?: string | null): Promise<User> {
    return getPrisma().user.upsert({
      where: { discordId },
      update: { username, discriminator, avatar: avatar ?? undefined },
      create: { id: discordId, discordId, username, discriminator, avatar: avatar ?? null },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return getPrisma().user.update({ where: { id }, data });
  }

  async getPremiumUsers(): Promise<User[]> {
    return getPrisma().user.findMany({
      where: { premium: true },
    });
  }

  async getCount(): Promise<number> {
    return getPrisma().user.count();
  }
}
