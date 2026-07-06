import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository } from '@nullvoid/database';

export default class WithdrawCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw money from your bank')
    .addIntegerOption((opt) => opt.setName('amount').setDescription('Amount to withdraw').setRequired(true).setMinValue(1));

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const amount = interaction.options.getInteger('amount', true);
    const repo = new EconomyRepository();
    const profile = await repo.getProfile(interaction.user.id, interaction.guildId!);

    if (profile.bank < amount) {
      await interaction.reply({ content: 'You don\'t have enough money in your bank.', ephemeral: true });
      return;
    }

    await repo.updateBank(interaction.user.id, interaction.guildId!, -amount);
    await repo.updateWallet(interaction.user.id, interaction.guildId!, amount);

    const embed = new EmbedBuilder()
      .setColor(0x57F287).setTitle('Withdraw').setDescription(`Withdrew **$${amount.toLocaleString()}** from your bank.`);
    await interaction.reply({ embeds: [embed] });
  }
}
