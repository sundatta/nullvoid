import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class LoopCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Set loop mode')
    .addStringOption((opt) =>
      opt.setName('mode').setDescription('Loop mode')
        .addChoices({ name: 'Off', value: 'off' }, { name: 'Track', value: 'track' }, { name: 'Queue', value: 'queue' }));

  public category = 'music';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const mode = interaction.options.getString('mode') ?? 'off';
    const embed = new EmbedBuilder().setColor(0x5865F2).setTitle('🔁 Loop').setDescription(`Loop mode set to **${mode}**.`);
    await interaction.reply({ embeds: [embed] });
  }
}
