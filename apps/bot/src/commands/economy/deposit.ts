import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository } from '@nullvoid/database';

export default class DepositCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit money into your bank')
    .addIntegerOption((opt) => opt.setName('amount').setDescription('Amount to deposit').setRequired(true).setMinValue(1));

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const amount = interaction.options.getInteger('amount', true);
    const repo = new EconomyRepository();
    const profile = await repo.getProfile(interaction.user.id, interaction.guildId!);

    if (profile.wallet < amount) {
      await interaction.reply({ content: 'You don\'t have enough money in your wallet.', ephemeral: true });
      return;
    }
    if (profile.bank + amount > profile.bankMax) {
      await interaction.reply({ content: `Your bank can only hold $${profile.bankMax.toLocaleString()}.`, ephemeral: true });
      return;
    }

    await repo.updateWallet(interaction.user.id, interaction.guildId!, -amount);
    await repo.updateBank(interaction.user.id, interaction.guildId!, amount);

    const embed = new EmbedBuilder()
      .setColor(0x57F287).setTitle('Deposit').setDescription(`Deposited **$${amount.toLocaleString()}** into your bank.`);
    await interaction.reply({ embeds: [embed] });
  }
}
