import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository } from '@nullvoid/database';

export default class TransferCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer money to another user')
    .addUserOption((opt) => opt.setName('user').setDescription('Recipient').setRequired(true))
    .addIntegerOption((opt) => opt.setName('amount').setDescription('Amount').setRequired(true).setMinValue(1));

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const target = interaction.options.getUser('user', true);
    const amount = interaction.options.getInteger('amount', true);

    if (target.id === interaction.user.id) {
      await interaction.reply({ content: 'You cannot transfer money to yourself.', ephemeral: true });
      return;
    }

    const repo = new EconomyRepository();
    try {
      await repo.transfer(interaction.user.id, target.id, interaction.guildId!, amount, `Transfer to ${target.tag}`);
      const embed = new EmbedBuilder()
        .setColor(0x57F287).setTitle('Transfer Complete')
        .setDescription(`Transferred **$${amount.toLocaleString()}** to ${target}.`);
      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply({ content: 'Insufficient funds.', ephemeral: true });
    }
  }
}
