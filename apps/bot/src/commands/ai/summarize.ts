import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { AIService } from '../../services/ai.service.js';

const aiService = new AIService();

export default class SummarizeCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('summarize')
    .setDescription('Summarize a message or thread')
    .addStringOption((opt) => opt.setName('text').setDescription('Text to summarize').setRequired(true));

  public category = 'ai';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const text = interaction.options.getString('text', true);
    await interaction.deferReply();

    const prompt = `Summarize the following text concisely:\n\n${text}`;
    const reply = await aiService.chat(interaction.user.id, interaction.guildId!, interaction.channelId, prompt, false);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2).setTitle('📝 Summary')
      .setDescription(reply);
    await interaction.editReply({ embeds: [embed] });
  }
}
