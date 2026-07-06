import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { AIService } from '../../services/ai.service.js';

const aiService = new AIService();

export default class AIChatCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Chat with the AI')
    .addStringOption((opt) => opt.setName('message').setDescription('Your message').setRequired(true));

  public category = 'ai';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const message = interaction.options.getString('message', true);
    await interaction.deferReply();

    const reply = await aiService.chat(interaction.user.id, interaction.guildId!, interaction.channelId, message);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2).setTitle('💬 AI Chat')
      .setDescription(`**You:** ${message}\n\n**AI:** ${reply}`);
    await interaction.editReply({ embeds: [embed] });
  }
}
