import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { LevelingRepository, getPrisma } from '@nullvoid/database';

export default class PrestigeCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('prestige')
    .setDescription('Prestige to reset your level and earn perks');

  public category = 'leveling';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const repo = new LevelingRepository();
    const profile = await repo.getProfile(interaction.user.id, interaction.guildId!);

    if (profile.level < 100) {
      await interaction.reply({ content: 'You need to be at least **Level 100** to prestige.', ephemeral: true });
      return;
    }

    const newPrestige = profile.prestige + 1;
    await getPrisma().levelingProfile.update({
      where: { userId_guildId: { userId: interaction.user.id, guildId: interaction.guildId! } },
      data: { level: 1, xp: 0, totalXp: profile.totalXp, prestige: newPrestige },
    });

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6).setTitle('🌟 Prestige!')
      .setDescription(`You prestiged to **Prestige ${newPrestige}**!\nYour level has been reset to 1.`);
    await interaction.reply({ embeds: [embed] });
  }
}
