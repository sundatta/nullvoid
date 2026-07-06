import pino from 'pino';
import { config } from '@nullvoid/config';

const levels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

export function createLogger(name: string, options?: pino.LoggerOptions) {
  return pino({
    name,
    level: config.LOG_LEVEL,
    customLevels: levels,
    useOnlyCustomLevels: false,
    transport:
      config.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    ...options,
  });
}

export type Logger = pino.Logger;
