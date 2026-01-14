import { Events, InteractionType } from 'discord.js';
import type { BotEvent } from '../types';
import { logger } from '../utils/logger';
import { errorEmbed, cooldownEmbed, permissionErrorEmbed } from '../utils/embedBuilder';
import { config } from '../config';

export default {
  name: Events.InteractionCreate,

  async execute(client, interaction) {
    // Only handle command interactions
    if (interaction.type !== InteractionType.ApplicationCommand) return;
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      logger.warn(`No command matching ${interaction.commandName} was found.`);
      await interaction.reply({
        embeds: [errorEmbed('Error', 'This command no longer exists.')],
        ephemeral: true,
      });
      return;
    }

    // Check if command is guild-only
    if (command.guildOnly && !interaction.guild) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'This command can only be used in servers.')],
        ephemeral: true,
      });
      return;
    }

    // Check if command is owner-only
    if (command.ownerOnly && interaction.user.id !== config.ownerId) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'This command can only be used by the bot owner.')],
        ephemeral: true,
      });
      return;
    }

    // Check user permissions
    if (command.permissions && interaction.guild && interaction.member) {
      const memberPermissions = interaction.member.permissions;
      
      if (typeof memberPermissions !== 'string') {
        const missingPermissions = command.permissions.filter(
          permission => !memberPermissions.has(permission)
        );

        if (missingPermissions.length > 0) {
          const permissionNames = missingPermissions.map(p => p.toString()).join(', ');
          await interaction.reply({
            embeds: [permissionErrorEmbed(permissionNames)],
            ephemeral: true,
          });
          return;
        }
      }
    }

    // Check cooldowns
    if (command.cooldown) {
      if (client.isOnCooldown(interaction.user.id, command.data.name)) {
        const timeLeft = client.getCooldownTime(interaction.user.id, command.data.name);
        await interaction.reply({
          embeds: [cooldownEmbed(timeLeft)],
          ephemeral: true,
        });
        return;
      }

      // Set cooldown
      client.setCooldown(interaction.user.id, command.data.name, command.cooldown);
    }

    // Execute command
    try {
      logger.command(
        `${interaction.user.tag} (${interaction.user.id})`,
        `/${interaction.commandName}`
      );

      await command.execute(client, interaction);
    } catch (error) {
      logger.error(`Error executing command ${interaction.commandName}:`, error as Error);

      const errorMessage = {
        embeds: [
          errorEmbed(
            'Command Error',
            'There was an error executing this command. The developers have been notified.'
          ),
        ],
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  },
} as BotEvent<Events.InteractionCreate>;

