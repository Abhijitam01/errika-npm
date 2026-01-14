import fs from 'fs-extra';
import path from 'path';
import { Logger } from '../utils/logger';
import { FileValidator, FileValidationResult, RequiredFile } from './fileValidator';
import { ConfigValidator, ConfigValidationResult } from './configValidator';

export interface PlaceholderValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  placeholders: Set<string>;
}

export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    filesChecked: number;
    placeholdersFound: number;
  };
}

export class TemplateValidator {
  private templateDir: string;
  private templateName: string;

  constructor(templateName: string) {
    this.templateName = templateName;
    this.templateDir = path.join(__dirname, '../../src/templates', templateName);
  }

  /**
   * Main validation method - runs all validation checks
   */
  async validate(): Promise<TemplateValidationResult> {
    const overallResult: TemplateValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      stats: {
        filesChecked: 0,
        placeholdersFound: 0
      }
    };

    Logger.bold(`\n🔍 Validating template: ${this.templateName}\n`);

    // Check if template directory exists
    const dirExists = await fs.pathExists(this.templateDir);
    if (!dirExists) {
      overallResult.valid = false;
      overallResult.errors.push(`Template directory does not exist: ${this.templateDir}`);
      return overallResult;
    }

    // Run all validation checks
    const checks = [
      { name: 'Directory Structure', fn: () => this.validateDirectoryExists() },
      { name: 'Required Files', fn: () => this.validateRequiredFiles() },
      { name: 'Configuration Files', fn: () => this.validateConfigs() },
      { name: 'Gitignore', fn: () => this.validateGitignore() },
      { name: 'Placeholders', fn: () => this.validatePlaceholders() },
      { name: 'Sensitive Data', fn: () => this.validateSensitiveData() },
      { name: 'File Structure', fn: () => this.validateFileStructure() }
    ];

    for (const check of checks) {
      const spinner = Logger.spinner(`Running ${check.name} check...`);
      
      try {
        const result = await check.fn();
        
        if (result.errors && result.errors.length > 0) {
          overallResult.valid = false;
          overallResult.errors.push(...result.errors);
          spinner.fail(`${check.name}: ${result.errors.length} error(s)`);
        } else {
          spinner.succeed(`${check.name}: OK`);
        }

        if (result.warnings && result.warnings.length > 0) {
          overallResult.warnings.push(...result.warnings);
        }

        // Update stats
        if ('placeholders' in result) {
          overallResult.stats.placeholdersFound = (result as PlaceholderValidationResult).placeholders.size;
        }

      } catch (error) {
        spinner.fail(`${check.name}: Failed`);
        overallResult.valid = false;
        overallResult.errors.push(`${check.name} check failed: ${error}`);
      }
    }

    // Count files
    overallResult.stats.filesChecked = await this.countFiles(this.templateDir);

