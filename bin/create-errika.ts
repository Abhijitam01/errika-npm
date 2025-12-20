#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import figlet from 'figlet';
import prompts from 'prompts';

const log = console.log;

type PackageManager = 'pnpm' | 'bun';
type ProjectType = 'nextjs' | 'react' | 'react-native';

interface ProjectOptions {
  name: string;
  packageManager: PackageManager;
  projectType: ProjectType;
}

function printBanner() {
  log(
    chalk.cyan(
      figlet.textSync('Errika', { horizontalLayout: 'default' })
    )
  );
}

async function getWebAppSource(projectType: ProjectType): Promise<string> {
  switch (projectType) {
    case 'nextjs':
      return 'web';
    case 'react':
      return 'web-react';
    case 'react-native':
      return 'web-rn';
  }
}

async function getWebAppTarget(projectType: ProjectType): Promise<string> {
  return projectType === 'react-native' ? 'mobile' : 'web';
}

/**
 * Validate that package manager is in the allowed list (defense in depth)
 */
function validatePackageManager(pm: string): asserts pm is PackageManager {
  const allowedPMs: PackageManager[] = ['pnpm', 'bun'];
  if (!allowedPMs.includes(pm as PackageManager)) {
    throw new Error(`Invalid package manager: ${pm}. Allowed values: ${allowedPMs.join(', ')}`);
  }
}

/**
 * Validate that the resolved path is within the intended directory (prevent path traversal)
 */
function validatePath(targetPath: string, basePath: string): void {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedBase = path.resolve(basePath);
  
  if (!resolvedTarget.startsWith(resolvedBase)) {
    throw new Error(`Project path must be within the current directory. Invalid path: ${targetPath}`);
  }
}

/**
 * Check if a package manager is installed and available
 */
function checkPackageManagerExists(packageManager: PackageManager): void {
  try {
    // Use 'which' on Unix-like systems, 'where' on Windows
    const checkCommand = process.platform === 'win32' ? 'where' : 'which';
    execSync(`${checkCommand} ${packageManager}`, { 
      stdio: 'ignore',
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
    });
  } catch {
    throw new Error(
      `${packageManager} is not installed or not available in PATH.\n` +
      `Please install ${packageManager} first:\n` +
      (packageManager === 'pnpm' 
        ? '  npm install -g pnpm'
        : '  Visit https://bun.sh for installation instructions')
    );
  }
}

async function createProject(options: ProjectOptions) {
  const { name: projectName, packageManager, projectType } = options;
  const cwd = process.cwd();
  const isCurrentDir = projectName === '.' || projectName === './';
  const targetDir = isCurrentDir ? cwd : path.join(cwd, projectName);
  const templateDir = path.join(__dirname, '..', 'template');

  log(chalk.bold(`\n🚀 Creating project in "${isCurrentDir ? '.' : projectName}"...`));

  try {
    // Security: Runtime validation of package manager (defense in depth)
    validatePackageManager(packageManager);

    // Security: Validate path resolution to prevent path traversal
    if (!isCurrentDir) {
      validatePath(targetDir, cwd);
    }

    // Security: Check if package manager is installed before proceeding
    log(chalk.blueBright(`\n🔍 Checking if ${packageManager} is installed...`));
    checkPackageManagerExists(packageManager);
    log(chalk.green(`✅ ${packageManager} is available`));
    if (!isCurrentDir && !fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }

    if (fs.readdirSync(targetDir).length > 0) {
      log(chalk.red(`❌ Directory "${targetDir}" is not empty.`));
      process.exit(1);
    }

    // Copy base template files (excluding web apps)
    const files = await fs.readdir(templateDir);
    for (const file of files) {
      // Skip web app directories - we'll copy the right one based on user choice
      if (file === 'apps') {
        const appsDir = path.join(templateDir, 'apps');
        const targetAppsDir = path.join(targetDir, 'apps');
        await fs.ensureDir(targetAppsDir);
        
        // Copy backends
        await fs.copy(path.join(appsDir, 'http-backend'), path.join(targetAppsDir, 'http-backend'));
        await fs.copy(path.join(appsDir, 'ws-backend'), path.join(targetAppsDir, 'ws-backend'));
        
        // Copy selected web app
        const webAppSource = await getWebAppSource(projectType);
        const webAppTarget = await getWebAppTarget(projectType);
        const sourceWebPath = path.join(appsDir, webAppSource);
        const targetWebPath = path.join(targetAppsDir, webAppTarget);
        
        if (await fs.pathExists(sourceWebPath)) {
          await fs.copy(sourceWebPath, targetWebPath);
        } else {
          log(chalk.yellow(`⚠️  Template for ${projectType} not found yet. Using Next.js as fallback.`));
          await fs.copy(path.join(appsDir, 'web'), path.join(targetAppsDir, 'web'));
        }
      } else {
        await fs.copy(path.join(templateDir, file), path.join(targetDir, file), {
          overwrite: true,
          errorOnExist: false,
        });
      }
    }

    log(chalk.green('📦 Template copied successfully.'));

    // Install dependencies
    const pmName = packageManager === 'bun' ? 'bun' : 'pnpm';
    log(chalk.blueBright(`\n📥 Installing dependencies using ${pmName}...`));
    execSync(`${packageManager} install`, {
      cwd: targetDir,
      stdio: 'inherit',
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
    });

    log(chalk.green('\n✅ Project setup complete! Happy hacking!'));
    log(chalk.gray(`\nNext steps:`));
    log(chalk.gray(`  cd ${isCurrentDir ? '.' : projectName}`));
    log(chalk.gray(`  ${pmName} dev`));
  } catch (err) {
    // Better error handling - show user-friendly messages
    if (err instanceof Error) {
      log(chalk.red(`\n❌ Error: ${err.message}`));
      if (err.message.includes('not installed') || err.message.includes('not available')) {
        log(chalk.yellow('\n💡 Tip: Make sure the package manager is installed and available in your PATH.'));
      }
    } else {
      log(chalk.red('\n❌ Error creating project:'), err);
    }
    process.exit(1);
  }
}

