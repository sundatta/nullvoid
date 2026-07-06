import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { NullVoidClient } from './NullVoidClient.js';
import type { BaseEvent } from './BaseEvent.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class EventManager {
  private events: BaseEvent[] = [];

  constructor(private readonly client: NullVoidClient) {}

  async loadEvents(): Promise<void> {
    const eventsPath = join(__dirname, '..', 'events');
    const eventFiles = readdirSync(eventsPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      try {
        const { default: Event } = await import(pathToFileURL(filePath).href);
        const event = new Event(this.client);
        this.events.push(event);
        this.client.logger.debug({ event: String(event.name) }, 'Loaded event');
      } catch (error) {
        this.client.logger.error({ error, file: filePath }, 'Failed to load event');
      }
    }

    this.client.logger.info({ count: this.events.length }, 'Events loaded');
  }

  registerAll(): void {
    this.events.forEach((event) => {
      if (event.once) {
        this.client.once(event.name as string, (...args: unknown[]) => event.execute(...args as never));
      } else {
        this.client.on(event.name as string, (...args: unknown[]) => event.execute(...args as never));
      }
    });
  }
}
