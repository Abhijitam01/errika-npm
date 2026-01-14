import { Command } from 'commander';
import path from 'path';
import chalk from 'chalk';
import { Logger } from './utils/logger';
import { runPrompts } from './prompts';
import { createGenerator } from './generators/index';
import { 
  requestConsent, 
  enableAnalytics, 
  disableAnalytics, 
  getConsentStatus,
  resetAnalytics 
} from './analytics/consent';
import { getUsageStats, getRecentEvents } from './analytics/analytics';
import { TemplateValidator } from './validators/templateValidator';

// Import all generators to register them
import './generators/turborepoGenerator';
import './generators/nextjsGenerator';
import './generators/expressReactGenerator';
import './generators/discordBotGenerator';
import './generators/chromeExtGenerator';

const packageJson = require('../package.json');

export async function createCLI(): Promise<Command> {
  const program = new Command();

  program
    .name('create-errika')
    .description('Create a new project with Errika')
    .version(packageJson.version || '2.0.0')
    .action(async () => {
      try {
        // Print banner
        Logger.printBanner();
        Logger.cyan(
          `\n✨ ${chalk.bold('Welcome to Errika!')} ${chalk.gray(
            "Let's craft your next project."
          )}\n`
        );
        Logger.gray(
          `${chalk.cyan('Pro tip')} ${chalk.gray(
            'Use '
          )}${chalk.yellow('--help')}${chalk.gray(
            ' to see usage examples at any time.'
          )}\n`
        );

        // Request analytics consent (non-blocking, asks only when needed)
        await requestConsent();

        // Run interactive prompts
        const answers = await runPrompts();

        // Determine target directory
        const cwd = process.cwd();
        const isCurrentDir = answers.projectName === '.' || answers.projectName === './';
        const targetDirectory = isCurrentDir ? cwd : path.join(cwd, answers.projectName);

        // Handle Discord bot-specific prompts
        let discordBotOptions;
        if (answers.template === 'discord-bot') {
          const { DiscordBotGenerator } = await import('./generators/discordBotGenerator');
          Logger.newLine();
          Logger.cyan('🤖 Discord Bot Configuration');
          Logger.newLine();
          discordBotOptions = await DiscordBotGenerator.getCustomPrompts();
        }

        // Check if this is a custom template
        const { getCustomTemplateConfig } = await import('./utils/customTemplates');
        const customConfig = await getCustomTemplateConfig(answers.template);
        
        let generator;
        
        if (customConfig) {
          // Custom template - use custom generator
          const { createCustomGenerator } = await import('./generators/customGenerator');
          generator = await createCustomGenerator(answers.template, {
            projectName: answers.projectName,
            targetDirectory,
            packageManager: answers.packageManager,
            initGit: answers.initGit,
            installDependencies: true,
            templateVariables: {
              frontendType: answers.frontendType,
              ...discordBotOptions
            }
          });
        } else {
          // Built-in template - use standard generator
          generator = createGenerator(answers.template, {
            projectName: answers.projectName,
            targetDirectory,
            packageManager: answers.packageManager,
            initGit: answers.initGit,
            installDependencies: true,
            templateVariables: {
              frontendType: answers.frontendType,
              ...discordBotOptions
            }
          });
        }

        // Set Discord bot options if applicable
        if (answers.template === 'discord-bot' && discordBotOptions) {
          const discordGenerator = generator as any;
          if (discordGenerator.setBotOptions) {
            discordGenerator.setBotOptions(discordBotOptions);
          }
        }

        // Generate project (multi-step with rich feedback)
        await generator.generate();

      } catch (error) {
        if (error instanceof Error) {
          Logger.error(error.message);

          const msg = error.message.toLowerCase();

          // Helpful suggestions based on common failure modes
          if (msg.includes('not empty')) {
            Logger.warning(
              '💡 Try using a different project name or start in an empty directory.'
            );
          } else if (msg.includes('package manager') && msg.includes('not installed')) {
            Logger.warning(
              '💡 Install the requested package manager or pick a different one when prompted.'
            );
          } else if (msg.includes('path must be within')) {
            Logger.warning(
              '💡 Use a relative project name (like "my-app" or ".") instead of an absolute path.'
            );
          } else {
            Logger.warning(
              '💡 Run with the --help flag for guidance, or re-run with a simpler configuration.'
            );
          }
        } else {
          Logger.error('An unexpected error occurred');
          console.error(error);
        }
        process.exit(1);
      }
    });

  // Add validate command
  program
    .command('validate')
    .description('Validate template structure and configuration')
    .argument('[template-name]', 'Specific template to validate (turborepo, nextjs, express-react, discord-bot, chrome-extension)')
    .option('-a, --all', 'Validate all templates')
    .action(async (templateName: string | undefined, options: { all?: boolean }) => {
      try {
        if (options.all) {
          // Validate all templates
          const results = await TemplateValidator.validateAllTemplates();
          TemplateValidator.printAllResults(results);
        } else if (templateName) {
          // Validate specific template
          const validTemplates = ['turborepo', 'nextjs', 'express-react', 'discord-bot', 'chrome-extension'];
          
          if (!validTemplates.includes(templateName)) {
            Logger.error(`Invalid template name: ${templateName}`);
            Logger.info(`Valid templates: ${validTemplates.join(', ')}`);
            process.exit(1);
          }

          const validator = new TemplateValidator(templateName);
          const result = await validator.validate();
          TemplateValidator.printResults(result);

          if (!result.valid) {
            process.exit(1);
          }
        } else {
          // No template specified, validate all
          Logger.info('No template specified, validating all templates...');
          Logger.info('Use "errika validate <template-name>" to validate a specific template');
          Logger.info('Use "errika validate --all" to explicitly validate all templates\n');
          
          const results = await TemplateValidator.validateAllTemplates();
          TemplateValidator.printAllResults(results);
        }
      } catch (error) {
        if (error instanceof Error) {
          Logger.error(error.message);
        } else {
          Logger.error('An unexpected error occurred during validation');
          console.error(error);
        }
        process.exit(1);
      }
    });

  // Stats command
  program
    .command('stats')
    .description('Show your personal usage statistics')
    .action(async () => {
      try {
        const stats = await getUsageStats();
        const recentEvents = await getRecentEvents(10);
        const isEnabled = await getConsentStatus();

        Logger.newLine();
        Logger.bold('📊 Errika Usage Statistics');
        Logger.gray('━'.repeat(50));
        Logger.newLine();

        // Overall stats
        Logger.cyan('Overall Stats:');
        Logger.gray(`  Total projects created: ${chalk.white(stats.totalProjects)}`);
        Logger.gray(`  Successful: ${chalk.green(stats.successfulProjects)}`);
        Logger.gray(`  Failed: ${chalk.red(stats.failedProjects)}`);
        
        if (stats.totalProjects > 0) {
          const successRate = ((stats.successfulProjects / stats.totalProjects) * 100).toFixed(1);
          Logger.gray(`  Success rate: ${chalk.yellow(successRate + '%')}`);
        }

        if (stats.firstUsed) {
          Logger.gray(`  First used: ${chalk.gray(new Date(stats.firstUsed).toLocaleDateString())}`);
        }
        if (stats.lastUsed) {
          Logger.gray(`  Last used: ${chalk.gray(new Date(stats.lastUsed).toLocaleDateString())}`);
        }

        Logger.newLine();

        // Template usage
        Logger.cyan('Template Usage:');
        if (Object.keys(stats.templateUsage).length > 0) {
          const sorted = Object.entries(stats.templateUsage).sort((a, b) => b[1] - a[1]);
          sorted.forEach(([template, count]) => {
            const bar = '█'.repeat(Math.min(count, 20));
            Logger.gray(`  ${template.padEnd(20)} ${chalk.cyan(bar)} ${chalk.white(count)}`);
          });
        } else {
          Logger.gray('  No templates used yet');
        }

        Logger.newLine();

        // Recent activity
        if (recentEvents.length > 0) {
          Logger.cyan('Recent Activity:');
          recentEvents.forEach((event) => {
            const date = new Date(event.timestamp).toLocaleString();
            const status = event.success ? chalk.green('✓') : chalk.red('✗');
            const template = chalk.yellow(event.template);
            Logger.gray(`  ${status} ${template} - ${chalk.gray(date)}`);
          });
          Logger.newLine();
        }

        // Analytics status
        Logger.gray('━'.repeat(50));
        if (isEnabled) {
          Logger.gray(`Analytics: ${chalk.green('Enabled')}`);
          Logger.gray(`  Disable: ${chalk.cyan('npx create-errika analytics disable')}`);
        } else {
          Logger.gray(`Analytics: ${chalk.red('Disabled')}`);
          Logger.gray(`  Enable: ${chalk.cyan('npx create-errika analytics enable')}`);
        }
        Logger.newLine();

      } catch (error) {
        Logger.error('Failed to load statistics');
        if (error instanceof Error) {
          Logger.gray(error.message);
        }
        process.exit(1);
      }
    });

  // Custom templates command group
  program
    .command('add-template <path>')
    .description('Add a custom template from a directory')
    .option('-n, --name <name>', 'Custom name for the template')
    .action(async (sourcePath: string, options: { name?: string }) => {
      try {
        const { addCustomTemplate } = await import('./utils/customTemplates');
        await addCustomTemplate(sourcePath, options.name);
      } catch (error) {
        if (error instanceof Error) {
          Logger.error(error.message);
        }
        process.exit(1);
      }
    });

  program
    .command('remove-template <name>')
    .alias('rm-template')
    .description('Remove a custom template')
    .action(async (templateName: string) => {
      try {
        const { removeCustomTemplate } = await import('./utils/customTemplates');
        await removeCustomTemplate(templateName);
      } catch (error) {
        if (error instanceof Error) {
          Logger.error(error.message);
        }
        process.exit(1);
      }
    });

  program
    .command('list-templates')
    .alias('ls-templates')
    .description('List all custom templates')
    .action(async () => {
      try {
        const { listCustomTemplates } = await import('./utils/customTemplates');
        await listCustomTemplates();
      } catch (error) {
        if (error instanceof Error) {
          Logger.error(error.message);
        }
        process.exit(1);
      }
    });

  // Analytics command group
  const analyticsCmd = program
    .command('analytics')
    .description('Manage analytics preferences');

  analyticsCmd
    .command('enable')
    .description('Enable anonymous usage analytics')
    .action(async () => {
      try {
        await enableAnalytics();
        Logger.gray(`  View your stats: ${chalk.cyan('npx create-errika stats')}`);
      } catch (error) {
        Logger.error('Failed to enable analytics');
        process.exit(1);
      }
    });

  analyticsCmd
    .command('disable')
    .description('Disable anonymous usage analytics')
    .action(async () => {
      try {
        await disableAnalytics();
        Logger.gray('  Your local stats will be preserved.');
        Logger.gray('  To remove all data, run: ' + chalk.cyan('npx create-errika analytics reset'));
      } catch (error) {
        Logger.error('Failed to disable analytics');
        process.exit(1);
      }
    });

  analyticsCmd
    .command('status')
    .description('Check analytics status')
    .action(async () => {
      try {
        const isEnabled = await getConsentStatus();
        Logger.newLine();
        if (isEnabled) {
          Logger.success('Analytics are currently enabled');
          Logger.gray(`  Disable: ${chalk.cyan('npx create-errika analytics disable')}`);
        } else {
          Logger.info('Analytics are currently disabled');
          Logger.gray(`  Enable: ${chalk.cyan('npx create-errika analytics enable')}`);
        }
        Logger.gray(`  View stats: ${chalk.cyan('npx create-errika stats')}`);
        Logger.newLine();
      } catch (error) {
        Logger.error('Failed to check analytics status');
        process.exit(1);
      }
    });

  analyticsCmd
    .command('reset')
    .description('Remove all analytics data and preferences')
    .action(async () => {
      try {
        await resetAnalytics();
      } catch (error) {
        Logger.error('Failed to reset analytics');
        process.exit(1);
      }
    });

  return program;
}

