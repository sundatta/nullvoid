import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class AvatarCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('View a user\'s avatar')
    .addUserOption((opt) => opt.setName('user').setDescription('Target user'));

  public category = 'utility';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const target = interaction.options.getUser('user') ?? interaction.user;
    const avatar = target.displayAvatarURL({ size: 1024, extension: 'png' });

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`${target.tag}'s Avatar`)
      .setImage(avatar);

    await interaction.reply({ embeds: [embed] });
  }
}
