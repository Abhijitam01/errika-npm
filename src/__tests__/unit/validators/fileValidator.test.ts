import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { FileValidator } from '../../../validators/fileValidator';

describe('FileValidator', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'errika-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('validateRequiredFiles', () => {
    it('should pass when all required files exist', async () => {
      await fs.writeFile(path.join(tempDir, 'package.json'), '{}');
      await fs.writeFile(path.join(tempDir, 'README.md'), '# Test');

      const result = await FileValidator.validateRequiredFiles(tempDir, [
        { path: 'package.json', description: 'Package config' },
        { path: 'README.md', description: 'Readme' }
      ]);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when required files are missing', async () => {
      const result = await FileValidator.validateRequiredFiles(tempDir, [
        { path: 'package.json', description: 'Package config' },
        { path: 'README.md', description: 'Readme' }
      ]);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should warn when optional files are missing', async () => {
      await fs.writeFile(path.join(tempDir, 'package.json'), '{}');

      const result = await FileValidator.validateRequiredFiles(tempDir, [
        { path: 'package.json', description: 'Package config' },
        { path: 'README.md', description: 'Readme', optional: true }
      ]);

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('validateGitignore', () => {
    it('should pass when gitignore has essential entries', async () => {
      await fs.writeFile(
        path.join(tempDir, 'gitignore'),
        'node_modules/\n.env\n.env.local\n'
      );

      const result = await FileValidator.validateGitignore(tempDir);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when gitignore is missing', async () => {
      const result = await FileValidator.validateGitignore(tempDir);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('.gitignore file is missing');
    });

    it('should fail when essential entries are missing', async () => {
      await fs.writeFile(path.join(tempDir, 'gitignore'), '# Just comments\n');

      const result = await FileValidator.validateGitignore(tempDir);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('scanForSensitiveData', () => {
    it('should pass when no sensitive data is found', async () => {
      await fs.writeFile(
        path.join(tempDir, 'config.ts'),
        'export const API_KEY = "your_api_key_here";\n'
      );

      const result = await FileValidator.scanForSensitiveData(tempDir);

      expect(result.valid).toBe(true);
    });

    it('should fail when potential API keys are found', async () => {
      await fs.writeFile(
        path.join(tempDir, 'config.ts'),
        'export const API_KEY = "sk-1234567890abcdef1234567890abcdef";\n'
      );

      const result = await FileValidator.scanForSensitiveData(tempDir);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should ignore sensitive data in comments', async () => {
      await fs.writeFile(
        path.join(tempDir, 'config.ts'),
        '// Example: bearer sk-1234567890abcdef1234567890abcdef\nexport const test = true;\n'
      );

      const result = await FileValidator.scanForSensitiveData(tempDir);

      expect(result.valid).toBe(true);
    });

    it('should skip node_modules directory', async () => {
      const nodeModulesDir = path.join(tempDir, 'node_modules', 'some-package');
      await fs.ensureDir(nodeModulesDir);
      await fs.writeFile(
        path.join(nodeModulesDir, 'index.js'),
        'const secret = "sk-1234567890abcdef1234567890abcdef";\n'
      );

      const result = await FileValidator.scanForSensitiveData(tempDir);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateFileStructure', () => {
    it('should warn about missing common directories', async () => {
      const result = await FileValidator.validateFileStructure(tempDir);

      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.includes('Common directory not found: src'))).toBe(true);
    });

    it('should warn about empty directories', async () => {
      await fs.ensureDir(path.join(tempDir, 'src'));
      await fs.ensureDir(path.join(tempDir, 'src/empty-dir'));

      const result = await FileValidator.validateFileStructure(tempDir);

      expect(result.warnings.some(w => w.includes('Empty directory'))).toBe(true);
    });
  });
});

