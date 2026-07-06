import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository } from '@nullvoid/database';

export default class BalanceCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('balance')
    .setDescription('View your wallet and bank balance')
    .addUserOption((opt) => opt.setName('user').setDescription('Target user'));

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const target = interaction.options.getUser('user') ?? interaction.user;
    const repo = new EconomyRepository();
    const profile = await repo.getProfile(target.id, interaction.guildId!);

    const embed = new EmbedBuilder()
      .setColor(0x57F287).setTitle(`${target.tag}'s Balance`)
      .addFields(
        { name: '💰 Wallet', value: `$${profile.wallet.toLocaleString()}`, inline: true },
        { name: '🏦 Bank', value: `$${profile.bank.toLocaleString()} / $${profile.bankMax.toLocaleString()}`, inline: true },
        { name: '📊 Total', value: `$${(profile.wallet + profile.bank).toLocaleString()}`, inline: true },
      )
      .setFooter({ text: `Daily streak: ${profile.dailyStreak}` });
    await interaction.reply({ embeds: [embed] });
  }
}
