import chalk from 'chalk';

/**
 * Logger utility with colored console output
 */
export const logger = {
  /**
   * Log info message (cyan)
   */
  info: (message: string): void => {
    console.log(chalk.cyan(`ℹ ${message}`));
  },

  /**
   * Log success message (green)
   */
  success: (message: string): void => {
    console.log(chalk.green(`✓ ${message}`));
  },

  /**
   * Log warning message (yellow)
   */
  warn: (message: string): void => {
    console.log(chalk.yellow(`⚠ ${message}`));
  },

  /**
   * Log error message (red)
   */
  error: (message: string, error?: Error): void => {
    console.log(chalk.red(`✗ ${message}`));
    if (error && error.stack) {
      console.log(chalk.red(error.stack));
    }
  },

  /**
   * Log debug message (gray) - only in development
   */
  debug: (message: string): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(chalk.gray(`🔍 ${message}`));
    }
  },

  /**
   * Log command execution
   */
  command: (user: string, command: string): void => {
    console.log(chalk.magenta(`⚡ ${user} executed: ${command}`));
  },

  /**
   * Log event
   */
  event: (eventName: string, details?: string): void => {
    const msg = details ? `${eventName}: ${details}` : eventName;
    console.log(chalk.blue(`📡 ${msg}`));
  },

  /**
   * Log bot ready
   */
  ready: (username: string): void => {
    console.log(chalk.green.bold(`\n🤖 ${username} is online and ready!\n`));
  },

  /**
   * Create a divider line
   */
  divider: (): void => {
    console.log(chalk.gray('─'.repeat(50)));
  },
};

