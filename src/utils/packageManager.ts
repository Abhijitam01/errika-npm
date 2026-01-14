import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

/**
 * Validate that package manager is in the allowed list (defense in depth)
 * Preserves security validation from original implementation
 */
export function validatePackageManager(pm: string): asserts pm is PackageManager {
  const allowedPMs: PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];
  if (!allowedPMs.includes(pm as PackageManager)) {
    throw new Error(`Invalid package manager: ${pm}. Allowed values: ${allowedPMs.join(', ')}`);
  }
}

/**
 * Check if a package manager is installed and available
 * Preserves security check from original implementation
 */
export function checkPackageManagerExists(packageManager: PackageManager): void {
  try {
    // Use 'which' on Unix-like systems, 'where' on Windows
    const checkCommand = process.platform === 'win32' ? 'where' : 'which';
    execSync(`${checkCommand} ${packageManager}`, { 
      stdio: 'ignore',
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
    });
  } catch {
    const installInstructions: Record<PackageManager, string> = {
      npm: 'npm is included with Node.js. Visit https://nodejs.org',
      yarn: 'npm install -g yarn',
      pnpm: 'npm install -g pnpm',
      bun: 'Visit https://bun.sh for installation instructions'
    };

    throw new Error(
      `${packageManager} is not installed or not available in PATH.\n` +
      `Please install ${packageManager} first:\n  ${installInstructions[packageManager]}`
    );
  }
}

/**
 * Detect package manager from lockfiles in the current directory
 */
export function detectPackageManager(directory: string): PackageManager | null {
  const lockfiles: Record<string, PackageManager> = {
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
    'bun.lockb': 'bun'
  };

  for (const [lockfile, pm] of Object.entries(lockfiles)) {
    if (fs.existsSync(path.join(directory, lockfile))) {
      return pm;
    }
  }

  return null;
}

/**
 * Get the appropriate install command for a package manager
 */
export function getInstallCommand(packageManager: PackageManager): string {
  return `${packageManager} install`;
}

/**
 * Get the appropriate run command for a package manager
 */
export function getRunCommand(packageManager: PackageManager, script: string): string {
  if (packageManager === 'npm') {
    return `npm run ${script}`;
  }
  return `${packageManager} ${script}`;
}

