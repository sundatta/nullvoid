import { SlashCommandBuilder, type ChatInputCommandInteraction, version } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class InfoCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('View bot information');

  public category = 'utility';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const stats = this.client.stats;

    await interaction.reply({
      embeds: [{
        color: 0x5865F2,
        title: 'NullVoid',
        description: 'Enterprise-Grade Discord Bot',
        fields: [
          { name: 'Servers', value: `${stats.guilds}`, inline: true },
          { name: 'Users', value: `${stats.users}`, inline: true },
          { name: 'Commands', value: `${stats.commands}`, inline: true },
          { name: 'Shards', value: `${stats.shards}`, inline: true },
          { name: 'Ping', value: `${stats.ping}ms`, inline: true },
          { name: 'Uptime', value: `${Math.floor(stats.uptime / 3600)}h`, inline: true },
          { name: 'Library', value: `discord.js v${version}`, inline: true },
          { name: 'Node.js', value: process.version, inline: true },
        ],
        footer: { text: 'NullVoid v1.0.0' },
        timestamp: new Date().toISOString(),
      }],
    });
  }
}
