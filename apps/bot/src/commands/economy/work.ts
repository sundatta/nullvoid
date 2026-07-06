import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { EconomyRepository } from '@nullvoid/database';

export default class WorkCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work to earn money');

  public category = 'economy';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const repo = new EconomyRepository();

    const amount = Math.floor(Math.random() * 80) + 20;
    await repo.updateWallet(interaction.user.id, interaction.guildId!, amount);

    const jobs = ['coding', 'designing', 'consulting', 'teaching', 'freelancing'];
    const job = jobs[Math.floor(Math.random() * jobs.length)];

    const embed = new EmbedBuilder().setColor(0x57F287).setTitle('💼 Work').setDescription(`You worked **${job}** and earned **$${amount}**.`);
    await interaction.reply({ embeds: [embed] });
  }
}