    return overallResult;
  }

  /**
   * Validate that template directory exists
   */
  private async validateDirectoryExists(): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    const exists = await fs.pathExists(this.templateDir);
    if (!exists) {
      result.valid = false;
      result.errors.push(`Template directory does not exist: ${this.templateDir}`);
    }

    return result;
  }

  /**
   * Validate required files based on template type
   */
  private async validateRequiredFiles(): Promise<FileValidationResult> {
    const commonRequiredFiles: RequiredFile[] = [
      { path: 'package.json', description: 'Package configuration' },
      { path: 'README.md', description: 'Documentation' },
      { path: 'gitignore', description: 'Git ignore file' }
    ];

    // Add template-specific required files
    const templateSpecificFiles = this.getTemplateSpecificFiles();
    const allRequiredFiles = [...commonRequiredFiles, ...templateSpecificFiles];

    return await FileValidator.validateRequiredFiles(this.templateDir, allRequiredFiles);
  }

  /**
   * Get template-specific required files
   */
  private getTemplateSpecificFiles(): RequiredFile[] {
    const files: RequiredFile[] = [];

    switch (this.templateName) {
      case 'nextjs':
        files.push(
          { path: 'next.config.js', description: 'Next.js configuration' },
          { path: 'tsconfig.json', description: 'TypeScript configuration' },
          { path: 'tailwind.config.ts', description: 'Tailwind configuration' },
          { path: 'app/layout.tsx', description: 'App layout' },
          { path: 'app/page.tsx', description: 'Main page' }
        );
        break;

      case 'turborepo':
        files.push(
          { path: 'turbo.json', description: 'Turborepo configuration' },
          { path: 'pnpm-workspace.yaml', description: 'PNPM workspace configuration' }
        );
        break;

      case 'express-react':
        files.push(
          { path: 'backend/package.json', description: 'Backend package.json' },
          { path: 'frontend/package.json', description: 'Frontend package.json' },
          { path: 'backend/tsconfig.json', description: 'Backend TypeScript config' },
          { path: 'frontend/tsconfig.json', description: 'Frontend TypeScript config' }
        );
        break;

      case 'discord-bot':
        files.push(
          { path: 'tsconfig.json', description: 'TypeScript configuration' },
          { path: 'src/index.ts', description: 'Main entry point' }
        );
        break;

      case 'chrome-extension':
        files.push(
          { path: 'tsconfig.json', description: 'TypeScript configuration' },
          { path: 'vite.config.ts', description: 'Vite configuration' },
          { path: 'public/manifest.json', description: 'Extension manifest' }
        );
        break;
    }

    return files;
  }

  /**
   * Validate configuration files
   */
  private async validateConfigs(): Promise<ConfigValidationResult> {
    return await ConfigValidator.validateAllConfigs(this.templateDir);
  }

  /**
   * Validate .gitignore
   */
  private async validateGitignore(): Promise<FileValidationResult> {
    return await FileValidator.validateGitignore(this.templateDir);
  }

  /**
   * Validate placeholders in template files
   */
  private async validatePlaceholders(): Promise<PlaceholderValidationResult> {
    const result: PlaceholderValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      placeholders: new Set<string>()
    };

    const validPlaceholders = [
      '{{projectName}}',
      '{{PROJECT_NAME}}',
      '{{description}}',
      '{{author}}',
      '{{frontendType}}'
    ];

    async function scanForPlaceholders(dir: string): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip certain directories
        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
            await scanForPlaceholders(fullPath);
          }
        } else if (entry.isFile()) {
          // Only scan text files
          const ext = path.extname(entry.name).toLowerCase();
          const textExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css'];
          
          if (textExtensions.includes(ext)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              const placeholderRegex = /\{\{([^}]+)\}\}/g;
              let match;

              while ((match = placeholderRegex.exec(content)) !== null) {
                const placeholder = match[0];
                result.placeholders.add(placeholder);

                // Check if it's a valid placeholder
                if (!validPlaceholders.includes(placeholder)) {
                  result.warnings.push(
                    `Unknown placeholder ${placeholder} in ${path.relative(dir, fullPath)}`
                  );
                }
              }
            } catch (error) {
              // Skip files that can't be read as text
            }
          }
        }
      }
    }

    try {
      await scanForPlaceholders(this.templateDir);
    } catch (error) {
      result.errors.push(`Error scanning for placeholders: ${error}`);
      result.valid = false;
    }

    return result;
  }

  /**
   * Validate for sensitive data
   */
  private async validateSensitiveData(): Promise<FileValidationResult> {
    return await FileValidator.scanForSensitiveData(this.templateDir);
  }

  /**
   * Validate file structure
   */
  private async validateFileStructure(): Promise<FileValidationResult> {
    return await FileValidator.validateFileStructure(this.templateDir);
  }

  /**
   * Count total files in template
   */
  private async countFiles(dir: string): Promise<number> {
    let count = 0;
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          count += await this.countFiles(fullPath);
        }
      } else {
        count++;
      }
    }

    return count;
  }

  /**
   * Print validation results
   */
  static printResults(result: TemplateValidationResult): void {
    Logger.newLine();
    
    if (result.valid) {
      Logger.success('✅ Template validation passed!');
    } else {
      Logger.error('❌ Template validation failed!');
    }

    Logger.newLine();
    Logger.gray(`Files checked: ${result.stats.filesChecked}`);
    Logger.gray(`Placeholders found: ${result.stats.placeholdersFound}`);
    Logger.newLine();

    if (result.errors.length > 0) {
      Logger.error(`\n❌ Errors (${result.errors.length}):`);
      result.errors.forEach(error => {
        Logger.error(`  • ${error}`);
      });
    }

    if (result.warnings.length > 0) {
      Logger.warning(`\n⚠️  Warnings (${result.warnings.length}):`);
      result.warnings.forEach(warning => {
        Logger.warning(`  • ${warning}`);
      });
    }

    Logger.newLine();
  }

  /**
   * Validate all templates
   */
  static async validateAllTemplates(): Promise<Map<string, TemplateValidationResult>> {
    const templates = ['turborepo', 'nextjs', 'express-react', 'discord-bot', 'chrome-extension'];
    const results = new Map<string, TemplateValidationResult>();

    Logger.bold('\n🔍 Validating all templates...\n');

    for (const template of templates) {
      const validator = new TemplateValidator(template);
      const result = await validator.validate();
      results.set(template, result);
      Logger.newLine();
    }

    return results;
  }

  /**
   * Print summary of all template validations
   */
  static printAllResults(results: Map<string, TemplateValidationResult>): void {
    Logger.newLine();
    Logger.bold('📊 Validation Summary:\n');

    let totalValid = 0;
    let totalErrors = 0;
    let totalWarnings = 0;

    results.forEach((result, template) => {
      const status = result.valid ? '✅' : '❌';
      Logger.info(`${status} ${template}: ${result.errors.length} errors, ${result.warnings.length} warnings`);
      
      if (result.valid) totalValid++;
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;
    });

    Logger.newLine();
    Logger.bold(`Total: ${totalValid}/${results.size} templates valid`);
    Logger.gray(`Total errors: ${totalErrors}`);
    Logger.gray(`Total warnings: ${totalWarnings}`);
    Logger.newLine();

    const allValid = Array.from(results.values()).every(r => r.valid);
    if (!allValid) {
      process.exit(1);
    }
  }
}

