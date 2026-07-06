import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { ModerationRepository } from '@nullvoid/database';

export default class WarningsCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a user')
    .addUserOption((opt) => opt.setName('user').setDescription('Target user').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const target = interaction.options.getUser('user', true);
    const repo = new ModerationRepository();
    const warnings = await repo.getWarningsByUser(interaction.guildId!, target.id);

    if (!warnings.length) {
      await interaction.reply({ content: `${target} has no warnings.`, ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle(`Warnings for ${target.tag}`)
      .setDescription(warnings.map((w, i) => `**#${i + 1}** | ${w.reason} — <t:${Math.floor(w.createdAt.getTime() / 1000)}:R>`).join('\n'))
      .setFooter({ text: `Total: ${warnings.length} warnings` });
    await interaction.reply({ embeds: [embed] });
  }
}
