import { GatewayIntentBits, Partials } from 'discord.js';
import { config } from '@nullvoid/config';
import { createLogger } from '@nullvoid/logger';
import { NullVoidClient } from './structures/NullVoidClient.js';
import { registerProcessHandlers } from './utils/process.js';

const logger = createLogger('bot');

async function main() {
  logger.info('Starting NullVoid bot...');

  const client = new NullVoidClient({
    token: config.DISCORD_TOKEN,
    clientId: config.DISCORD_CLIENT_ID,
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
    ],
  });

  registerProcessHandlers(client);

  await client.start();
}

main().catch((error) => {
  logger.fatal(error, 'Failed to start bot');
  process.exit(1);
});
