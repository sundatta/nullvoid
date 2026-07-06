import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

export default class PingCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot response time');

  public category = 'utility';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sent = await interaction.reply({
      content: 'Pinging...',
      fetchReply: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const wsPing = this.client.ws.ping;

    await interaction.editReply({
      embeds: [{
        color: 0x5865F2,
        title: 'Pong!',
        fields: [
          { name: 'Latency', value: `${latency}ms`, inline: true },
          { name: 'WebSocket', value: `${wsPing}ms`, inline: true },
        ],
      }],
    });
  }
}
