/**
 * Consent Management
 * Handles user consent for analytics tracking
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import prompts from 'prompts';
import chalk from 'chalk';
import { Logger } from '../utils/logger';
import { AnalyticsConfig } from './types';

const CONFIG_DIR = path.join(os.homedir(), '.errika');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Ask for consent every 90 days if not provided
const CONSENT_REMINDER_DAYS = 90;

/**
 * Generate a random anonymous user ID
 */
function generateUserId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Load analytics configuration
 */
export async function loadConfig(): Promise<AnalyticsConfig> {
  try {
    await fs.ensureDir(CONFIG_DIR);
    
    if (await fs.pathExists(CONFIG_FILE)) {
      const config = await fs.readJson(CONFIG_FILE);
      return {
        enabled: config.enabled ?? false,
        userId: config.userId || generateUserId(),
        consentDate: config.consentDate,
        lastAsked: config.lastAsked,
      };
    }
  } catch (error) {
    // Fail silently - analytics should never break the user experience
  }

  // Default config
  return {
    enabled: false,
    userId: generateUserId(),
  };
}

/**
 * Save analytics configuration
 */
export async function saveConfig(config: AnalyticsConfig): Promise<void> {
  try {
    await fs.ensureDir(CONFIG_DIR);
    await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
  } catch (error) {
    // Fail silently
  }
}

/**
 * Check if we should ask for consent
 */
export function shouldAskForConsent(config: AnalyticsConfig): boolean {
  // Never ask if already consented
  if (config.consentDate) {
    return false;
  }

  // Ask if never asked before
  if (!config.lastAsked) {
    return true;
  }

  // Ask again after reminder period
  const lastAsked = new Date(config.lastAsked);
  const daysSinceAsked = (Date.now() - lastAsked.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysSinceAsked >= CONSENT_REMINDER_DAYS;
}

/**
 * Prompt user for analytics consent
 */
export async function promptForConsent(): Promise<boolean> {
  try {
    Logger.newLine();
    Logger.cyan('📊 ' + chalk.bold('Help improve Errika!'));
    Logger.gray('━'.repeat(50));
    Logger.gray('Errika collects anonymous usage data to help us understand');
    Logger.gray('which templates are most popular and improve the tool.');
    Logger.newLine();
    Logger.gray('What we collect:');
    Logger.gray('  • Template name');
    Logger.gray('  • Success/failure status');
    Logger.gray('  • Timestamp');
    Logger.gray('  • Node.js version');
    Logger.newLine();
    Logger.gray('What we DON\'T collect:');
    Logger.gray('  • Project names or paths');
    Logger.gray('  • Personal information');
    Logger.gray('  • Code or file contents');
    Logger.gray('  • Any sensitive data');
    Logger.newLine();
    Logger.gray(`Privacy Policy: ${chalk.cyan('https://github.com/yourusername/errika#privacy')}`);
    Logger.gray('━'.repeat(50));
    Logger.newLine();

    const response = await prompts(
      {
        type: 'confirm',
        name: 'consent',
        message: 'Allow anonymous usage analytics?',
        initial: false,
      },
      {
        onCancel: () => {
          // Treat cancel as "no"
          return false;
        },
      }
    );

    return response.consent ?? false;
  } catch (error) {
    // Fail silently - default to no consent
    return false;
  }
}

/**
 * Request analytics consent from user
 */
export async function requestConsent(): Promise<AnalyticsConfig> {
  const config = await loadConfig();

  if (shouldAskForConsent(config)) {
    const consent = await promptForConsent();
    
    config.enabled = consent;
    config.lastAsked = new Date().toISOString();
    
    if (consent) {
      config.consentDate = new Date().toISOString();
      Logger.success('✓ Analytics enabled. Thank you for helping improve Errika!');
      Logger.gray(`  You can disable this anytime by running: ${chalk.cyan('errika analytics disable')}\n`);
    } else {
      Logger.gray('✓ Analytics disabled. We respect your privacy!\n');
    }

    await saveConfig(config);
  }

  return config;
}

/**
 * Enable analytics
 */
export async function enableAnalytics(): Promise<void> {
  const config = await loadConfig();
  config.enabled = true;
  config.consentDate = new Date().toISOString();
  await saveConfig(config);
  Logger.success('✓ Analytics enabled');
}

/**
 * Disable analytics
 */
export async function disableAnalytics(): Promise<void> {
  const config = await loadConfig();
  config.enabled = false;
  config.consentDate = undefined;
  await saveConfig(config);
  Logger.success('✓ Analytics disabled');
}

/**
 * Get current consent status
 */
export async function getConsentStatus(): Promise<boolean> {
  const config = await loadConfig();
  return config.enabled;
}

/**
 * Reset all analytics data and consent
 */
export async function resetAnalytics(): Promise<void> {
  try {
    if (await fs.pathExists(CONFIG_DIR)) {
      await fs.remove(CONFIG_DIR);
      Logger.success('✓ All analytics data removed');
    } else {
      Logger.info('No analytics data found');
    }
  } catch (error) {
    Logger.error('Failed to reset analytics data');
    throw error;
  }
}

