import path from 'path';
import { execSync } from 'child_process';
import { Logger } from '../utils/logger';
import { 
  PackageManager, 
  validatePackageManager, 
  checkPackageManagerExists, 
  getInstallCommand,
  getRunCommand 
} from '../utils/packageManager';
import { 
  validatePath, 
  copyDirectory, 
  processTemplateDirectory,
  renameSpecialFiles,
  prepareDirectory 
} from '../utils/fileUtils';
import { initRepository } from '../utils/gitUtils';
import { trackProjectCreation } from '../analytics';

export interface GeneratorOptions {
  projectName: string;
  targetDirectory: string;
  packageManager: PackageManager;
  templateVariables?: Record<string, any>;
  initGit?: boolean;
  installDependencies?: boolean;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  supportedPackageManagers: PackageManager[];
}

export abstract class BaseGenerator {
  protected options: GeneratorOptions;
  protected templateDir: string;
  protected metadata: TemplateMetadata;

  constructor(options: GeneratorOptions, metadata: TemplateMetadata) {
    this.options = options;
    this.metadata = metadata;
    this.templateDir = path.join(__dirname, '../templates', metadata.id);
  }

  /**
   * Main method to generate the project
   */
  async generate(): Promise<void> {
    let errorType: string | undefined;

    try {
      Logger.bold(`\n🚀 Creating project "${this.options.projectName}"...`);
      Logger.newLine();

      // Validate
      await this.validate();

      // Copy template
      await this.copyTemplate();

      // Process files
      await this.processFiles();

      // Install dependencies
      if (this.options.installDependencies !== false) {
        await this.installDependencies();
      }

      // Initialize git
      if (this.options.initGit) {
        await this.initGit();
      }

      // Post-generate steps
      await this.postGenerate();

      // Success message
      Logger.newLine();
      Logger.success('Project setup complete! Happy hacking!');
      this.displayNextSteps();

      // Track successful project creation
      await trackProjectCreation(
        this.metadata.id,
        true,
        this.options.packageManager
      ).catch(() => {
        // Fail silently - analytics should never break the user experience
      });

    } catch (error) {
      // Categorize error type (generic, no sensitive data)
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('not empty')) {
          errorType = 'directory_not_empty';
        } else if (msg.includes('package manager') || msg.includes('not installed')) {
          errorType = 'package_manager_error';
        } else if (msg.includes('path')) {
          errorType = 'path_validation_error';
        } else if (msg.includes('permission')) {
          errorType = 'permission_error';
        } else {
          errorType = 'unknown_error';
        }

        Logger.error(error.message);
        if (error.message.includes('not installed') || error.message.includes('not available')) {
          Logger.warning('💡 Tip: Make sure the package manager is installed and available in your PATH.');
        }
      } else {
        errorType = 'unexpected_error';
        Logger.error('Error creating project');
        console.error(error);
      }

      // Track failed project creation
      await trackProjectCreation(
        this.metadata.id,
        false,
        this.options.packageManager,
        errorType
      ).catch(() => {
        // Fail silently
      });

      throw error;
    }
  }

  /**
   * Validate pre-generation requirements
   */
  protected async validate(): Promise<void> {
    const { packageManager, targetDirectory, projectName } = this.options;
    const cwd = process.cwd();
    const isCurrentDir = projectName === '.' || projectName === './';

    // Security: Runtime validation of package manager (defense in depth)
    validatePackageManager(packageManager);

    // Security: Validate path resolution to prevent path traversal
    if (!isCurrentDir) {
      validatePath(targetDirectory, cwd);
    }

    // Security: Check if package manager is installed before proceeding
    const spinner = Logger.spinner(`Checking if ${packageManager} is installed...`);
    try {
      checkPackageManagerExists(packageManager);
      spinner.succeed(`${packageManager} is available`);
    } catch (error) {
      spinner.fail(`${packageManager} is not available`);
      throw error;
    }

    // Check if package manager is supported by this template
    if (!this.metadata.supportedPackageManagers.includes(packageManager)) {
      throw new Error(
        `Package manager "${packageManager}" is not supported by ${this.metadata.name}.\n` +
        `Supported package managers: ${this.metadata.supportedPackageManagers.join(', ')}`
      );
    }

    // Prepare directory
    await prepareDirectory(targetDirectory);

    // Template-specific validation
    await this.validateTemplate();
  }

  /**
   * Template-specific validation (to be overridden by subclasses)
   */
  protected async validateTemplate(): Promise<void> {
    // Override in subclasses if needed
  }

  /**
   * Copy template files to target directory
   */
  protected async copyTemplate(): Promise<void> {
    const spinner = Logger.spinner('Copying template files...');
    
    try {
      await copyDirectory(this.templateDir, this.options.targetDirectory, {
        filter: (src) => {
          // Filter out build artifacts and dependencies
          const exclude = ['node_modules', 'dist', 'build', '.turbo', '.next'];
          return !exclude.some(pattern => src.includes(pattern));
        }
      });

      // Rename special files
      await renameSpecialFiles(this.options.targetDirectory);

      spinner.succeed('Template copied successfully');
    } catch (error) {
      spinner.fail('Failed to copy template');
      throw error;
    }
  }

  /**
   * Process template files with variables
   */
  protected async processFiles(): Promise<void> {
    const spinner = Logger.spinner('Processing template files...');
    
    try {
      const variables = {
        projectName: this.options.projectName,
        ...this.options.templateVariables
      };

      await processTemplateDirectory(this.options.targetDirectory, variables);

      // Template-specific file processing
      await this.processTemplateFiles();

      spinner.succeed('Template files processed');
    } catch (error) {
      spinner.fail('Failed to process template files');
      throw error;
    }
  }

  /**
   * Template-specific file processing (to be overridden by subclasses)
   */
  protected async processTemplateFiles(): Promise<void> {
    // Override in subclasses if needed
  }

  /**
   * Install project dependencies
   */
  protected async installDependencies(): Promise<void> {
    const { packageManager, targetDirectory } = this.options;
    const pmName = packageManager === 'bun' ? 'bun' : packageManager;
    
    Logger.blueBright(`\n📥 Installing dependencies using ${pmName}...`);
    
    try {
      execSync(getInstallCommand(packageManager), {
        cwd: targetDirectory,
        stdio: 'inherit',
        shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
      });
    } catch (error) {
      Logger.error('Failed to install dependencies');
      throw error;
    }
  }

  /**
   * Initialize git repository
   */
  protected async initGit(): Promise<void> {
    await initRepository(this.options.targetDirectory, true);
  }

  /**
   * Post-generation steps (to be overridden by subclasses)
   */
  protected async postGenerate(): Promise<void> {
    // Override in subclasses if needed
  }

  /**
   * Display next steps to the user
   */
  protected displayNextSteps(): void {
    const { projectName, packageManager } = this.options;
    const isCurrentDir = projectName === '.' || projectName === './';
    const pmName = packageManager === 'bun' ? 'bun' : packageManager;

    Logger.newLine();
    Logger.gray('Next steps:');
    Logger.gray(`  cd ${isCurrentDir ? '.' : projectName}`);
    Logger.gray(`  ${getRunCommand(packageManager, 'dev')}`);
  }

  /**
   * Get template metadata
   */
  getMetadata(): TemplateMetadata {
    return this.metadata;
  }
}
