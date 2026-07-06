import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';

const categories: Record<string, { emoji: string; desc: string }> = {
  utility: { emoji: '🔧', desc: 'General bot commands' },
  moderation: { emoji: '🛡️', desc: 'Server moderation tools' },
  economy: { emoji: '💰', desc: 'Virtual economy system' },
  leveling: { emoji: '⭐', desc: 'Leveling & XP system' },
  tickets: { emoji: '🎫', desc: 'Ticket support system' },
  music: { emoji: '🎵', desc: 'Music playback' },
  ai: { emoji: '🤖', desc: 'AI-powered features' },
  giveaway: { emoji: '🎉', desc: 'Giveaway management' },
  portfolio: { emoji: '📁', desc: 'Portfolio generator' },
};

export default class HelpCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands')
    .addStringOption((opt) =>
      opt.setName('category').setDescription('Filter by category')
        .addChoices(
          ...Object.entries(categories).map(([k, v]) => ({ name: `${v.emoji} ${k}`, value: k })),
        ),
    );

  public category = 'utility';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const filter = interaction.options.getString('category');
    const commands = this.client.commandManager.commands;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('NullVoid Commands')
      .setDescription(`Total commands: **${commands.size}**`)
      .setFooter({ text: 'NullVoid v1.0.0' })
      .setTimestamp();

    const cats = filter ? [filter] : Object.keys(categories);

    for (const cat of cats) {
      const catCommands = commands.filter((c) => c.category === cat);
      if (!catCommands.size) continue;
      const info = categories[cat] ?? { emoji: '📦', desc: cat };
      embed.addFields({
        name: `${info.emoji} ${cat} (${catCommands.size})`,
        value: catCommands.map((c) => `\`/${c.data.name}\` — ${c.data.description}`).join('\n') || 'No commands',
      });
    }

    await interaction.reply({ embeds: [embed] });
  }
}
