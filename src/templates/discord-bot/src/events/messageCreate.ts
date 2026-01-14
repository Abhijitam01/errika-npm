import { Events, Message } from 'discord.js';
import type { BotEvent } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Message event handler for prefix commands
 * This is only needed if you want to support prefix commands alongside slash commands
 */
export default {
  name: Events.MessageCreate,

  async execute(client, message: Message) {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Check if message starts with prefix
    if (!message.content.startsWith(config.commandPrefix)) return;

    // Parse command and arguments
    const args = message.content.slice(config.commandPrefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    // Note: This is a basic implementation
    // You would need to create a separate prefix command handler system
    // For now, this just logs the attempt
    logger.debug(`Prefix command attempted: ${config.commandPrefix}${commandName} by ${message.author.tag}`);

    // Suggest using slash commands
    if (commandName === 'help') {
      await message.reply({
        content: '👋 Hey! This bot primarily uses **slash commands**.\n' +
          'Type `/` to see all available commands, or use `/help` for more information!',
      });
    }

    // You can implement prefix command handling here if needed
    // Example structure:
    /*
    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    try {
      await command.execute(client, message, args);
    } catch (error) {
      logger.error(`Error executing prefix command ${commandName}:`, error as Error);
      await message.reply('There was an error executing that command!');
    }
    */
  },
} as BotEvent<Events.MessageCreate>;

