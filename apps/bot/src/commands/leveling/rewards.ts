import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { getPrisma } from '@nullvoid/database';

export default class RewardsCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('rewards')
    .setDescription('View level-up rewards')
    .addSubcommand((sub) => sub.setName('list').setDescription('List all configured rewards'))
    .addSubcommand((sub) =>
      sub.setName('add').setDescription('Add a level reward (Admin)')
        .addIntegerOption((opt) => opt.setName('level').setDescription('Level').setRequired(true).setMinValue(1))
        .addRoleOption((opt) => opt.setName('role').setDescription('Role to grant').setRequired(true)))
    .addSubcommand((sub) =>
      sub.setName('remove').setDescription('Remove a level reward (Admin)')
        .addIntegerOption((opt) => opt.setName('level').setDescription('Level').setRequired(true).setMinValue(1)));

  public category = 'leveling';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sub = interaction.options.getSubcommand();

    if (sub === 'list') {
      const prisma = getPrisma();
      const rewards = await prisma.levelReward.findMany({ where: { guildId: interaction.guildId! }, orderBy: { level: 'asc' } });
      if (!rewards.length) {
        await interaction.reply({ content: 'No level rewards configured.', ephemeral: true });
        return;
      }
      const embed = new EmbedBuilder()
        .setColor(0x5865F2).setTitle('🎖️ Level Rewards')
        .setDescription(rewards.map((r) => `Level **${r.level}** → <@&${r.roleId}>`).join('\n'));
      await interaction.reply({ embeds: [embed] });
    } else if (sub === 'add') {
      const level = interaction.options.getInteger('level', true);
      const role = interaction.options.getRole('role', true);
      const prisma = getPrisma();
      await prisma.levelReward.upsert({
        where: { guildId_level: { guildId: interaction.guildId!, level } },
        update: { roleId: role.id },
        create: { guildId: interaction.guildId!, level, roleId: role.id },
      });
      await interaction.reply({ content: `Reward set: Level **${level}** → ${role}`, ephemeral: true });
    } else if (sub === 'remove') {
      const level = interaction.options.getInteger('level', true);
      const prisma = getPrisma();
      await prisma.levelReward.deleteMany({ where: { guildId: interaction.guildId!, level } });
      await interaction.reply({ content: `Reward for level ${level} removed.`, ephemeral: true });
    }
  }
}
