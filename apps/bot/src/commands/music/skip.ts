import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class SkipCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song');

  public category = 'music';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(0x5865F2).setTitle('⏭ Skipped').setDescription('Skipped the current track.')] });
  }
}
