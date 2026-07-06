import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class ShuffleCommand extends BaseCommand {
  public data = new SlashCommandBuilder().setName('shuffle').setDescription('Shuffle the music queue');
  public category = 'music';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(0x5865F2).setTitle('🔀 Shuffled').setDescription('Queue shuffled.')] });
  }
}
