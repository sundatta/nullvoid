import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class SlowmodeCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode in a channel')
    .addIntegerOption((opt) => opt.setName('seconds').setDescription('Seconds between messages (0 = off)').setRequired(true).setMinValue(0).setMaxValue(21600))
    .addChannelOption((opt) => opt.setName('channel').setDescription('Target channel'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const seconds = interaction.options.getInteger('seconds', true);
    const channel = (interaction.options.getChannel('channel') ?? interaction.channel)!;

    if (!('setRateLimitPerUser' in channel)) {
      await interaction.reply({ content: 'This channel does not support slowmode.', ephemeral: true });
      return;
    }

    await channel.setRateLimitPerUser(seconds, `Set by ${interaction.user.tag}`);
    const embed = new EmbedBuilder()
      .setColor(0x5865F2).setTitle('Slowmode Updated')
      .setDescription(`Slowmode in ${channel} set to **${seconds} second(s)**.`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
}
