import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { LevelingRepository } from '@nullvoid/database';

export default class LevelLeaderboardCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('levelleaderboard')
    .setDescription('View the level leaderboard');

  public category = 'leveling';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const repo = new LevelingRepository();
    const top = await repo.getLeaderboard(interaction.guildId!, 10);

    if (!top.length) {
      await interaction.reply({ content: 'No leveling data yet.', ephemeral: true });
      return;
    }

    const lines = await Promise.all(top.map(async (p, i) => {
      const user = await interaction.client.users.fetch(p.userId).catch(() => null);
      return `**#${i + 1}** ${user?.tag ?? 'Unknown'} — Level ${p.level} (${p.totalXp} XP)`;
    }));

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C).setTitle('⭐ Level Leaderboard')
      .setDescription(lines.join('\n'));
    await interaction.reply({ embeds: [embed] });
  }
}
