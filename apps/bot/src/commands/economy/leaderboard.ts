import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository } from '@nullvoid/database';

export default class EconomyLeaderboardCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('ecoleaderboard')
    .setDescription('View the richest users');

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const repo = new EconomyRepository();
    const top = await repo.getLeaderboard(interaction.guildId!, 'wallet', 10);

    if (!top.length) {
      await interaction.reply({ content: 'No economy data yet.', ephemeral: true });
      return;
    }

    const lines = await Promise.all(top.map(async (p, i) => {
      const user = await interaction.client.users.fetch(p.userId).catch(() => null);
      return `**#${i + 1}** ${user?.tag ?? 'Unknown'} — $${(p.wallet + p.bank).toLocaleString()}`;
    }));

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C).setTitle('🏆 Economy Leaderboard')
      .setDescription(lines.join('\n'));
    await interaction.reply({ embeds: [embed] });
  }
}
