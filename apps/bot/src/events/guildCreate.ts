import { Events, type Guild } from 'discord.js';
import { BaseEvent } from '../structures/BaseEvent.js';
import { GuildRepository } from '@nullvoid/database';

export default class GuildCreateEvent extends BaseEvent<typeof Events.GuildCreate> {
  public name = Events.GuildCreate as typeof Events.GuildCreate;

  async execute(guild: Guild): Promise<void> {
    if (!guild.available) return;

    try {
      const repo = new GuildRepository();
      await repo.upsert(guild.id, guild.name, guild.ownerId, guild.iconURL());
      this.client.logger.info({ guild: guild.id, name: guild.name }, 'Joined guild');
    } catch (error) {
      this.client.logger.error({ error, guild: guild.id }, 'Failed to save guild on join');
    }
  }
}
