import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { GiveawayRepository } from '@nullvoid/database';

export default class GiveawayCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Giveaway commands')
    .addSubcommand((sub) =>
      sub.setName('start').setDescription('Start a giveaway')
        .addStringOption((opt) => opt.setName('prize').setDescription('Prize name').setRequired(true))
        .addIntegerOption((opt) => opt.setName('winners').setDescription('Number of winners').setRequired(true).setMinValue(1))
        .addIntegerOption((opt) => opt.setName('duration').setDescription('Duration in minutes').setRequired(true).setMinValue(1))
    )
    .addSubcommand((sub) =>
      sub.setName('end').setDescription('End a giveaway early')
        .addStringOption((opt: any) => opt.setName('message_id').setDescription('Giveaway message ID').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('reroll').setDescription('Reroll giveaway winners')
        .addStringOption((opt: any) => opt.setName('message_id').setDescription('Giveaway message ID').setRequired(true))
    );

  public category = 'giveaway';
  private repo = new GiveawayRepository();

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sub = interaction.options.getSubcommand();
    if (sub === 'start') await this.start(interaction);
    else if (sub === 'end') await this.end(interaction);
    else if (sub === 'reroll') await this.reroll(interaction);
  }

  private async start(interaction: ChatInputCommandInteraction) {
    const prize = interaction.options.getString('prize', true);
    const winners = interaction.options.getInteger('winners', true);
    const duration = interaction.options.getInteger('duration', true);

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C).setTitle(`🎉 ${prize}`)
      .setDescription(`React with 🎉 to enter!\nWinners: **${winners}**\nHosted by: ${interaction.user}`)
      .setFooter({ text: `Ends` })
      .setTimestamp(Date.now() + duration * 60000);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('giveaway_enter').setEmoji('🎉').setStyle(ButtonStyle.Secondary)
    );

    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    await this.repo.create({
      guildId: interaction.guildId!,
      channelId: interaction.channelId,
      messageId: msg.id,
      prize,
      winners,
      endAt: new Date(Date.now() + duration * 60000),
      createdBy: interaction.user.id,
    });

    await interaction.followUp({ content: 'Giveaway started!', ephemeral: true });
  }

  private async end(interaction: ChatInputCommandInteraction) {
    const messageId = interaction.options.getString('message_id', true);
    const giveaway = await this.repo.findByMessage(messageId);
    if (!giveaway) {
      await interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
      return;
    }
    await this.repo.end(giveaway.id);
    await interaction.reply({ content: 'Giveaway ended.', ephemeral: true });
  }

  private async reroll(interaction: ChatInputCommandInteraction) {
    const messageId = interaction.options.getString('message_id', true);
    const giveaway = await this.repo.findByMessage(messageId);
    if (!giveaway) {
      await interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
      return;
    }
    const entries = await this.repo.getEntries(giveaway.id);
    if (!entries.length) {
      await interaction.reply({ content: 'No participants to reroll.', ephemeral: true });
      return;
    }
    const winner = entries[Math.floor(Math.random() * entries.length)];
    await interaction.reply({ content: `New winner: <@${winner.userId}> for **${giveaway.prize}**!` });
  }
}
