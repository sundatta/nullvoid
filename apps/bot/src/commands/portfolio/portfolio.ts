import { SlashCommandBuilder, type ChatInputCommandInteraction, type ModalSubmitInteraction, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand.js';
import { PortfolioRepository, getPrisma } from '@nullvoid/database';
import { ensureUserAndGuild } from '../../utils/database.js';

const repo = new PortfolioRepository();

function portfolioUrl(id: string): string {
  const base = process.env.PUBLIC_URL || 'http://localhost:3001';
  return `${base}/portfolio/${id}`;
}

export default class PortfolioCommand extends BaseCommand {
  public data = new SlashCommandBuilder()
    .setName('portfolio')
    .setDescription('Manage your developer portfolio')
    .addSubcommand((sub) => sub.setName('create').setDescription('Create a new portfolio'))
    .addSubcommand((sub) => sub.setName('edit').setDescription('Edit your portfolio'))
    .addSubcommand((sub) => sub.setName('delete').setDescription('Delete your portfolio'))
    .addSubcommand((sub) => sub.setName('preview').setDescription('Preview your portfolio'))
    .addSubcommand((sub) => sub.setName('publish').setDescription('Publish your portfolio to the web'))
    .addSubcommand((sub) => sub.setName('view').setDescription('View a user\'s portfolio').addUserOption((opt) => opt.setName('user').setDescription('User to view')));

  public category = 'portfolio';

  constructor(client: any) {
    super(client);
    this.client.commandManager.modalHandlers.set('portfolio_create', this.handleCreateModal.bind(this));
    this.client.commandManager.modalHandlers.set('portfolio_edit', this.handleEditModal.bind(this));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sub = interaction.options.getSubcommand();
    if (sub === 'create') await this.showCreateModal(interaction);
    else if (sub === 'edit') await this.showEditModal(interaction);
    else if (sub === 'delete') await this.deletePortfolio(interaction);
    else if (sub === 'preview') await this.preview(interaction);
    else if (sub === 'publish') await this.publish(interaction);
    else if (sub === 'view') await this.view(interaction);
  }

  private async showCreateModal(interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder().setCustomId('portfolio_create').setTitle('Create Portfolio');

    const nameInput = new TextInputBuilder().setCustomId('name').setLabel('Your Name').setStyle(TextInputStyle.Short).setRequired(true);
    const bioInput = new TextInputBuilder().setCustomId('bio').setLabel('Bio / About').setStyle(TextInputStyle.Paragraph).setRequired(true);
    const githubInput = new TextInputBuilder().setCustomId('github').setLabel('GitHub Username (optional)').setStyle(TextInputStyle.Short).setRequired(false);
    const skillsInput = new TextInputBuilder().setCustomId('skills').setLabel('Skills (comma-separated)').setStyle(TextInputStyle.Short);
    const socialInput = new TextInputBuilder().setCustomId('social').setLabel('Socials (twitter, linkedin, website)').setStyle(TextInputStyle.Short).setRequired(false);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(bioInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(githubInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(skillsInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(socialInput),
    );

    await interaction.showModal(modal);
  }

  private async handleCreateModal(interaction: ModalSubmitInteraction) {
    const name = interaction.fields.getTextInputValue('name');
    const bio = interaction.fields.getTextInputValue('bio');
    const github = interaction.fields.getTextInputValue('github');
    const skills = interaction.fields.getTextInputValue('skills');
    const socialRaw = interaction.fields.getTextInputValue('social');

    await interaction.deferReply({ ephemeral: true });
    await ensureUserAndGuild(interaction.user.id, interaction.guildId!, interaction.user.username);

    const avatar = interaction.user.displayAvatarURL({ size: 256 });
    await getPrisma().user.update({ where: { id: interaction.user.id }, data: { avatar } }).catch(() => null);

    const socialLinks: Record<string, string> = {};
    if (github) socialLinks.github = `https://github.com/${github}`;
    if (socialRaw) {
      for (const part of socialRaw.split(',')) {
        const [key, ...val] = part.trim().split(':');
        const value = val.join(':').trim();
        if (key && value) {
          const k = key.trim().toLowerCase();
          if (k === 'twitter') socialLinks.twitter = `https://twitter.com/${value}`;
          else if (k === 'linkedin') socialLinks.linkedin = `https://linkedin.com/in/${value}`;
          else if (k === 'website') socialLinks.website = value.startsWith('http') ? value : `https://${value}`;
          else socialLinks[k] = value;
        }
      }
    }

    const sections: any[] = [];
    if (skills) sections.push({ type: 'skills', title: 'Skills', items: skills.split(',').map((s) => s.trim()) });

    await repo.upsert(interaction.user.id, interaction.guildId!, {
      title: `${name}'s Portfolio`,
      subtitle: name,
      about: bio,
      socialLinks: Object.keys(socialLinks).length ? socialLinks : undefined,
      sections,
    });

    const id = (await repo.findByUser(interaction.user.id, interaction.guildId!))!.id;
    await interaction.editReply({ content: `Portfolio created! Preview: ${portfolioUrl(id)}` });
  }

  private async showEditModal(interaction: ChatInputCommandInteraction) {
    const existing = await repo.findByUser(interaction.user.id, interaction.guildId!);
    const links = existing?.socialLinks ? JSON.parse(existing.socialLinks) : {};
    const githubVal = links.github ? links.github.replace('https://github.com/', '') : '';

    const modal = new ModalBuilder().setCustomId('portfolio_edit').setTitle('Edit Portfolio');

    const bioInput = new TextInputBuilder().setCustomId('bio').setLabel('Bio / About').setStyle(TextInputStyle.Paragraph).setRequired(true).setValue(existing?.about ?? '');
    const githubInput = new TextInputBuilder().setCustomId('github').setLabel('GitHub Username').setStyle(TextInputStyle.Short).setRequired(false).setValue(githubVal);
    const skillsInput = new TextInputBuilder().setCustomId('skills').setLabel('Skills (comma-separated)').setStyle(TextInputStyle.Short);
    const socialInput = new TextInputBuilder().setCustomId('social').setLabel('Socials (twitter, linkedin, website)').setStyle(TextInputStyle.Short).setRequired(false);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(bioInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(githubInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(skillsInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(socialInput),
    );
    await interaction.showModal(modal);
  }

  private async handleEditModal(interaction: ModalSubmitInteraction) {
    const bio = interaction.fields.getTextInputValue('bio');
    const github = interaction.fields.getTextInputValue('github');
    const skills = interaction.fields.getTextInputValue('skills');
    const socialRaw = interaction.fields.getTextInputValue('social');

    await interaction.deferReply({ ephemeral: true });

    const socialLinks: Record<string, string> = {};
    if (github) socialLinks.github = `https://github.com/${github}`;
    if (socialRaw) {
      for (const part of socialRaw.split(',')) {
        const [key, ...val] = part.trim().split(':');
        const value = val.join(':').trim();
        if (key && value) {
          const k = key.trim().toLowerCase();
          if (k === 'twitter') socialLinks.twitter = `https://twitter.com/${value}`;
          else if (k === 'linkedin') socialLinks.linkedin = `https://linkedin.com/in/${value}`;
          else if (k === 'website') socialLinks.website = value.startsWith('http') ? value : `https://${value}`;
          else socialLinks[k] = value;
        }
      }
    }

    const sections: any[] = [];
    if (skills) sections.push({ type: 'skills', title: 'Skills', items: skills.split(',').map((s) => s.trim()) });

    await repo.upsert(interaction.user.id, interaction.guildId!, {
      about: bio,
      socialLinks: Object.keys(socialLinks).length ? socialLinks : undefined,
      sections: sections.length ? sections : undefined,
    });

    await interaction.editReply({ content: 'Portfolio updated successfully!' });
  }

  private async deletePortfolio(interaction: ChatInputCommandInteraction) {
    const existing = await repo.findByUser(interaction.user.id, interaction.guildId!);
    if (existing) {
      await repo.delete(existing.id);
      await interaction.reply({ content: 'Portfolio deleted.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'You don\'t have a portfolio yet.', ephemeral: true });
    }
  }

  private async preview(interaction: ChatInputCommandInteraction) {
    const existing = await repo.findByUser(interaction.user.id, interaction.guildId!);
    if (!existing) {
      await interaction.reply({ content: 'You haven\'t created a portfolio yet. Use `/portfolio create`.', ephemeral: true });
      return;
    }
    const links = existing.socialLinks ? JSON.parse(existing.socialLinks) : {};
    const sections = existing.sections ? JSON.parse(existing.sections) : [];

    const embed = new EmbedBuilder()
      .setColor(0x5865F2).setTitle(existing.title)
      .setDescription(existing.about || 'No bio set')
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: 'GitHub', value: links.github ? `[${links.github}](${links.github})` : 'Not set', inline: true },
        { name: 'Skills', value: sections.length ? sections[0].items?.join(', ') || 'Not set' : 'Not set', inline: true },
        { name: 'Published', value: existing.published ? 'Yes' : 'No', inline: true },
      );
    if (links.twitter) embed.addFields({ name: 'Twitter', value: `[${links.twitter}](${links.twitter})`, inline: true });
    if (links.linkedin) embed.addFields({ name: 'LinkedIn', value: `[${links.linkedin}](${links.linkedin})`, inline: true });
    if (links.website) embed.addFields({ name: 'Website', value: `[${links.website}](${links.website})`, inline: true });
    await interaction.reply({ embeds: [embed] });
  }

  private async publish(interaction: ChatInputCommandInteraction) {
    const existing = await repo.findByUser(interaction.user.id, interaction.guildId!);
    if (!existing) {
      await interaction.reply({ content: 'Create a portfolio first with `/portfolio create`.', ephemeral: true });
      return;
    }
    const domain = `${interaction.user.id}.${process.env.PORTFOLIO_DOMAIN || 'localhost:3000'}`;
    await repo.publish(existing.id, domain);
    await interaction.reply({ content: `Portfolio published! View it at ${portfolioUrl(existing.id)}\nShare this link with anyone.`, ephemeral: true });
  }

  private async view(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const existing = await repo.findByUser(user.id, interaction.guildId!);
    if (!existing) {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2).setTitle(`${user.username}'s Portfolio`)
        .setDescription('This user hasn\'t set up their portfolio yet.');
      await interaction.reply({ embeds: [embed] });
      return;
    }
    const links = existing.socialLinks ? JSON.parse(existing.socialLinks) : {};
    const embed = new EmbedBuilder()
      .setColor(0x5865F2).setTitle(existing.title)
      .setDescription(existing.about || 'No bio set')
      .setThumbnail(user.displayAvatarURL());
    if (links.github) embed.addFields({ name: 'GitHub', value: `[${links.github}](${links.github})`, inline: true });
    if (links.twitter) embed.addFields({ name: 'Twitter', value: `[${links.twitter}](${links.twitter})`, inline: true });
    if (links.linkedin) embed.addFields({ name: 'LinkedIn', value: `[${links.linkedin}](${links.linkedin})`, inline: true });
    await interaction.reply({ embeds: [embed] });
  }
}