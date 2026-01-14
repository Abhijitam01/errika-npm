import chalk from 'chalk';
import figlet from 'figlet';
import ora, { Ora } from 'ora';

const log = console.log;

export class Logger {
  static info(message: string): void {
    log(chalk.blue(`ℹ ${message}`));
  }

  static success(message: string): void {
    log(chalk.green(`✅ ${message}`));
  }

  static error(message: string): void {
    log(chalk.red(`❌ ${message}`));
  }

  static warning(message: string): void {
    log(chalk.yellow(`⚠️  ${message}`));
  }

  static bold(message: string): void {
    log(chalk.bold(message));
  }

  static gray(message: string): void {
    log(chalk.gray(message));
  }

  static cyan(message: string): void {
    log(chalk.cyan(message));
  }

  static blueBright(message: string): void {
    log(chalk.blueBright(message));
  }

  static printBanner(): void {
    const title = figlet.textSync('Errika', {
      horizontalLayout: 'default'
    });

    const versionLabel = chalk.gray('Create modern stacks in seconds');
    const border = chalk.cyanBright('━'.repeat(40));

    log('');
    log(border);
    log(chalk.cyanBright(title));
    log(chalk.magentaBright('   ✨ A premium project scaffolding CLI ✨'));
    log('');
    log(`   ${chalk.white('Fast. Secure. DX-obsessed.')}`);
    log(`   ${chalk.gray('Templates: Turborepo, Next.js, Express + React, Discord, Chrome Ext')}`);
    log('');
    log(`   ${chalk.cyan('Tip')} ${chalk.gray('Use arrow keys to navigate,')} ${chalk.cyan('Enter')} ${chalk.gray('to select')}`);
    log(border);
    log('');
  }

  static spinner(text: string): Ora {
    return ora({
      text,
      spinner: 'dots',
      color: 'cyan'
    }).start();
  }

  static newLine(): void {
    log('');
  }
}

