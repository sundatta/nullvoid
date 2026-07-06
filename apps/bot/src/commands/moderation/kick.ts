import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
} from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { ModerationRepository } from '@nullvoid/database';

export default class KickCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption((opt) =>
      opt.setName('user').setDescription('The user to kick').setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName('reason').setDescription('Reason for the kick').setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const target = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const member = await interaction.guild?.members.fetch(target.id).catch(() => null);

    if (!member || !member.kickable) {
      await interaction.editReply('I cannot kick that user.');
      return;
    }

    try {
      await member.kick(`[${interaction.user.tag}] ${reason}`);

      const repo = new ModerationRepository();
      await repo.createCase({
        guildId: interaction.guildId!,
        userId: target.id,
        moderatorId: interaction.user.id,
        type: 'kick',
        reason,
      });

      await interaction.editReply({
        embeds: [{
          color: 0xFEE75C,
          title: 'Member Kicked',
          description: `**${target.tag}** has been kicked.`,
          fields: [
            { name: 'Reason', value: reason },
            { name: 'Moderator', value: interaction.user.tag },
          ],
          timestamp: new Date().toISOString(),
        }],
      });
    } catch (error) {
      this.client.logger.error({ error, userId: target.id }, 'Kick command failed');
      await interaction.editReply('An error occurred while trying to kick this user.');
    }
  }
}
