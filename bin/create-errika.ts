#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import figlet from 'figlet';

const log = console.log;

function printBanner() {
  log(
    chalk.cyan(
      figlet.textSync('Errika', { horizontalLayout: 'default' })
    )
  );
}

async function createProject(projectName: string) {
  const cwd = process.cwd();
  const isCurrentDir = projectName === '.' || projectName === './';
  const targetDir = isCurrentDir ? cwd : path.join(cwd, projectName);
  const templateDir = path.join(__dirname, '..', 'template');

  printBanner();

  log(chalk.bold(`\n🚀 Creating project in "${isCurrentDir ? '.' : projectName}"...`));

  try {
    if (!isCurrentDir && !fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }

    if (fs.readdirSync(targetDir).length > 0) {
      log(chalk.red(`❌ Directory "${targetDir}" is not empty.`));
      process.exit(1);
    }

    // Copy contents of template folder, not the folder itself
    const files = await fs.readdir(templateDir);
    for (const file of files) {
      await fs.copy(path.join(templateDir, file), path.join(targetDir, file), {
        overwrite: true,
        errorOnExist: false,
      });
    }

    log(chalk.green('📦 Template copied successfully.'));

    // Install dependencies
    log(chalk.blueBright('\n📥 Installing dependencies using pnpm...'));
    execSync('pnpm install', {
      cwd: targetDir,
      stdio: 'inherit',
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
    });

    log(chalk.green('\n✅ Project setup complete! Happy hacking!'));
  } catch (err) {
    log(chalk.red('❌ Error creating project:'), err);
    process.exit(1);
  }
}

// Parse CLI args
const [,, projectName] = process.argv;

if (!projectName) {
  log(chalk.red('❌ Please provide a project name or "." for current folder.'));
  log(chalk.gray('Example: npx create-errika my-app'));
  log(chalk.gray('         npx create-errika .'));
  process.exit(1);
}

createProject(projectName);
