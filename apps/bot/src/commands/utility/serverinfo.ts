import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class ServerInfoCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('View server information');

  public category = 'utility';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guild = interaction.guild!;
    await guild.members.fetch().catch(() => null);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: `${guild.members.cache.filter((m) => !m.user.bot).size} humans, ${guild.members.cache.filter((m) => m.user.bot).size} bots`, inline: true },
        { name: 'Channels', value: `${guild.channels.cache.size} total`, inline: true },
        { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Boosts', value: `${guild.premiumSubscriptionCount ?? 0} (Level ${guild.premiumTier})`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
      )
      .setFooter({ text: `ID: ${guild.id}` });

    await interaction.reply({ embeds: [embed] });
  }
}
