import { BaseGenerator, GeneratorOptions, TemplateMetadata } from './baseGenerator';
import { Logger } from '../utils/logger';
import { getResolvedTemplate, TemplateConfig, CustomScript } from '../utils/customTemplates';
import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';

export class CustomGenerator extends BaseGenerator {
  private customConfig: TemplateConfig;
  private baseTemplatePath?: string;

  constructor(options: GeneratorOptions, customConfig: TemplateConfig, baseTemplatePath?: string) {
    const metadata: TemplateMetadata = {
      id: customConfig.name,
      name: customConfig.name,
      description: customConfig.description,
      supportedPackageManagers: customConfig.supportedPackageManagers as any || ['npm', 'yarn', 'pnpm', 'bun']
    };

    super(options, metadata);
    this.customConfig = customConfig;
    this.baseTemplatePath = baseTemplatePath;
  }

  /**
   * Copy template with inheritance support
   */
  protected async copyTemplate(): Promise<void> {
    const spinner = Logger.spinner('Copying template files...');
    
    try {
      // If template extends another, copy base template first
      if (this.baseTemplatePath) {
        await this.copyBaseTemplate();
      }

      // Copy custom template files (overrides base)
      await this.copyCustomTemplate();

      // Rename special files
      const { renameSpecialFiles } = require('../utils/fileUtils');
      await renameSpecialFiles(this.options.targetDirectory);

      spinner.succeed('Template copied successfully');
    } catch (error) {
      spinner.fail('Failed to copy template');
      throw error;
    }
  }

  /**
   * Copy base template files
   */
  private async copyBaseTemplate(): Promise<void> {
    if (!this.baseTemplatePath) return;

    Logger.info(`Copying base template from: ${path.basename(this.baseTemplatePath)}`);

    const { copyDirectory } = require('../utils/fileUtils');
    await copyDirectory(this.baseTemplatePath, this.options.targetDirectory, {
      filter: (src: string) => {
        const exclude = ['node_modules', 'dist', 'build', '.turbo', '.next'];
        return !exclude.some(pattern => src.includes(pattern));
      }
    });
  }

  /**
   * Copy custom template files (with selective overrides)
   */
  private async copyCustomTemplate(): Promise<void> {
    const { copyDirectory } = require('../utils/fileUtils');
    
    // Get files to exclude if specified in config
    const excludePatterns = this.customConfig.files?.exclude || [];
    const overridePatterns = this.customConfig.files?.override || [];

    await copyDirectory(this.templateDir, this.options.targetDirectory, {
      filter: (src: string) => {
        // Don't copy template.config.json to generated project
        if (src.includes('template.config.json')) {
          return false;
        }

        // Check exclude patterns
        for (const pattern of excludePatterns) {
          if (src.includes(pattern)) {
            return false;
          }
        }

        const exclude = ['node_modules', 'dist', 'build', '.turbo', '.next'];
        return !exclude.some(pattern => src.includes(pattern));
      }
    });
  }

  /**
   * Run custom scripts before generation
   */
  protected async validateTemplate(): Promise<void> {
    await super.validateTemplate();
    await this.runCustomScripts('before');
  }

  /**
   * Run custom scripts after generation
   */
  protected async postGenerate(): Promise<void> {
    await super.postGenerate();
    await this.runCustomScripts('after');
  }

  /**
   * Run custom scripts defined in template config
   */
  private async runCustomScripts(when: 'before' | 'after'): Promise<void> {
    if (!this.customConfig.customScripts) return;

    const scripts = this.customConfig.customScripts.filter(
      (script: CustomScript) => (script.when || 'after') === when
    );

    for (const script of scripts) {
      Logger.info(`Running custom script: ${script.name}`);
      
      if (script.description) {
        Logger.gray(script.description);
      }

      try {
        execSync(script.command, {
          cwd: this.options.targetDirectory,
          stdio: 'inherit',
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
        });
      } catch (error) {
        Logger.warning(`Custom script '${script.name}' failed`);
      }
    }
  }

  /**
   * Display custom template next steps
   */
  protected displayNextSteps(): void {
    const { projectName, packageManager } = this.options;
    const isCurrentDir = projectName === '.' || projectName === './';

    Logger.newLine();
    Logger.gray('Next steps:');
    Logger.gray(`  cd ${isCurrentDir ? '.' : projectName}`);

    if (this.customConfig.extends) {
      Logger.gray(`  # This template extends: ${this.customConfig.extends}`);
    }

    Logger.gray(`  ${packageManager} install`);
    Logger.gray(`  ${packageManager} run dev`);

    if (this.customConfig.author) {
      Logger.newLine();
      Logger.gray(`Created by: ${this.customConfig.author}`);
    }
  }
}

/**
 * Factory function to create a custom generator
 */
export async function createCustomGenerator(
  templateId: string,
  options: GeneratorOptions
): Promise<CustomGenerator> {
  const resolved = await getResolvedTemplate(templateId);
  
  // Override template directory to use custom template path
  const customOptions = {
    ...options,
    templateVariables: {
      ...options.templateVariables,
      ...resolved.config,
    }
  };

  const generator = new CustomGenerator(
    customOptions,
    resolved.config,
    resolved.baseTemplatePath
  );

  // Override templateDir to point to custom template
  (generator as any).templateDir = resolved.templatePath;

  return generator;
}

