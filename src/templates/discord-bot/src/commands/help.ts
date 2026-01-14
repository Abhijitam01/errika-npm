import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../types';
import { createEmbed, Colors } from '../utils/embedBuilder';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display all available commands')
    .addStringOption(option =>
      option
        .setName('command')
        .setDescription('Get detailed help for a specific command')
        .setRequired(false)
    ),

  async execute(client, interaction) {
    const commandName = interaction.options.getString('command');

    // Show specific command help
    if (commandName) {
      const command = client.commands.get(commandName);

      if (!command) {
        await interaction.reply({
          content: `❌ No command found with name: \`${commandName}\``,
          ephemeral: true,
        });
        return;
      }

      const embed = createEmbed({
        title: `Command: /${command.data.name}`,
        description: command.data.description,
        color: Colors.Info,
      });

      if (command.cooldown) {
        embed.addFields({
          name: 'Cooldown',
          value: `${command.cooldown} second(s)`,
          inline: true,
        });
      }

      if (command.permissions && command.permissions.length > 0) {
        embed.addFields({
          name: 'Required Permissions',
          value: command.permissions.join(', '),
          inline: true,
        });
      }

      if (command.guildOnly) {
        embed.addFields({
          name: 'Server Only',
          value: 'This command can only be used in servers',
          inline: true,
        });
      }

      if (command.ownerOnly) {
        embed.addFields({
          name: 'Owner Only',
          value: 'This command can only be used by the bot owner',
          inline: true,
        });
      }

      await interaction.reply({ embeds: [embed] });
      return;
    }

    // Show all commands grouped by category
    const categories = new Map<string, Command[]>();

    client.commands.forEach(command => {
      const category = command.category || 'General';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(command);
    });

    const embed = createEmbed({
      title: '📚 Command List',
      description: `Use \`/help <command>\` for detailed information about a command.\n\n**Total Commands:** ${client.commands.size}`,
      color: Colors.Primary,
    });

    // Add fields for each category
    categories.forEach((commands, category) => {
      const commandList = commands
        .map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`)
        .join('\n');

      embed.addFields({
        name: `${category} (${commands.length})`,
        value: commandList,
        inline: false,
      });
    });

    embed.setFooter({
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

    await interaction.reply({ embeds: [embed] });
  },

  category: 'General',
  cooldown: 5,
} as Command;

