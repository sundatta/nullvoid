import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { ModerationRepository } from '@nullvoid/database';

export default class TimeoutCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption((opt) => opt.setName('user').setDescription('The user to timeout').setRequired(true))
    .addIntegerOption((opt) => opt.setName('minutes').setDescription('Duration in minutes').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const target = interaction.options.getUser('user', true);
    const minutes = interaction.options.getInteger('minutes', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const member = await interaction.guild?.members.fetch(target.id).catch(() => null);

    if (!member?.moderatable) {
      await interaction.editReply('I cannot timeout that user.');
      return;
    }

    const duration = minutes * 60 * 1000;
    await member.timeout(duration, `[${interaction.user.tag}] ${reason}`);

    const repo = new ModerationRepository();
    await repo.createCase({ guildId: interaction.guildId!, userId: target.id, moderatorId: interaction.user.id, type: 'timeout', reason, duration: minutes });

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C).setTitle('Member Timed Out')
      .setDescription(`${target} has been timed out for **${minutes} minute(s)**.`)
      .addFields({ name: 'Reason', value: reason }, { name: 'Moderator', value: interaction.user.tag })
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  }
}
