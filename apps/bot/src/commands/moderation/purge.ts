import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
  type TextChannel,
  type NewsChannel,
  type ThreadChannel,
} from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

type BulkDeletableChannel = TextChannel | NewsChannel | ThreadChannel;

export default class PurgeCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete multiple messages at once')
    .addIntegerOption((opt) =>
      opt.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true).setMinValue(1).setMaxValue(100),
    )
    .addUserOption((opt) =>
      opt.setName('user').setDescription('Only delete messages from this user').setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

  public category = 'moderation';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    const amount = interaction.options.getInteger('amount', true);
    const targetUser = interaction.options.getUser('user');

    const channel = interaction.channel;
    if (!channel || !('bulkDelete' in channel)) {
      await interaction.editReply('This command can only be used in text channels.');
      return;
    }

    try {
      const messages = await channel.messages.fetch({ limit: amount });
      const toDelete = targetUser
        ? messages.filter((m) => m.author.id === targetUser.id)
        : messages;

      const deleted = await (channel as BulkDeletableChannel).bulkDelete(toDelete, true);
      await interaction.editReply(`Deleted ${deleted.size} messages.`);
      setTimeout(() => interaction.deleteReply().catch(() => null), 3000);
    } catch (error) {
      this.client.logger.error({ error }, 'Purge command failed');
      await interaction.editReply('Failed to delete messages. Messages older than 14 days cannot be bulk deleted.');
    }
  }
}
