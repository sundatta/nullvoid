import type { NullVoidClient } from './NullVoidClient.js';
import type { ModuleManifest } from '@nullvoid/types';

export abstract class BaseModule {
  public abstract name: string;
  public abstract description: string;
  public enabled = true;

  constructor(protected readonly client: NullVoidClient) {}

  abstract getManifest(): ModuleManifest;

  async onEnable(): Promise<void> {}
  async onDisable(): Promise<void> {}
}
