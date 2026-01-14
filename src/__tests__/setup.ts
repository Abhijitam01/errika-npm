import { vi } from 'vitest';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Helper to create a temporary test directory
export async function createTempDir(prefix: string = 'errika-test-'): Promise<string> {
  const tmpDir = path.join(os.tmpdir(), `${prefix}${Date.now()}-${Math.random().toString(36).substring(7)}`);
  await fs.ensureDir(tmpDir);
  return tmpDir;
}

// Helper to clean up a test directory
export async function cleanupTempDir(dir: string): Promise<void> {
  if (await fs.pathExists(dir)) {
    await fs.remove(dir);
  }
}

// Helper to create a mock template directory
export async function createMockTemplate(templateName: string): Promise<string> {
  const tmpDir = await createTempDir(`errika-template-${templateName}-`);
  
  // Create basic template structure
  await fs.writeFile(path.join(tmpDir, 'package.json'), JSON.stringify({
    name: '{{projectName}}',
    version: '1.0.0',
    description: 'Mock template'
  }, null, 2));
  
  await fs.writeFile(path.join(tmpDir, 'README.md'), '# {{projectName}}\n\nMock template readme');
  await fs.writeFile(path.join(tmpDir, 'gitignore'), 'node_modules\ndist\n');
  
  return tmpDir;
}

