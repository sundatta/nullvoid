import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, EmbedBuilder, type TextChannel, type NewsChannel } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class AnnounceCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement to a channel')
    .addStringOption((opt) => opt.setName('title').setDescription('Announcement title').setRequired(true))
    .addStringOption((opt) => opt.setName('message').setDescription('Announcement content').setRequired(true))
    .addChannelOption((opt) => opt.setName('channel').setDescription('Channel to send to'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

  public category = 'utility';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const title = interaction.options.getString('title', true);
    const message = interaction.options.getString('message', true);
    const targetChannel = (interaction.options.getChannel('channel') ?? interaction.channel) as TextChannel | NewsChannel | null;

    if (!targetChannel) {
      await interaction.reply({ content: 'Invalid channel.', ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(title)
      .setDescription(message)
      .setFooter({ text: `Announced by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await targetChannel.send({ embeds: [embed] });
    await interaction.reply({ content: `Announcement sent to ${targetChannel}`, ephemeral: true });
  }
}
