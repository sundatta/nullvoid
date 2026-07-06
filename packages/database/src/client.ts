import { PrismaClient } from '@prisma/client';
import { createLogger } from '@nullvoid/logger';

const logger = createLogger('database');

let prisma: PrismaClient;

export function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ['warn', 'error'],
    });
  }
  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Disconnected from database');
  }
}

export { prisma };
