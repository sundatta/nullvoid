import { Events } from 'discord.js';
import { BaseEvent } from '../structures/BaseEvent.js';

export default class ReadyEvent extends BaseEvent<typeof Events.ClientReady> {
  public name = Events.ClientReady as typeof Events.ClientReady;

  async execute(): Promise<void> {
    this.client.logger.info({
      user: this.client.user?.tag,
      id: this.client.user?.id,
    }, 'Bot is online');
  }
}
