import {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  type ClientOptions,
} from 'discord.js';
import { createLogger, type Logger } from '@nullvoid/logger';
import { config } from '@nullvoid/config';
import { getPrisma, disconnectPrisma } from '@nullvoid/database';
import { CommandManager } from './CommandManager.js';
import { EventManager } from './EventManager.js';
import { ModuleManager } from './ModuleManager.js';
import { type BotOptions } from '@nullvoid/types';

export class NullVoidClient extends Client {
  public readonly logger: Logger;
  public readonly commandManager: CommandManager;
  public readonly eventManager: EventManager;
  public readonly moduleManager: ModuleManager;
  public readonly startTime: Date = new Date();
  public readonly rest: REST;

  constructor(options: BotOptions) {
    const clientOptions: ClientOptions = {
      intents: options.intents as GatewayIntentBits[],
      partials: options.partials as Partials[],
      shards: options.shardCount ?? 'auto',
      presence: {
        activities: [{ name: 'NullVoid v1.0.0', type: 3 }],
        status: 'online',
      },
    };

    super(clientOptions);

    this.logger = createLogger('client');
    this.rest = new REST({ version: '10' }).setToken(options.token);
    this.commandManager = new CommandManager(this);
    this.eventManager = new EventManager(this);
    this.moduleManager = new ModuleManager(this);
  }

  async start(): Promise<void> {
    this.logger.info('Initializing bot...');

    getPrisma();
    this.logger.info('Database connected');

    await this.eventManager.loadEvents();
    this.eventManager.registerAll();

    await this.moduleManager.loadModules();

    this.once('ready', async () => {
      this.logger.info({ guilds: this.guilds.cache.size }, 'Bot is ready');

      await this.commandManager.loadCommands();
      await this.commandManager.registerCommands();
      this.logger.info('Commands registered');

      this.logger.info({
        uptime: Math.floor((Date.now() - this.startTime.getTime()) / 1000),
        guilds: this.guilds.cache.size,
        users: this.users.cache.size,
      }, 'Bot startup complete');
    });

    await this.login(config.DISCORD_TOKEN);
  }

  async shutdown(): Promise<void> {
    this.logger.info('Shutting down...');

    this.destroy();
    await disconnectPrisma();

    this.logger.info('Shutdown complete');
    process.exit(0);
  }

  get stats() {
    return {
      guilds: this.guilds.cache.size,
      users: this.users.cache.size,
      shards: this.ws.shards.size,
      commands: this.commandManager.commands.size,
      uptime: Math.floor((Date.now() - this.startTime.getTime()) / 1000),
      ping: this.ws.ping,
      readyAt: this.readyAt,
    };
  }
}
