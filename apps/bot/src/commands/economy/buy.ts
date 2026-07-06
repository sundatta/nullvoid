import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository, getPrisma } from '@nullvoid/database';
import { ensureUserAndGuild } from '../../utils/database.js';

export default class BuyCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy an item from the shop')
    .addStringOption((opt) => opt.setName('item').setDescription('Item name').setRequired(true));

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const itemName = interaction.options.getString('item', true);
    const prisma = getPrisma();
    const repo = new EconomyRepository();

    const item = await prisma.economyItem.findFirst({ where: { name: { equals: itemName } } });
    if (!item) {
      await interaction.reply({ content: 'Item not found.', ephemeral: true });
      return;
    }

    const profile = await repo.getProfile(interaction.user.id, interaction.guildId!);
    if (profile.wallet < item.price) {
      await interaction.reply({ content: 'You cannot afford this item.', ephemeral: true });
      return;
    }

    await ensureUserAndGuild(interaction.user.id, interaction.guildId!);
    await prisma.economyProfile.update({ where: { userId_guildId: { userId: interaction.user.id, guildId: interaction.guildId! } }, data: { wallet: { decrement: item.price } } });
    await prisma.inventoryItem.upsert({ where: { userId_guildId_itemId: { userId: interaction.user.id, guildId: interaction.guildId!, itemId: item.id } }, update: { quantity: { increment: 1 } }, create: { userId: interaction.user.id, guildId: interaction.guildId!, itemId: item.id, quantity: 1 } });

    const embed = new EmbedBuilder().setColor(0x57F287).setTitle('Purchase Complete').setDescription(`You bought **${item.name}** for $${item.price.toLocaleString()}.`);
    await interaction.reply({ embeds: [embed] });
  }
}
