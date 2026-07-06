import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { AIService } from '../../services/ai.service.js';

const aiService = new AIService();

export default class TranslateCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate text to another language')
    .addStringOption((opt) => opt.setName('text').setDescription('Text to translate').setRequired(true))
    .addStringOption((opt) => opt.setName('language').setDescription('Target language (e.g., es, fr, ja)').setRequired(true));

  public category = 'ai';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const text = interaction.options.getString('text', true);
    const language = interaction.options.getString('language', true);
    await interaction.deferReply();

    const prompt = `Translate the following text to ${language}. Respond with ONLY the translation:\n\n${text}`;
    const reply = await aiService.chat(interaction.user.id, interaction.guildId!, interaction.channelId, prompt, false);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2).setTitle('🌐 Translation')
      .setDescription(`**Original:** ${text}\n\n**Translation:** ${reply}`);
    await interaction.editReply({ embeds: [embed] });
  }
}
