import { getPrisma } from '../client.js';

export class PortfolioRepository {
  async upsert(userId: string, guildId: string, data: {
    type?: string;
    theme?: string;
    title?: string;
    subtitle?: string;
    about?: string;
    sections?: unknown[];
    projects?: unknown[];
    socialLinks?: Record<string, string>;
  }) {
    await Promise.all([
      getPrisma().user.upsert({ where: { id: userId }, update: {}, create: { id: userId, discordId: userId, username: userId, discriminator: '0000' } }),
      getPrisma().guild.upsert({ where: { id: guildId }, update: {}, create: { id: guildId, name: guildId, ownerId: '' } }),
    ]);
    return getPrisma().portfolio.upsert({
      where: { userId_guildId: { userId, guildId } },
      update: {
        ...data,
        sections: data.sections ? JSON.stringify(data.sections) : undefined,
        projects: data.projects ? JSON.stringify(data.projects) : undefined,
        socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : undefined,
      },
      create: {
        userId,
        guildId,
        type: data.type ?? 'personal',
        theme: data.theme ?? 'dark',
        title: data.title ?? 'My Portfolio',
        subtitle: data.subtitle ?? null,
        about: data.about ?? null,
        sections: JSON.stringify(data.sections ?? []),
        projects: JSON.stringify(data.projects ?? []),
        socialLinks: JSON.stringify(data.socialLinks ?? {}),
      },
    });
  }

  async findByUser(userId: string, guildId: string) {
    return getPrisma().portfolio.findUnique({
      where: { userId_guildId: { userId, guildId } },
    });
  }

  async findByDomain(domain: string) {
    return getPrisma().portfolio.findUnique({ where: { domain } });
  }

  async publish(id: string, domain: string) {
    return getPrisma().portfolio.update({
      where: { id },
      data: { published: true, domain },
    });
  }

  async unpublish(id: string) {
    return getPrisma().portfolio.update({
      where: { id },
      data: { published: true, domain: null },
    });
  }

  async incrementViews(id: string) {
    return getPrisma().portfolio.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async delete(id: string) {
    return getPrisma().portfolio.delete({ where: { id } });
  }

  async getPublished() {
    return getPrisma().portfolio.findMany({
      where: { published: true },
    });
  }

  async setCustomDomain(id: string, domain: string | null) {
    return getPrisma().portfolio.update({
      where: { id },
      data: { customDomain: domain },
    });
  }
}
