import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class UserInfoCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('View user information')
    .addUserOption((opt) => opt.setName('user').setDescription('Target user'));

  public category = 'utility';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const target = interaction.options.getUser('user') ?? interaction.user;
    const member = await interaction.guild?.members.fetch(target.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(target.tag)
      .setThumbnail(target.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'ID', value: target.id, inline: true },
        { name: 'Created', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Bot', value: target.bot ? 'Yes' : 'No', inline: true },
      );

    if (member) {
      embed.addFields(
        { name: 'Joined', value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`, inline: true },
        { name: 'Roles', value: member.roles.cache.size > 1 ? member.roles.cache.filter((r) => r.id !== interaction.guildId).map((r) => r.name).slice(0, 5).join(', ') : 'None', inline: false },
        { name: 'Boosting', value: member.premiumSince ? 'Yes' : 'No', inline: true },
      );
    }

    await interaction.reply({ embeds: [embed] });
  }
}
