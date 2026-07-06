import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository, getPrisma } from '@nullvoid/database';

export default class DailyCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward');

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const repo = new EconomyRepository();
    const profile = await repo.getProfile(interaction.user.id, interaction.guildId!);

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;
    if (profile.lastDaily && now - profile.lastDaily.getTime() < cooldown) {
      const remaining = cooldown - (now - profile.lastDaily.getTime());
      const hours = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      await interaction.reply({ content: `You can claim your daily again in **${hours}h ${mins}m**.`, ephemeral: true });
      return;
    }

    const base = 100;
    const streak = profile.dailyStreak + 1;
    const bonus = Math.min(streak * 10, 500);
    const amount = base + bonus;

    await repo.updateWallet(interaction.user.id, interaction.guildId!, amount);
    await getPrisma().economyProfile.update({
      where: { userId_guildId: { userId: interaction.user.id, guildId: interaction.guildId! } },
      data: { dailyStreak: streak, lastDaily: new Date() },
    });

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C).setTitle('Daily Reward')
      .setDescription(`You received **$${amount}**!${bonus > 0 ? `\nStreak bonus: +$${bonus}` : ''}`)
      .setFooter({ text: `Day ${streak}` });
    await interaction.reply({ embeds: [embed] });
  }
}
