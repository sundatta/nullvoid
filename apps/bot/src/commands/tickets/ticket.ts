import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder, ChannelType, type TextChannel, type NewsChannel } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { TicketRepository } from '@nullvoid/database';

export default class TicketCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket system commands')
    .addSubcommand((sub) => sub.setName('create').setDescription('Create a support ticket').addStringOption((opt) => opt.setName('reason').setDescription('Reason for the ticket')))
    .addSubcommand((sub) => sub.setName('close').setDescription('Close your ticket'))
    .addSubcommand((sub) => sub.setName('claim').setDescription('Claim a ticket'))
    .addSubcommand((sub) => sub.setName('reopen').setDescription('Reopen a closed ticket'))
    .addSubcommand((sub) => sub.setName('add').setDescription('Add a user to the ticket').addUserOption((opt) => opt.setName('user').setDescription('User to add').setRequired(true)))
    .addSubcommand((sub) => sub.setName('remove').setDescription('Remove a user from the ticket').addUserOption((opt) => opt.setName('user').setDescription('User to remove').setRequired(true)));

  public category = 'tickets';
  private repo = new TicketRepository();

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sub = interaction.options.getSubcommand();

    if (sub === 'create') await this.create(interaction);
    else if (sub === 'close') await this.close(interaction);
    else if (sub === 'claim') await this.claim(interaction);
    else if (sub === 'reopen') await this.reopen(interaction);
    else if (sub === 'add') await this.addUser(interaction);
    else if (sub === 'remove') await this.removeUser(interaction);
  }

  private async create(interaction: ChatInputCommandInteraction) {
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const existing = await this.repo.findByGuild(interaction.guildId!, 'open');
    if (existing.some((t) => t.creatorId === interaction.user.id)) {
      await interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });
      return;
    }

    const channel = await interaction.guild!.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: (interaction.channel as TextChannel | NewsChannel | null)?.parentId ?? undefined,
      permissionOverwrites: [
        { id: interaction.guild!.roles.everyone.id, deny: ['ViewChannel'] },
        { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
        { id: interaction.client.user!.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels'] },
      ],
    });

    await this.repo.create({ guildId: interaction.guildId!, channelId: channel.id, creatorId: interaction.user.id, priority: 'medium' });

    const embed = new EmbedBuilder().setColor(0x5865F2).setTitle('Ticket Created').setDescription(`Support ticket created. Reason: ${reason}`).setTimestamp();
    await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed] });
    await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
  }

  private async close(interaction: ChatInputCommandInteraction) {
    const ticket = await this.repo.findByChannel(interaction.channelId);
    if (!ticket || ticket.status === 'closed') {
      await interaction.reply({ content: 'This is not an open ticket.', ephemeral: true });
      return;
    }
    await this.repo.close(ticket.id, 'Closed by user');
    await interaction.reply({ content: 'Ticket closed.', ephemeral: true });
    const channel = interaction.channel as TextChannel | null;
    if (channel) {
      await channel.send({ embeds: [new EmbedBuilder().setColor(0xED4245).setTitle('Ticket Closed').setDescription('This ticket is now closed.').setTimestamp()] });
      setTimeout(() => channel.delete().catch(() => null), 5000);
    }
  }

  private async claim(interaction: ChatInputCommandInteraction) {
    const ticket = await this.repo.findByChannel(interaction.channelId);
    if (!ticket) { await interaction.reply({ content: 'Ticket not found.', ephemeral: true }); return; }
    await this.repo.claim(ticket.id, interaction.user.id);
    const embed = new EmbedBuilder().setColor(0x57F287).setTitle('Ticket Claimed').setDescription(`Claimed by ${interaction.user}`).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }

  private async reopen(interaction: ChatInputCommandInteraction) {
    const ticket = await this.repo.findByChannel(interaction.channelId);
    if (!ticket || ticket.status !== 'closed') {
      await interaction.reply({ content: 'This ticket is not closed.', ephemeral: true });
      return;
    }
    await this.repo.reopen(ticket.id);
    await interaction.reply({ content: 'Ticket reopened.' });
  }

  private async addUser(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true);
    const channel = interaction.channel as TextChannel | null;
    if (channel) {
      await channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true });
      await interaction.reply({ content: `Added ${user} to the ticket.` });
    }
  }

  private async removeUser(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true);
    const channel = interaction.channel as TextChannel | null;
    if (channel) {
      await channel.permissionOverwrites.edit(user.id, { ViewChannel: false });
      await interaction.reply({ content: `Removed ${user} from the ticket.` });
    }
  }
}
