import { getPrisma } from '../client.js';

export class TicketRepository {
  async create(data: {
    guildId: string;
    channelId: string;
    creatorId: string;
    panelId?: string;
    department?: string;
    priority?: string;
  }) {
    await Promise.all([
      getPrisma().user.upsert({ where: { id: data.creatorId }, update: {}, create: { id: data.creatorId, discordId: data.creatorId, username: data.creatorId, discriminator: '0000' } }),
      getPrisma().guild.upsert({ where: { id: data.guildId }, update: {}, create: { id: data.guildId, name: data.guildId, ownerId: '' } }),
    ]);
    return getPrisma().ticket.create({ data });
  }

  async findById(id: string) {
    return getPrisma().ticket.findUnique({ where: { id } });
  }

  async findByChannel(channelId: string) {
    return getPrisma().ticket.findUnique({ where: { channelId } });
  }

  async findByGuild(guildId: string, status?: string) {
    const where = status ? { guildId, status } : { guildId };
    return getPrisma().ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async claim(ticketId: string, claimerId: string) {
    return getPrisma().ticket.update({
      where: { id: ticketId },
      data: { claimerId, status: 'claimed' },
    });
  }

  async close(ticketId: string, reason?: string) {
    return getPrisma().ticket.update({
      where: { id: ticketId },
      data: { status: 'closed', closeReason: reason, closedAt: new Date() },
    });
  }

  async reopen(ticketId: string) {
    return getPrisma().ticket.update({
      where: { id: ticketId },
      data: { status: 'open', closeReason: null, closedAt: null },
    });
  }

  async rate(ticketId: string, rating: number) {
    return getPrisma().ticket.update({
      where: { id: ticketId },
      data: { rating },
    });
  }

  async addMessage(ticketId: string, authorId: string, content: string, attachments?: string[]) {
    return getPrisma().ticketMessage.create({
      data: { ticketId, authorId, content, attachments: JSON.stringify(attachments ?? []) },
    });
  }

  async getMessages(ticketId: string) {
    return getPrisma().ticketMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createPanel(data: {
    guildId: string;
    channelId: string;
    title: string;
    description: string;
    department?: string;
    priority?: string;
    type?: string;
  }) {
    return getPrisma().ticketPanel.create({ data });
  }

  async getPanels(guildId: string) {
    return getPrisma().ticketPanel.findMany({ where: { guildId } });
  }

  async getStats(guildId: string) {
    const [total, open, claimed, closed] = await Promise.all([
      getPrisma().ticket.count({ where: { guildId } }),
      getPrisma().ticket.count({ where: { guildId, status: 'open' } }),
      getPrisma().ticket.count({ where: { guildId, status: 'claimed' } }),
      getPrisma().ticket.count({ where: { guildId, status: 'closed' } }),
    ]);
    return { total, open, claimed, closed };
  }
}
