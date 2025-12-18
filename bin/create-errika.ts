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

async function createProject(options: ProjectOptions) {
  const { name: projectName, packageManager, projectType } = options;
  const cwd = process.cwd();
  const isCurrentDir = projectName === '.' || projectName === './';
  const targetDir = isCurrentDir ? cwd : path.join(cwd, projectName);
  const templateDir = path.join(__dirname, '..', 'template');

  log(chalk.bold(`\n🚀 Creating project in "${isCurrentDir ? '.' : projectName}"...`));

  try {
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
    log(chalk.red('❌ Error creating project:'), err);
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
        if (!/^[a-zA-Z0-9-_.]+$/.test(value) && value !== '.') {
          return 'Project name can only contain letters, numbers, hyphens, underscores, and dots';
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

  const options: ProjectOptions = {
    name: response.projectName,
    packageManager: response.packageManager,
    projectType: response.projectType
  };

  await createProject(options);
}

main().catch((err) => {
  log(chalk.red('❌ An error occurred:'), err);
  process.exit(1);
});
