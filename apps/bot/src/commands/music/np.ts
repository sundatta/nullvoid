import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class NowPlayingCommand extends BaseCommand {
  public data = new SlashCommandBuilder().setName('np').setDescription('Show the currently playing song');
  public category = 'music';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(0x5865F2).setTitle('🎵 Now Playing').setDescription('Nothing is playing right now.')] });
  }
}
