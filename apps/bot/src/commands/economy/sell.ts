import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { getPrisma, EconomyRepository } from '@nullvoid/database';
import { ensureUserAndGuild } from '../../utils/database.js';

export default class SellCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('sell')
    .setDescription('Sell an item from your inventory')
    .addStringOption((opt) => opt.setName('item').setDescription('Item name').setRequired(true))
    .addIntegerOption((opt) => opt.setName('quantity').setDescription('Quantity').setMinValue(1));

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const itemName = interaction.options.getString('item', true);
    const quantity = interaction.options.getInteger('quantity') ?? 1;
    const prisma = getPrisma();
    const repo = new EconomyRepository();

    const item = await prisma.economyItem.findFirst({ where: { name: { equals: itemName } } });
    if (!item) {
      await interaction.reply({ content: 'Item not found.', ephemeral: true });
      return;
    }

    await ensureUserAndGuild(interaction.user.id, interaction.guildId!);
    const inv = await prisma.inventoryItem.findUnique({ where: { userId_guildId_itemId: { userId: interaction.user.id, guildId: interaction.guildId!, itemId: item.id } } });
    if (!inv || inv.quantity < quantity) {
      await interaction.reply({ content: 'You don\'t have enough of that item.', ephemeral: true });
      return;
    }

    const sellPrice = Math.floor(item.price * 0.6) * quantity;
    await prisma.inventoryItem.update({ where: { userId_guildId_itemId: { userId: interaction.user.id, guildId: interaction.guildId!, itemId: item.id } }, data: { quantity: { decrement: quantity } } });
    await repo.updateWallet(interaction.user.id, interaction.guildId!, sellPrice);

    const embed = new EmbedBuilder().setColor(0x57F287).setTitle('Item Sold').setDescription(`Sold **${quantity}x ${item.name}** for **$${sellPrice.toLocaleString()}**.`);
    await interaction.reply({ embeds: [embed] });
  }
}
