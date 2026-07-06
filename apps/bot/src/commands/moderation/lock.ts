import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, EmbedBuilder, type TextChannel, type NewsChannel } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class LockCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel')
    .addChannelOption((opt) => opt.setName('channel').setDescription('Channel to lock'))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const channel = (interaction.options.getChannel('channel') ?? interaction.channel) as TextChannel | NewsChannel | null;
    const reason = interaction.options.getString('reason') ?? 'Locked';
    if (!channel) {
      await interaction.reply({ content: 'Invalid channel.', ephemeral: true });
      return;
    }

    await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, { SendMessages: false }, { reason: `[${interaction.user.tag}] ${reason}` });
    const embed = new EmbedBuilder().setColor(0xED4245).setTitle('Channel Locked').setDescription(`${channel} has been locked.`).addFields({ name: 'Reason', value: reason }).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
}
