import { sleep } from './helpers.js';
import { createLogger } from '@nullvoid/logger';

const logger = createLogger('retry');

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 1000,
    maxDelayMs = 30_000,
    backoffFactor = 2,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === maxAttempts) break;

      const delay = Math.min(baseDelayMs * Math.pow(backoffFactor, attempt - 1), maxDelayMs);
      logger.warn({ attempt, maxAttempts, delayMs: delay }, `Retry attempt ${attempt} failed, retrying in ${delay}ms`);
      await sleep(delay);
    }
  }

  throw lastError!;
}
