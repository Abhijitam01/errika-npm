import { BaseGenerator, GeneratorOptions, TemplateMetadata } from './baseGenerator';
import { templateRegistry } from './index';
import { Logger } from '../utils/logger';
import prompts from 'prompts';
import fs from 'fs';
import path from 'path';

interface DiscordBotOptions {
  includeDatabase: boolean;
  includeExampleCommands: boolean;
  includeModerationCommands: boolean;
  commandStyle: 'slash' | 'prefix' | 'both';
}

export class DiscordBotGenerator extends BaseGenerator {
  private botOptions?: DiscordBotOptions;

  constructor(options: GeneratorOptions) {
    const metadata: TemplateMetadata = {
      id: 'discord-bot',
      name: 'Discord Bot',
      description: 'discord.js v14, slash commands',
      supportedPackageManagers: ['npm', 'yarn', 'pnpm', 'bun']
    };

    super(options, metadata);
  }

  /**
   * Get Discord bot-specific prompts
   */
  static async getCustomPrompts(): Promise<DiscordBotOptions> {
    const questions: prompts.PromptObject[] = [
      {
        type: 'confirm',
        name: 'includeDatabase',
        message: 'Include database with Prisma?',
        initial: false
      },
      {
        type: 'confirm',
        name: 'includeExampleCommands',
        message: 'Include example commands (userinfo, serverinfo, help)?',
        initial: true
      },
      {
        type: 'confirm',
        name: 'includeModerationCommands',
        message: 'Include moderation commands (kick, ban, timeout)?',
        initial: false
      },
      {
        type: 'select',
        name: 'commandStyle',
        message: 'Command prefix style:',
        choices: [
          { title: 'Slash commands only (recommended)', value: 'slash' },
          { title: 'Prefix commands only', value: 'prefix' },
          { title: 'Both slash and prefix commands', value: 'both' }
        ],
        initial: 0
      }
    ];

    const answers = await prompts(questions, {
      onCancel: () => {
        console.log('\n❌ Operation cancelled.');
        process.exit(0);
      }
    });

    return answers as DiscordBotOptions;
  }

  /**
   * Template-specific file processing
   */
  protected async processTemplateFiles(): Promise<void> {
    if (!this.botOptions) {
      // If running without custom prompts (e.g., in tests), use defaults
      this.botOptions = {
        includeDatabase: false,
        includeExampleCommands: true,
        includeModerationCommands: false,
        commandStyle: 'slash'
      };
    }

    // Remove database files if not needed
    if (!this.botOptions.includeDatabase) {
      const prismaDir = path.join(this.options.targetDirectory, 'prisma');
      if (fs.existsSync(prismaDir)) {
        fs.rmSync(prismaDir, { recursive: true, force: true });
      }
    }

    // Remove example commands if not needed
    if (!this.botOptions.includeExampleCommands) {
      const commandsToRemove = ['userinfo.ts', 'serverinfo.ts', 'help.ts'];
      for (const cmd of commandsToRemove) {
        const cmdPath = path.join(this.options.targetDirectory, 'src', 'commands', cmd);
        if (fs.existsSync(cmdPath)) {
          fs.unlinkSync(cmdPath);
        }
      }
    }

    // Remove moderation commands if not needed
    if (!this.botOptions.includeModerationCommands) {
      const modCommandsDir = path.join(this.options.targetDirectory, 'src', 'commands', 'moderation');
      if (fs.existsSync(modCommandsDir)) {
        fs.rmSync(modCommandsDir, { recursive: true, force: true });
      }
    }

    // Remove prefix command handler if not using prefix commands
    if (this.botOptions.commandStyle === 'slash') {
      const messageCreatePath = path.join(this.options.targetDirectory, 'src', 'events', 'messageCreate.ts');
      if (fs.existsSync(messageCreatePath)) {
        fs.unlinkSync(messageCreatePath);
      }
    }

    // Update package.json with conditional dependencies
    const packageJsonPath = path.join(this.options.targetDirectory, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    if (this.botOptions.includeDatabase) {
      packageJson.dependencies = {
        ...packageJson.dependencies,
        '@prisma/client': '^5.8.0'
      };
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        'prisma': '^5.8.0'
      };
      packageJson.scripts = {
        ...packageJson.scripts,
        'db:generate': 'prisma generate',
        'db:push': 'prisma db push',
        'db:studio': 'prisma studio'
      };
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  }

  /**
   * Set bot options (used by CLI)
   */
  setBotOptions(options: DiscordBotOptions): void {
    this.botOptions = options;
    this.options.templateVariables = {
      ...this.options.templateVariables,
      ...options
    };
  }

  /**
   * Display Discord bot-specific next steps
   */
  protected displayNextSteps(): void {
    const { projectName, packageManager } = this.options;
    const isCurrentDir = projectName === '.' || projectName === './';
    const pmName = packageManager;

    Logger.newLine();
    Logger.bold('⚠️  Important: Configure your Discord bot before running!');
    Logger.newLine();
    Logger.cyan('🔧 Setup steps:');
    Logger.gray('  1. Create a Discord application at https://discord.com/developers/applications');
    Logger.gray('  2. Create a bot user and copy the token');
    Logger.gray('  3. Enable required intents in the Bot section:');
    Logger.gray('     - Presence Intent (for user status)');
    Logger.gray('     - Server Members Intent (for member events)');
    if (this.botOptions?.commandStyle !== 'slash') {
      Logger.gray('     - Message Content Intent (for prefix commands)');
    }
    Logger.gray('  4. Copy .env.example to .env and fill in your credentials');
    Logger.newLine();
    Logger.cyan('🚀 Next steps:');
    Logger.gray(`  cd ${isCurrentDir ? '.' : projectName}`);
    Logger.gray(`  cp .env.example .env      # Then edit with your credentials`);
    if (this.botOptions?.includeDatabase) {
      Logger.gray(`  ${pmName} run db:generate  # Generate Prisma client`);
      Logger.gray(`  ${pmName} run db:push      # Push database schema`);
    }
    Logger.gray(`  ${pmName} run register      # Register slash commands`);
    Logger.gray(`  ${pmName} run dev           # Start the bot`);
    Logger.newLine();
    Logger.cyan('📚 Your Discord bot includes:');
    Logger.gray('  ✅ discord.js v14');
    Logger.gray(`  ✅ ${this.botOptions?.commandStyle === 'slash' ? 'Slash commands' : this.botOptions?.commandStyle === 'prefix' ? 'Prefix commands' : 'Slash & Prefix commands'}`);
    Logger.gray('  ✅ Event handling system');
    Logger.gray('  ✅ TypeScript support');
    Logger.gray('  ✅ Command cooldowns & permissions');
    Logger.gray('  ✅ Error handling & validation');
    if (this.botOptions?.includeExampleCommands) {
      Logger.gray('  ✅ Example commands (ping, userinfo, serverinfo, help)');
    }
    if (this.botOptions?.includeModerationCommands) {
      Logger.gray('  ✅ Moderation commands (kick, ban, timeout)');
    }
    if (this.botOptions?.includeDatabase) {
      Logger.gray('  ✅ Prisma database integration');
    }
    Logger.newLine();
    Logger.gray('📖 Learn more: https://discordjs.guide/');
  }
}

// Register the Discord bot generator
templateRegistry.register({
  metadata: {
    id: 'discord-bot',
    name: 'Discord Bot',
    description: 'discord.js v14, slash commands',
    supportedPackageManagers: ['npm', 'yarn', 'pnpm', 'bun']
  },
  GeneratorClass: DiscordBotGenerator as any
});

