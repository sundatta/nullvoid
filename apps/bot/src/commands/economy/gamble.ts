import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository } from '@nullvoid/database';

export default class GambleCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('gamble')
    .setDescription('Gamble your money')
    .addIntegerOption((opt) => opt.setName('amount').setDescription('Amount to gamble').setRequired(true).setMinValue(1));

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const amount = interaction.options.getInteger('amount', true);
    const repo = new EconomyRepository();
    const profile = await repo.getProfile(interaction.user.id, interaction.guildId!);

    if (profile.wallet < amount) {
      await interaction.reply({ content: 'You don\'t have enough money in your wallet.', ephemeral: true });
      return;
    }

    const won = Math.random() < 0.45;
    const result = won ? amount : -amount;
    await repo.updateWallet(interaction.user.id, interaction.guildId!, result);

    const embed = new EmbedBuilder()
      .setColor(won ? 0x57F287 : 0xED4245)
      .setTitle(won ? '🎲 You Won!' : '🎲 You Lost!')
      .setDescription(won ? `You won **$${amount.toLocaleString()}**!` : `You lost **$${amount.toLocaleString()}**.`);
    await interaction.reply({ embeds: [embed] });
  }
}
