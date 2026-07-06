import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class PollCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption((opt) => opt.setName('question').setDescription('Poll question').setRequired(true))
    .addStringOption((opt) => opt.setName('option1').setDescription('Option 1').setRequired(true))
    .addStringOption((opt) => opt.setName('option2').setDescription('Option 2').setRequired(true))
    .addStringOption((opt) => opt.setName('option3').setDescription('Option 3'))
    .addStringOption((opt) => opt.setName('option4').setDescription('Option 4'))
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);

  public category = 'utility';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const question = interaction.options.getString('question', true);
    const options = ['option1', 'option2', 'option3', 'option4']
      .map((k) => interaction.options.getString(k))
      .filter(Boolean) as string[];

    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
    const desc = options.map((opt, i) => `${emojis[i]} ${opt}`).join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`📊 ${question}`)
      .setDescription(desc)
      .setFooter({ text: `Poll by ${interaction.user.tag}` })
      .setTimestamp();

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    for (let i = 0; i < options.length; i++) {
      await msg.react(emojis[i]);
    }
  }
}
