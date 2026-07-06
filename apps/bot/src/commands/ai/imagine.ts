import { SlashCommandBuilder, type ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class ImagineCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('imagine')
    .setDescription('Generate an image with AI')
    .addStringOption((opt) => opt.setName('prompt').setDescription('Image description').setRequired(true));

  public category = 'ai';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const prompt = interaction.options.getString('prompt', true);
    await interaction.deferReply();

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 100000)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      const attachment = new AttachmentBuilder(buffer, { name: 'generated.png' });

      await interaction.editReply({ content: `**${prompt}**`, files: [attachment] });
    } catch {
      await interaction.editReply({ content: 'Image generation failed. Try again later.' });
    }
  }
}
