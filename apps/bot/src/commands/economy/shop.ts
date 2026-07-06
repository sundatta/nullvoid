import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository } from '@nullvoid/database';

export default class ShopCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View the item shop')
    .addStringOption((opt) => opt.setName('category').setDescription('Filter by category'));

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const category = interaction.options.getString('category');
    const repo = new EconomyRepository();
    const items = await repo.getItems(category ?? undefined);

    if (!items.length) {
      await interaction.reply({ content: 'The shop is empty.', ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C).setTitle('🛒 Shop')
      .setDescription(items.map((i) => `**${i.name}** — $${i.price.toLocaleString()}\n${i.description}`).join('\n\n'));
    await interaction.reply({ embeds: [embed] });
  }
}
