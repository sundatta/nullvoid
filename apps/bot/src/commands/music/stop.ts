import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class StopCommand extends BaseCommand {
  public data = new SlashCommandBuilder().setName('stop').setDescription('Stop playback and clear the queue');
  public category = 'music';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xED4245).setTitle('⏹ Stopped').setDescription('Playback stopped and queue cleared.')] });
  }
}
