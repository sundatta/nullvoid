import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { ModerationRepository } from '@nullvoid/database';

export default class CaseCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('case')
    .setDescription('View moderation case history for a user')
    .addUserOption((opt) => opt.setName('user').setDescription('Target user').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const target = interaction.options.getUser('user', true);
    const repo = new ModerationRepository();
    const cases = await repo.getCasesByUser(interaction.guildId!, target.id);

    if (!cases.length) {
      await interaction.reply({ content: `${target} has no moderation history.`, ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2).setTitle(`Cases for ${target.tag}`)
      .setDescription(cases.slice(0, 10).map((c) =>
        `**#${c.id.slice(0, 6)}** | ${c.type.toUpperCase()} | ${c.reason} — <t:${Math.floor(c.createdAt.getTime() / 1000)}:R>`,
      ).join('\n'))
      .setFooter({ text: `${cases.length} total cases` });
    await interaction.reply({ embeds: [embed] });
  }
}
