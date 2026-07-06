import {
  type SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type PermissionResolvable,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import type { NullVoidClient } from './NullVoidClient.js';

export type CommandData =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder;

export abstract class BaseCommand {
  public abstract data: CommandData;
  public abstract category: string;
  public cooldown?: number;
  public permissions?: PermissionResolvable[];
  public premiumOnly?: boolean;

  constructor(protected readonly client: NullVoidClient) {}

  abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
