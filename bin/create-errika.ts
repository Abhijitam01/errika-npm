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
  const targetDir = path.join(cwd, projectName);
  const templateDir = path.join(__dirname, '..', 'template');

  printBanner();

  log(chalk.bold(`\n🚀 Creating project "${projectName}"...`));

  try {
    // Step 1: Copy template
    await fs.copy(templateDir, targetDir);
    log(chalk.green('📦 Template copied successfully.'));

    // Step 2: Install deps
    log(chalk.blueBright('\n📥 Installing dependencies using pnpm...'));
    execSync('pnpm install', {
      cwd: targetDir,
      stdio: 'inherit',
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh', // 🪄 cross-platform compatibility
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
  log(chalk.red('❌ Please provide a project name.'));
  log(chalk.gray('Example: npx create-errika my-app'));
  process.exit(1);
}

createProject(projectName);
