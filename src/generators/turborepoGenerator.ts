import path from 'path';
import fs from 'fs-extra';
import { BaseGenerator, GeneratorOptions, TemplateMetadata } from './baseGenerator';
import { templateRegistry } from './index';
import { Logger } from '../utils/logger';

export type FrontendType = 'nextjs' | 'react' | 'react-native';

export interface TurborepoOptions extends GeneratorOptions {
  frontendType: FrontendType;
}

export class TurborepoGenerator extends BaseGenerator {
  private turborepoOptions: TurborepoOptions;

  constructor(options: TurborepoOptions) {
    const metadata: TemplateMetadata = {
      id: 'turborepo',
      name: 'Turborepo',
      description: 'Monorepo with multiple backends',
      supportedPackageManagers: ['pnpm', 'bun']
    };

    super(options, metadata);
    this.turborepoOptions = {
      ...options,
      frontendType: options.frontendType ?? (options.templateVariables?.frontendType as FrontendType) ?? 'nextjs'
    };
  }

  /**
   * Get the source web app directory name based on frontend type
   */
  private getWebAppSource(): string {
    switch (this.turborepoOptions.frontendType) {
      case 'nextjs':
        return 'web';
      case 'react':
        return 'web-react';
      case 'react-native':
        return 'web-rn';
    }
  }

  /**
   * Get the target web app directory name
   */
  private getWebAppTarget(): string {
    return this.turborepoOptions.frontendType === 'react-native' ? 'mobile' : 'web';
  }

  /**
   * Override copy template to handle selective copying of frontend apps
   */
  protected async copyTemplate(): Promise<void> {
    const spinner = Logger.spinner('Copying template files...');
    
    try {
      const { targetDirectory } = this.options;
      const templateDir = this.templateDir;

      // Copy base template files (excluding apps directory)
      const files = await fs.readdir(templateDir);
      
      for (const file of files) {
        if (file === 'apps') {
          // Handle apps directory specially
          const appsDir = path.join(templateDir, 'apps');
          const targetAppsDir = path.join(targetDirectory, 'apps');
          await fs.ensureDir(targetAppsDir);
          
          // Copy backends
          await fs.copy(
            path.join(appsDir, 'http-backend'), 
            path.join(targetAppsDir, 'http-backend')
          );
          await fs.copy(
            path.join(appsDir, 'ws-backend'), 
            path.join(targetAppsDir, 'ws-backend')
          );
          
          // Copy selected web app
          const webAppSource = this.getWebAppSource();
          const webAppTarget = this.getWebAppTarget();
          const sourceWebPath = path.join(appsDir, webAppSource);
          const targetWebPath = path.join(targetAppsDir, webAppTarget);
          
          if (await fs.pathExists(sourceWebPath)) {
            await fs.copy(sourceWebPath, targetWebPath);
          } else {
            Logger.warning(`Template for ${this.turborepoOptions.frontendType} not found. Using Next.js as fallback.`);
            await fs.copy(path.join(appsDir, 'web'), path.join(targetAppsDir, 'web'));
          }
        } else {
          // Copy other files and directories normally
          await fs.copy(
            path.join(templateDir, file), 
            path.join(targetDirectory, file),
            {
              overwrite: true,
              errorOnExist: false,
              filter: (src) => {
                // Filter out build artifacts
                const exclude = ['node_modules', 'dist', 'build', '.turbo', '.next'];
                return !exclude.some(pattern => src.includes(pattern));
              }
            }
          );
        }
      }

      spinner.succeed('Template copied successfully');
    } catch (error) {
      spinner.fail('Failed to copy template');
      throw error;
    }
  }

  /**
   * Display Turborepo-specific next steps
   */
  protected displayNextSteps(): void {
    const { projectName, packageManager } = this.options;
    const isCurrentDir = projectName === '.' || projectName === './';
    const pmName = packageManager === 'bun' ? 'bun' : packageManager;

    Logger.newLine();
    Logger.gray('Next steps:');
    Logger.gray(`  cd ${isCurrentDir ? '.' : projectName}`);
    Logger.gray(`  ${pmName} dev          # Start all apps in development mode`);
    Logger.gray(`  ${pmName} build        # Build all apps and packages`);
    Logger.newLine();
    Logger.cyan('📚 Your monorepo includes:');
    Logger.gray(`  • ${this.getWebAppTarget()} - Your ${this.turborepoOptions.frontendType} frontend`);
    Logger.gray('  • http-backend - Express.js HTTP server');
    Logger.gray('  • ws-backend - WebSocket server');
    Logger.gray('  • @repo/ui - Shared React components');
    Logger.gray('  • @repo/eslint-config - Shared ESLint configs');
    Logger.gray('  • @repo/typescript-config - Shared TypeScript configs');
  }
}

// Register the Turborepo generator
templateRegistry.register({
  metadata: {
    id: 'turborepo',
    name: 'Turborepo',
    description: 'Monorepo with multiple backends',
    supportedPackageManagers: ['pnpm', 'bun']
  },
  GeneratorClass: TurborepoGenerator as any
});

