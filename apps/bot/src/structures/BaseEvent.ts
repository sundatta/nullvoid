import type { ClientEvents } from 'discord.js';
import type { NullVoidClient } from './NullVoidClient.js';

export abstract class BaseEvent<K extends keyof ClientEvents = keyof ClientEvents> {
  public abstract name: K;
  public once = false;

  constructor(protected readonly client: NullVoidClient) {}

  abstract execute(...args: ClientEvents[K]): Promise<void> | void;
}
