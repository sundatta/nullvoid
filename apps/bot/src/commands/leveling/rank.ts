import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { LevelingRepository } from '@nullvoid/database';

export default class RankCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('View your level rank')
    .addUserOption((opt) => opt.setName('user').setDescription('Target user'));

  public category = 'leveling';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const target = interaction.options.getUser('user') ?? interaction.user;
    const repo = new LevelingRepository();
    const profile = await repo.getProfile(target.id, interaction.guildId!);

    const nextLevelXp = (profile.level + 1) * 100;
    const embed = new EmbedBuilder()
      .setColor(0x5865F2).setTitle(`${target.tag}'s Rank`)
      .addFields(
        { name: 'Level', value: `${profile.level}`, inline: true },
        { name: 'XP', value: `${profile.xp} / ${nextLevelXp}`, inline: true },
        { name: 'Total XP', value: `${profile.totalXp}`, inline: true },
        { name: 'Messages', value: `${profile.messageXp} XP`, inline: true },
        { name: 'Voice', value: `${profile.voiceXp} XP`, inline: true },
        { name: 'Prestige', value: `${profile.prestige}`, inline: true },
      )
      .setFooter({ text: `Daily streak: ${profile.dailyStreak}` });
    await interaction.reply({ embeds: [embed] });
  }
}
