import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { ModerationRepository } from '@nullvoid/database';

export default class WarnCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption((opt) => opt.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for the warning').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const target = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason', true);

    const repo = new ModerationRepository();
    await repo.createWarning({ guildId: interaction.guildId!, userId: target.id, moderatorId: interaction.user.id, reason });

    const points = await repo.getWarningPoints(interaction.guildId!, target.id);
    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle('Member Warned')
      .setDescription(`${target} has been warned.`)
      .addFields({ name: 'Reason', value: reason }, { name: 'Total Points', value: `${points}`, inline: true }, { name: 'Moderator', value: interaction.user.tag, inline: true })
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  }
}
