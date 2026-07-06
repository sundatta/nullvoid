import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Collection } from 'discord.js';
import type { NullVoidClient } from './NullVoidClient.js';
import type { BaseModule } from './BaseModule.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class ModuleManager {
  public modules = new Collection<string, BaseModule>();
  private _initialized = false;

  constructor(private readonly client: NullVoidClient) {}

  async loadModules(): Promise<void> {
    const modulesPath = join(__dirname, '..', 'modules');
    if (!readdirSync(modulesPath, { withFileTypes: true }).length) {
      this.client.logger.info('No modules directory found');
      return;
    }
    const moduleDirs = readdirSync(modulesPath, { withFileTypes: true });

    for (const dir of moduleDirs) {
      if (!dir.isDirectory()) continue;
      const modulePath = join(modulesPath, dir.name);
      const indexFile = readdirSync(modulePath).find(
        (f) => f === 'index.ts' || f === 'index.js' || f === `${dir.name}.ts` || f === `${dir.name}.js`,
      );
      if (!indexFile) continue;

      try {
        const { default: Module } = await import(pathToFileURL(join(modulePath, indexFile)).href);
        const module = new Module(this.client);
        this.modules.set(module.name, module);
        this.client.logger.debug({ module: module.name }, 'Loaded module');
      } catch (error) {
        this.client.logger.error({ error, module: dir.name }, 'Failed to load module');
      }
    }

    this.client.logger.info({ count: this.modules.size }, 'Modules loaded');
  }

  getModule(name: string): BaseModule | undefined {
    return this.modules.get(name);
  }

  isModuleEnabled(name: string): boolean {
    return this.modules.has(name) && this.modules.get(name)!.enabled;
  }

  async enableModule(name: string): Promise<void> {
    const module = this.modules.get(name);
    if (!module) throw new Error(`Module ${name} not found`);
    module.enabled = true;
    if (!this._initialized) return;
    await module.onEnable();
    this.client.logger.info({ module: name }, 'Module enabled');
  }

  async disableModule(name: string): Promise<void> {
    const module = this.modules.get(name);
    if (!module) throw new Error(`Module ${name} not found`);
    module.enabled = false;
    await module.onDisable();
    this.client.logger.info({ module: name }, 'Module disabled');
  }

  async initializeModules(): Promise<void> {
    for (const module of this.modules.values()) {
      if (module.enabled) {
        await module.onEnable();
      }
    }
    this._initialized = true;
    this.client.logger.info('All modules initialized');
  }
}
