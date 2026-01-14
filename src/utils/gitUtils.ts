import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { Logger } from './logger';

/**
 * Initialize a git repository in the specified directory
 */
export async function initRepository(directory: string, makeInitialCommit: boolean = true): Promise<void> {
  try {
    // Check if git is available
    try {
      execSync('git --version', { stdio: 'ignore' });
    } catch {
      Logger.warning('Git is not installed. Skipping git initialization.');
      return;
    }

    // Check if already a git repository
    const gitDir = path.join(directory, '.git');
    if (await fs.pathExists(gitDir)) {
      Logger.info('Git repository already initialized.');
      return;
    }

    // Initialize git
    execSync('git init', {
      cwd: directory,
      stdio: 'ignore',
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
    });

    if (makeInitialCommit) {
      execSync('git add -A', {
        cwd: directory,
        stdio: 'ignore',
        shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
      });

      execSync('git commit -m "Initial commit from Errika"', {
        cwd: directory,
        stdio: 'ignore',
        shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
      });
    }

    Logger.success('Git repository initialized');
  } catch (error) {
    Logger.warning('Failed to initialize git repository. You can initialize it manually later.');
  }
}

/**
 * Create a .gitignore file with common patterns
 */
export async function createGitignore(directory: string, additionalPatterns: string[] = []): Promise<void> {
  const defaultPatterns = [
    '# Dependencies',
    'node_modules/',
    '',
    '# Build outputs',
    'dist/',
    'build/',
    '.next/',
    'out/',
    '',
    '# Environment variables',
    '.env',
    '.env.local',
    '.env.*.local',
    '',
    '# IDE',
    '.vscode/',
    '.idea/',
    '*.swp',
    '*.swo',
    '*~',
    '.DS_Store',
    '',
    '# Testing',
    'coverage/',
    '.nyc_output/',
    '',
    '# Logs',
    '*.log',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    '',
    '# Misc',
    '.turbo/',
    '.cache/',
    'tmp/',
    'temp/',
  ];

  const patterns = [...defaultPatterns, ...additionalPatterns];
  const gitignorePath = path.join(directory, '.gitignore');
  
  await fs.writeFile(gitignorePath, patterns.join('\n'), 'utf-8');
}

