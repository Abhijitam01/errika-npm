import dotenv from 'dotenv';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

/**
 * Bot configuration interface
 */
export interface Config {
  token: string;
  clientId: string;
  guildId?: string;
  commandPrefix: string;
  ownerId?: string;
  environment: 'development' | 'production';
  databaseUrl?: string;
}

/**
 * Validate required environment variables
 */
function validateEnvironment(): void {
  const required = ['DISCORD_TOKEN', 'CLIENT_ID'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    logger.error('Missing required environment variables:');
    missing.forEach(key => logger.error(`  - ${key}`));
    logger.error('\nPlease create a .env file based on .env.example');
    process.exit(1);
  }

  // Validate token format
  if (process.env.DISCORD_TOKEN && !process.env.DISCORD_TOKEN.match(/^[\w-]+\.[\w-]+\.[\w-]+$/)) {
    logger.warn('DISCORD_TOKEN format appears invalid. Make sure you copied it correctly.');
  }

  // Validate client ID format
  if (process.env.CLIENT_ID && !process.env.CLIENT_ID.match(/^\d{17,19}$/)) {
    logger.warn('CLIENT_ID format appears invalid. It should be a 17-19 digit number.');
  }
}

/**
 * Load and validate configuration
 */
function loadConfig(): Config {
  validateEnvironment();

  const config: Config = {
    token: process.env.DISCORD_TOKEN!,
    clientId: process.env.CLIENT_ID!,
    guildId: process.env.GUILD_ID,
    commandPrefix: process.env.COMMAND_PREFIX || '!',
    ownerId: process.env.OWNER_ID,
    environment: (process.env.NODE_ENV as 'development' | 'production') || 'development',
    databaseUrl: process.env.DATABASE_URL,
  };

  // Log configuration (without sensitive data)
  logger.info('Configuration loaded:');
  logger.info(`  Environment: ${config.environment}`);
  logger.info(`  Command Prefix: ${config.commandPrefix}`);
  logger.info(`  Guild ID: ${config.guildId || 'Not set (global commands)'}`);
  logger.info(`  Database: ${config.databaseUrl ? 'Configured' : 'Not configured'}`);

  return config;
}

/**
 * Global configuration object
 */
export const config = loadConfig();

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return config.environment === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return config.environment === 'production';
}

/**
 * Check if database is configured
 */
export function hasDatabaseConfigured(): boolean {
  return !!config.databaseUrl;
}

