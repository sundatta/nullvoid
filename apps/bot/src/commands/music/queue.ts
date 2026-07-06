import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class QueueCommand extends BaseCommand {
  public data = new SlashCommandBuilder().setName('queue').setDescription('View the music queue');
  public category = 'music';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(0x5865F2).setTitle('🎶 Music Queue').setDescription('No tracks in queue.')] });
  }
}