async function main() {
  printBanner();

  log(chalk.cyan('\n✨ Welcome to Errika! Let\'s set up your project.\n'));

  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: 'my-app',
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return 'Project name is required';
        }
        
        const trimmed = value.trim();
        
        // Allow '.' for current directory
        if (trimmed === '.') {
          return true;
        }
        
        // Additional validation: prevent reserved names
        const reservedNames = ['node_modules', '.git', '..'];
        if (reservedNames.includes(trimmed)) {
          return `"${trimmed}" is a reserved name and cannot be used`;
        }
        
        // Prevent names starting with dots (except single dot for current dir)
        if (trimmed.startsWith('.')) {
          return 'Project name cannot start with a dot';
        }
        
        // Validate characters - allow alphanumeric, hyphens, underscores, and dots
        if (!/^[a-zA-Z0-9-_.]+$/.test(trimmed) && trimmed !== '.') {
          return 'Project name can only contain letters, numbers, hyphens, underscores, and dots';
        }
        
        // Prevent consecutive dots (path traversal attempts)
        if (trimmed.includes('..')) {
          return 'Project name cannot contain consecutive dots';
        }
        
        return true;
      }
    },
    {
      type: 'select',
      name: 'packageManager',
      message: 'Which package manager do you want to use?',
      choices: [
        { title: 'pnpm (recommended)', value: 'pnpm' },
        { title: 'bun', value: 'bun' }
      ],
      initial: 0
    },
    {
      type: 'select',
      name: 'projectType',
      message: 'What type of frontend do you want?',
      choices: [
        { title: 'Next.js (SSR React Framework)', value: 'nextjs' },
        { title: 'React (Vite SPA)', value: 'react' },
        { title: 'React Native (Mobile)', value: 'react-native' }
      ],
      initial: 0
    }
  ], {
    onCancel: () => {
      log(chalk.red('\n❌ Operation cancelled.'));
      process.exit(0);
    }
  });

  // Additional validation after prompts (defense in depth)
  if (!response.projectName || !response.packageManager || !response.projectType) {
    log(chalk.red('\n❌ Error: Missing required information. Please provide all required fields.'));
    process.exit(1);
  }

  const options: ProjectOptions = {
    name: response.projectName.trim(),
    packageManager: response.packageManager,
    projectType: response.projectType
  };

  await createProject(options);
}

main().catch((err) => {
  log(chalk.red('❌ An error occurred:'), err);
  process.exit(1);
});
