import { createLogger, type Logger } from '@nullvoid/logger';
import type { NullVoidClient } from './NullVoidClient.js';

export abstract class BaseService {
  protected readonly logger: Logger;

  constructor(
    protected readonly client: NullVoidClient,
    serviceName: string,
  ) {
    this.logger = createLogger(serviceName);
  }
}
