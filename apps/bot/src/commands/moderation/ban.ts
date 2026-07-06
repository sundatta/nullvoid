import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
} from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { ModerationRepository } from '@nullvoid/database';

export default class BanCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption((opt) =>
      opt.setName('user').setDescription('The user to ban').setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName('reason').setDescription('Reason for the ban').setRequired(false),
    )
    .addIntegerOption((opt) =>
      opt.setName('days').setDescription('Days of messages to delete (0-7)').setMinValue(0).setMaxValue(7),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const target = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const days = interaction.options.getInteger('days') ?? 0;
    const member = await interaction.guild?.members.fetch(target.id).catch(() => null);

    if (member && !member.bannable) {
      await interaction.editReply('I cannot ban that user. They may have higher permissions than me.');
      return;
    }

    try {
      await interaction.guild?.members.ban(target.id, {
        reason: `[${interaction.user.tag}] ${reason}`,
        deleteMessageSeconds: days * 86400,
      });

      const repo = new ModerationRepository();
      await repo.createCase({
        guildId: interaction.guildId!,
        userId: target.id,
        moderatorId: interaction.user.id,
        type: 'ban',
        reason,
        duration: null,
      });

      await interaction.editReply({
        embeds: [{
          color: 0xED4245,
          title: 'Member Banned',
          description: `**${target.tag}** has been banned.`,
          fields: [
            { name: 'Reason', value: reason },
            { name: 'Moderator', value: interaction.user.tag },
          ],
          timestamp: new Date().toISOString(),
        }],
      });
    } catch (error) {
      this.client.logger.error({ error, userId: target.id }, 'Ban command failed');
      await interaction.editReply('An error occurred while trying to ban this user.');
    }
  }
}
