import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class PlayCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube/Spotify')
    .addStringOption((opt) => opt.setName('query').setDescription('Song name or URL').setRequired(true));

  public category = 'music';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const query = interaction.options.getString('query', true);
    const member = await interaction.guild?.members.fetch(interaction.user.id).catch(() => null);
    const voiceChannel = member?.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
      return;
    }

    await interaction.reply({ embeds: [new EmbedBuilder().setColor(0x5865F2).setTitle('🔍 Searching').setDescription(`Searching for **${query}**...`)] });
  }
}
