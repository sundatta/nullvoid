import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, EmbedBuilder, type TextChannel, type NewsChannel } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class UnlockCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel')
    .addChannelOption((opt) => opt.setName('channel').setDescription('Channel to unlock'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const channel = (interaction.options.getChannel('channel') ?? interaction.channel) as TextChannel | NewsChannel | null;
    if (!channel) {
      await interaction.reply({ content: 'Invalid channel.', ephemeral: true });
      return;
    }

    await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, { SendMessages: null }, { reason: `Unlocked by ${interaction.user.tag}` });
    const embed = new EmbedBuilder().setColor(0x57F287).setTitle('Channel Unlocked').setDescription(`${channel} has been unlocked.`).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
}
