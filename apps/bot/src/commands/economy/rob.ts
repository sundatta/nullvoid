import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository } from '@nullvoid/database';

export default class RobCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Rob another user')
    .addUserOption((opt) => opt.setName('user').setDescription('Target').setRequired(true));

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const target = interaction.options.getUser('user', true);
    if (target.id === interaction.user.id) {
      await interaction.reply({ content: 'You cannot rob yourself.', ephemeral: true });
      return;
    }

    const repo = new EconomyRepository();
    const attacker = await repo.getProfile(interaction.user.id, interaction.guildId!);
    const victim = await repo.getProfile(target.id, interaction.guildId!);

    if (victim.wallet < 1) {
      await interaction.reply({ content: `${target} has no money to steal.`, ephemeral: true });
      return;
    }

    const success = Math.random() < 0.4;
    if (success) {
      const stealAmount = Math.min(victim.wallet, Math.floor(Math.random() * 200) + 50);
      await repo.updateWallet(interaction.user.id, interaction.guildId!, stealAmount);
      await repo.updateWallet(target.id, interaction.guildId!, -stealAmount);
      const embed = new EmbedBuilder().setColor(0x57F287).setTitle('💰 Robbery Successful').setDescription(`You stole **$${stealAmount}** from ${target}.`);
      await interaction.reply({ embeds: [embed] });
    } else {
      const fine = Math.min(attacker.wallet, Math.floor(Math.random() * 100) + 25);
      if (attacker.wallet >= fine) {
        await repo.updateWallet(interaction.user.id, interaction.guildId!, -fine);
        await repo.updateWallet(target.id, interaction.guildId!, fine);
      }
      const embed = new EmbedBuilder().setColor(0xED4245).setTitle('🚔 Robbery Failed').setDescription(`You got caught and paid **$${fine}** to ${target}.`);
      await interaction.reply({ embeds: [embed] });
    }
  }
}
