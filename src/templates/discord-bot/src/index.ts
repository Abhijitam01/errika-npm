import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ExtendedClient } from './client';
import { config } from './config';
import { logger } from './utils/logger';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Main bot initialization
 */
async function main() {
  logger.info('Starting Discord bot...');
  logger.divider();

  // Create client instance
  const client = new ExtendedClient();

  // Define paths
  const commandsPath = join(__dirname, 'commands');
  const eventsPath = join(__dirname, 'events');

  try {
    // Load commands
    await loadCommands(client, commandsPath);
    logger.newLine();

    // Load events
    await loadEvents(client, eventsPath);
    logger.newLine();

    // Login to Discord
    logger.info('Logging in to Discord...');
    await client.login(config.token);
  } catch (error) {
    logger.error('Failed to start bot:', error as Error);
    process.exit(1);
  }

  // Handle graceful shutdown
  setupGracefulShutdown(client);
}

/**
 * Setup graceful shutdown handlers
 */
function setupGracefulShutdown(client: ExtendedClient) {
  const shutdown = async (signal: string) => {
    logger.warn(`\n${signal} received. Shutting down gracefully...`);

    try {
      // Destroy the client connection
      client.destroy();
      logger.success('Bot disconnected successfully');

      // Perform any cleanup here (e.g., database connections)
      // await prisma.$disconnect();

      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error as Error);
      process.exit(1);
    }
  };

  // Listen for termination signals
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Handle uncaught errors
  process.on('unhandledRejection', (error: Error) => {
    logger.error('Unhandled promise rejection:', error);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught exception:', error);
    shutdown('UNCAUGHT_EXCEPTION');
  });
}

// Add helper to logger for newlines
declare module './utils/logger' {
  interface Logger {
    newLine: () => void;
  }
}

(logger as any).newLine = () => console.log();

// Start the bot
main();
