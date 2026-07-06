import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository } from '@nullvoid/database';

export default class InventoryCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View your inventory');

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const repo = new EconomyRepository();
    const items = await repo.getInventory(interaction.user.id, interaction.guildId!);

    if (!items.length) {
      await interaction.reply({ content: 'Your inventory is empty.', ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2).setTitle(`${interaction.user.username}'s Inventory`)
      .setDescription(items.map((i) => `**${i.item.name}** x${i.quantity}`).join('\n'));
    await interaction.reply({ embeds: [embed] });
  }
}
