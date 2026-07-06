import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class VolumeCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the player volume')
    .addIntegerOption((opt) => opt.setName('level').setDescription('Volume 1-100').setMinValue(1).setMaxValue(100));

  public category = 'music';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const level = interaction.options.getInteger('level') ?? 50;
    const embed = new EmbedBuilder().setColor(0x5865F2).setTitle('🔊 Volume').setDescription(`Volume set to **${level}%**.`);
    await interaction.reply({ embeds: [embed] });
  }
}
