import { REST, Routes } from 'discord.js';
import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';
import { logger } from './utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Register slash commands with Discord
 */
async function registerCommands() {
  logger.info('Starting command registration...');
  logger.divider();

  const commands: any[] = [];
  const commandsPath = join(__dirname, 'commands');

  // Recursively get all command files
  const commandFiles = getAllCommandFiles(commandsPath);

  logger.info(`Found ${commandFiles.length} command file(s)`);

  // Load command data
  for (const file of commandFiles) {
    try {
      const command = await import(file);
      if ('data' in command.default) {
        commands.push(command.default.data.toJSON());
        logger.success(`Loaded: ${command.default.data.name}`);
      }
    } catch (error) {
      logger.error(`Failed to load ${file}:`, error as Error);
    }
  }

  logger.newLine();
  logger.info(`Registering ${commands.length} command(s)...`);

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(config.token);

  try {
    // Register commands
    if (config.guildId) {
      // Register to a specific guild (faster, good for development)
      logger.info(`Registering to guild: ${config.guildId}`);
      
      const data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands }
      ) as any[];

      logger.success(`Successfully registered ${data.length} guild command(s)!`);
    } else {
      // Register globally (takes up to 1 hour to propagate)
      logger.info('Registering globally (this may take up to an hour)...');
      
      const data = await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands }
      ) as any[];

      logger.success(`Successfully registered ${data.length} global command(s)!`);
    }

    logger.divider();
    logger.success('Command registration complete!');

    // List registered commands
    logger.newLine();
    logger.info('Registered commands:');
    commands.forEach(cmd => {
      logger.info(`  /${cmd.name} - ${cmd.description}`);
    });

  } catch (error) {
    logger.error('Failed to register commands:', error as Error);
    process.exit(1);
  }
}

/**
 * Recursively get all command files
 */
function getAllCommandFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...getAllCommandFiles(fullPath));
      } else if (entry.endsWith('.ts') || entry.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    logger.error(`Failed to read directory ${dir}:`, error as Error);
  }

  return files;
}

// Add newLine helper
(logger as any).newLine = () => console.log();

// Run the registration
registerCommands();

