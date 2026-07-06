import { Collection, Routes, type ChatInputCommandInteraction, type ModalSubmitInteraction, type RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { NullVoidClient } from './NullVoidClient.js';
import type { BaseCommand } from './BaseCommand.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class CommandManager {
  public commands = new Collection<string, BaseCommand>();
  public cooldowns = new Collection<string, Collection<string, number>>();
  public modalHandlers = new Collection<string, (interaction: ModalSubmitInteraction) => Promise<void>>();

  constructor(private readonly client: NullVoidClient) {}

  async loadCommands(): Promise<void> {
    this.commands.clear();
    const commandsPath = join(__dirname, '..', 'commands');
    const categories = readdirSync(commandsPath, { withFileTypes: true });

    for (const category of categories) {
      if (!category.isDirectory()) continue;
      const categoryPath = join(commandsPath, category.name);
      const commandFiles = readdirSync(categoryPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = join(categoryPath, file);
        try {
          const { default: Command } = await import(pathToFileURL(filePath).href);
          const command = new Command(this.client);
          if (command.data) {
            this.commands.set(command.data.name, command);
            this.client.logger.debug({ command: command.data.name, category: category.name }, 'Loaded command');
          }
        } catch (error) {
          this.client.logger.error({ error, file: filePath }, 'Failed to load command');
        }
      }
    }

    this.client.logger.info({ count: this.commands.size }, 'Commands loaded');
  }

  async registerCommands(): Promise<void> {
    const commandData: RESTPostAPIApplicationCommandsJSONBody[] = [];
    for (const command of this.commands.values()) {
      if (command.data) {
        commandData.push(command.data.toJSON());
      }
    }

    try {
      await this.client.rest.put(
        Routes.applicationCommands(this.client.user!.id),
        { body: commandData },
      );
      this.client.logger.info({ count: commandData.length }, 'Global commands registered');
    } catch (error) {
      this.client.logger.error({ error }, 'Failed to register commands');
    }
  }

  async handleInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = this.commands.get(interaction.commandName);
    if (!command) return;

    if (this.isOnCooldown(interaction.user.id, interaction.commandName)) {
      const cooldown = this.getCooldownTime(interaction.user.id, interaction.commandName);
      await interaction.reply({
        content: `Please wait ${cooldown} seconds before using this command again.`,
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
      this.setCooldown(interaction.user.id, interaction.commandName, command.cooldown ?? 3);
    } catch (error) {
      this.client.logger.error({ error, command: interaction.commandName }, 'Command execution error');
      const content = 'An error occurred while executing this command.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content, ephemeral: true });
      } else {
        await interaction.reply({ content, ephemeral: true });
      }
    }
  }

  private isOnCooldown(userId: string, commandName: string): boolean {
    const userCooldowns = this.cooldowns.get(commandName);
    if (!userCooldowns) return false;
    const cooldownEnd = userCooldowns.get(userId);
    if (!cooldownEnd) return false;
    return Date.now() < cooldownEnd;
  }

  private getCooldownTime(userId: string, commandName: string): number {
    const userCooldowns = this.cooldowns.get(commandName);
    if (!userCooldowns) return 0;
    const cooldownEnd = userCooldowns.get(userId);
    if (!cooldownEnd) return 0;
    return Math.ceil((cooldownEnd - Date.now()) / 1000);
  }

  async handleModal(interaction: ModalSubmitInteraction): Promise<void> {
    const handler = this.modalHandlers.get(interaction.customId);
    if (!handler) {
      this.client.logger.warn({ customId: interaction.customId }, 'No modal handler registered');
      await interaction.reply({ content: 'Unknown modal submission.', ephemeral: true });
      return;
    }
    try {
      await handler(interaction);
    } catch (error) {
      this.client.logger.error({ error, customId: interaction.customId }, 'Modal handler error');
      const content = 'An error occurred while processing your submission.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content, ephemeral: true });
      } else {
        await interaction.reply({ content, ephemeral: true });
      }
    }
  }

  private setCooldown(userId: string, commandName: string, seconds: number): void {
    if (!this.cooldowns.has(commandName)) {
      this.cooldowns.set(commandName, new Collection());
    }
    const userCooldowns = this.cooldowns.get(commandName)!;
    userCooldowns.set(userId, Date.now() + seconds * 1000);
    setTimeout(() => userCooldowns.delete(userId), seconds * 1000);
  }
}
