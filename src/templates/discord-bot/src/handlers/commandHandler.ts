import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import type { ExtendedClient } from '../client';
import { logger } from '../utils/logger';

/**
 * Load all commands from the commands directory
 */
export async function loadCommands(client: ExtendedClient, commandsPath: string): Promise<void> {
  const commandFiles = getAllCommandFiles(commandsPath);

  logger.info(`Loading ${commandFiles.length} command(s)...`);

  for (const filePath of commandFiles) {
    try {
      const command = await import(filePath);
      const commandData = command.default;

      if ('data' in commandData && 'execute' in commandData) {
        client.setCommand(commandData.data.name, commandData);
        logger.success(`Loaded command: ${commandData.data.name}`);
      } else {
        logger.warn(`Command at ${filePath} is missing required "data" or "execute" property.`);
      }
    } catch (error) {
      logger.error(`Failed to load command at ${filePath}:`, error as Error);
    }
  }

  logger.success(`Successfully loaded ${client.commands.size} command(s)`);
}

/**
 * Recursively get all command files from a directory
 */
function getAllCommandFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively get files from subdirectories
        files.push(...getAllCommandFiles(fullPath));
      } else if (entry.endsWith('.ts') || entry.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    logger.error(`Failed to read command directory ${dir}:`, error as Error);
  }

  return files;
}

/**
 * Reload a specific command (useful for development)
 */
export async function reloadCommand(client: ExtendedClient, commandName: string, commandsPath: string): Promise<boolean> {
  try {
    // Find the command file
    const commandFiles = getAllCommandFiles(commandsPath);
    const commandFile = commandFiles.find(file => {
      const fileName = file.split('/').pop()?.replace(/\.(ts|js)$/, '');
      return fileName === commandName;
    });

    if (!commandFile) {
      logger.error(`Command file not found: ${commandName}`);
      return false;
    }

    // Clear the require cache
    delete require.cache[require.resolve(commandFile)];

    // Reload the command
    const command = await import(commandFile);
    const commandData = command.default;

    if ('data' in commandData && 'execute' in commandData) {
      client.setCommand(commandData.data.name, commandData);
      logger.success(`Reloaded command: ${commandData.data.name}`);
      return true;
    } else {
      logger.error(`Command at ${commandFile} is missing required properties.`);
      return false;
    }
  } catch (error) {
    logger.error(`Failed to reload command ${commandName}:`, error as Error);
    return false;
  }
}

