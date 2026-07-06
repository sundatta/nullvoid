import { Events, type Interaction } from 'discord.js';
import { BaseEvent } from '../structures/BaseEvent.js';

export default class InteractionCreateEvent extends BaseEvent<typeof Events.InteractionCreate> {
  public name = Events.InteractionCreate as typeof Events.InteractionCreate;

  async execute(interaction: Interaction): Promise<void> {
    if (interaction.isChatInputCommand()) {
      await this.client.commandManager.handleInteraction(interaction);
    } else if (interaction.isModalSubmit()) {
      await this.client.commandManager.handleModal(interaction);
    }
  }
}
