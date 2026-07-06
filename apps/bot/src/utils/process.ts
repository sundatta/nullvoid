import type { NullVoidClient } from '../structures/NullVoidClient.js';

export function registerProcessHandlers(client: NullVoidClient): void {
  process.on('unhandledRejection', (reason) => {
    client.logger.error({ error: reason }, 'Unhandled promise rejection');
  });

  process.on('uncaughtException', (error) => {
    client.logger.fatal({ error }, 'Uncaught exception');
    client.shutdown().catch(() => process.exit(1));
  });

  process.on('SIGINT', async () => {
    client.logger.info('Received SIGINT');
    await client.shutdown();
  });

  process.on('SIGTERM', async () => {
    client.logger.info('Received SIGTERM');
    await client.shutdown();
  });
}
