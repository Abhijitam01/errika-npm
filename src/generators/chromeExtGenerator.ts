import { BaseGenerator, GeneratorOptions, TemplateMetadata } from './baseGenerator';
import { templateRegistry } from './index';
import { Logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

export interface ChromeExtensionOptions {
  extensionType?: 'popup' | 'content-script' | 'background' | 'all';
  includeOptionsPage?: boolean;
  includeStorageSync?: boolean;
  uiFramework?: 'react' | 'vanilla';
}

export class ChromeExtGenerator extends BaseGenerator {
  private chromeOptions: ChromeExtensionOptions;

  constructor(options: GeneratorOptions) {
    const metadata: TemplateMetadata = {
      id: 'chrome-extension',
      name: 'Chrome Extension',
      description: 'Manifest V3, React, TypeScript',
      supportedPackageManagers: ['npm', 'yarn', 'pnpm', 'bun']
    };

    super(options, metadata);
    
    // Extract Chrome-specific options from templateVariables
    this.chromeOptions = {
      extensionType: options.templateVariables?.extensionType || 'all',
      includeOptionsPage: options.templateVariables?.includeOptionsPage !== false,
      includeStorageSync: options.templateVariables?.includeStorageSync !== false,
      uiFramework: options.templateVariables?.uiFramework || 'react'
    };
  }

  /**
   * Template-specific file processing
   */
  protected async processTemplateFiles(): Promise<void> {
    await this.configureExtensionFeatures();
  }

  /**
   * Configure extension features based on user choices
   */
  private async configureExtensionFeatures(): Promise<void> {
    const manifestPath = path.join(this.options.targetDirectory, 'public', 'manifest.json');
    const manifestContent = await fs.promises.readFile(manifestPath, 'utf-8');
    let manifest = JSON.parse(manifestContent);

    // Update permissions based on options
    if (!this.chromeOptions.includeStorageSync) {
      manifest.permissions = manifest.permissions.filter((p: string) => p !== 'storage');
    }

    // Configure based on extension type
    switch (this.chromeOptions.extensionType) {
      case 'popup':
        delete manifest.content_scripts;
        break;
      case 'content-script':
        delete manifest.action;
        delete manifest.options_page;
        break;
      case 'background':
        delete manifest.action;
        delete manifest.content_scripts;
        delete manifest.options_page;
        break;
      case 'all':
      default:
        // Keep all features
        break;
    }

    // Remove options page if not included
    if (!this.chromeOptions.includeOptionsPage) {
      delete manifest.options_page;
    }

    await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }

  /**
   * Display Chrome extension-specific next steps
   */
  protected displayNextSteps(): void {
    const { projectName, packageManager } = this.options;
    const isCurrentDir = projectName === '.' || projectName === './';
    const pmName = packageManager;

    Logger.newLine();
    Logger.gray('Next steps:');
    Logger.gray(`  cd ${isCurrentDir ? '.' : projectName}`);
    Logger.gray(`  ${pmName} run build      # Build the extension`);
    Logger.newLine();
    Logger.gray('📦 Loading the extension in Chrome:');
    Logger.gray('  1. Open Chrome and navigate to chrome://extensions/');
    Logger.gray('  2. Enable "Developer mode" (toggle in top-right)');
    Logger.gray('  3. Click "Load unpacked"');
    Logger.gray('  4. Select the "dist" folder from your project');
    Logger.newLine();
    Logger.gray('💡 Development mode (with hot reload):');
    Logger.gray(`  ${pmName} run dev`);
    Logger.newLine();
    Logger.cyan('📚 Your Chrome extension includes:');
    Logger.gray('  • Manifest V3 configuration');
    if (this.chromeOptions.uiFramework === 'react') {
      Logger.gray('  • React 19 for UI components');
    }
    Logger.gray('  • Background service worker');
    if (this.chromeOptions.extensionType === 'all' || this.chromeOptions.extensionType === 'content-script') {
      Logger.gray('  • Content scripts support');
    }
    if (this.chromeOptions.includeOptionsPage) {
      Logger.gray('  • Options page');
    }
    if (this.chromeOptions.includeStorageSync) {
      Logger.gray('  • Chrome Storage API (sync & local)');
    }
    Logger.gray('  • TypeScript throughout');
    Logger.gray('  • Vite for fast builds');
    Logger.newLine();
    Logger.gray('📖 Learn more: https://developer.chrome.com/docs/extensions/');
  }
}

// Register the Chrome extension generator
templateRegistry.register({
  metadata: {
    id: 'chrome-extension',
    name: 'Chrome Extension',
    description: 'Manifest V3, React, TypeScript',
    supportedPackageManagers: ['npm', 'yarn', 'pnpm', 'bun']
  },
  GeneratorClass: ChromeExtGenerator as any
});

