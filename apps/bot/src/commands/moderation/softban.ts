import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class SoftbanCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Ban and immediately unban a member (clears messages)')
    .addUserOption((opt) => opt.setName('user').setDescription('The user').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const target = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') ?? 'Softban';

    await interaction.guild?.members.ban(target.id, { reason: `[${interaction.user.tag}] ${reason}`, deleteMessageSeconds: 86400 });
    await interaction.guild?.members.unban(target.id, 'Softban complete');

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C).setTitle('Member Softbanned')
      .setDescription(`${target} has been softbanned (messages cleared).`)
      .addFields({ name: 'Reason', value: reason }, { name: 'Moderator', value: interaction.user.tag }).setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  }
}
