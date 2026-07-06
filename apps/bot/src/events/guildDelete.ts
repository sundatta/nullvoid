import { Events, type Guild } from 'discord.js';
import { BaseEvent } from '../structures/BaseEvent.js';
import { GuildRepository } from '@nullvoid/database';

export default class GuildDeleteEvent extends BaseEvent<typeof Events.GuildDelete> {
  public name = Events.GuildDelete as typeof Events.GuildDelete;

  async execute(guild: Guild): Promise<void> {
    try {
      const repo = new GuildRepository();
      await repo.delete(guild.id);
      this.client.logger.info({ guild: guild.id, name: guild.name }, 'Left guild');
    } catch (error) {
      this.client.logger.error({ error, guild: guild.id }, 'Failed to cleanup guild on leave');
    }
  }
}
