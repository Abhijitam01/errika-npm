import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  validatePath,
  copyDirectory,
  processTemplateFile,
  processTemplateDirectory,
  renameSpecialFiles,
  ensureEmptyDirectory,
  prepareDirectory
} from '../../../utils/fileUtils';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { createTempDir, cleanupTempDir } from '../../setup';

describe('fileUtils', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('validatePath', () => {
    it('should accept valid paths within base directory', () => {
      const basePath = '/home/user/projects';
      const validPaths = [
        '/home/user/projects/myapp',
        '/home/user/projects/subfolder/app',
        '/home/user/projects'
      ];

      validPaths.forEach(validPath => {
        expect(() => validatePath(validPath, basePath)).not.toThrow();
      });
    });

    it('should reject path traversal attempts', () => {
      const basePath = '/home/user/projects';
      const maliciousPaths = [
        '/home/user/other',
        '/etc/passwd',
        '/home/different/path'
      ];

      maliciousPaths.forEach(maliciousPath => {
        expect(() => validatePath(maliciousPath, basePath)).toThrow('Project path must be within the current directory');
      });
    });

    it('should handle relative paths correctly', () => {
      const basePath = process.cwd();
      expect(() => validatePath('./myapp', basePath)).not.toThrow();
      expect(() => validatePath('myapp', basePath)).not.toThrow();
    });

    it('should reject parent directory traversal', () => {
      const basePath = '/home/user/projects';
      expect(() => validatePath('/home/user', basePath)).toThrow();
    });
  });

  describe('copyDirectory', () => {
    let sourceDir: string;
    let destDir: string;

    beforeEach(async () => {
      sourceDir = path.join(tempDir, 'source');
      destDir = path.join(tempDir, 'dest');
      await fs.ensureDir(sourceDir);
    });

    it('should copy directory with all files', async () => {
      // Create test files
      await fs.writeFile(path.join(sourceDir, 'file1.txt'), 'content1');
      await fs.writeFile(path.join(sourceDir, 'file2.txt'), 'content2');
      await fs.ensureDir(path.join(sourceDir, 'subdir'));
      await fs.writeFile(path.join(sourceDir, 'subdir', 'file3.txt'), 'content3');

      await copyDirectory(sourceDir, destDir);

      expect(await fs.pathExists(path.join(destDir, 'file1.txt'))).toBe(true);
      expect(await fs.pathExists(path.join(destDir, 'file2.txt'))).toBe(true);
      expect(await fs.pathExists(path.join(destDir, 'subdir', 'file3.txt'))).toBe(true);
      
      const content = await fs.readFile(path.join(destDir, 'file1.txt'), 'utf-8');
      expect(content).toBe('content1');
    });

    it('should respect filter function', async () => {
      await fs.writeFile(path.join(sourceDir, 'include.txt'), 'include');
      await fs.writeFile(path.join(sourceDir, 'exclude.txt'), 'exclude');

      await copyDirectory(sourceDir, destDir, {
        filter: (src) => !src.includes('exclude')
      });

      expect(await fs.pathExists(path.join(destDir, 'include.txt'))).toBe(true);
      expect(await fs.pathExists(path.join(destDir, 'exclude.txt'))).toBe(false);
    });

    it('should filter out node_modules by default in common use case', async () => {
      const nodeModulesDir = path.join(sourceDir, 'node_modules');
      await fs.ensureDir(nodeModulesDir);
      await fs.writeFile(path.join(nodeModulesDir, 'package.json'), '{}');

      await copyDirectory(sourceDir, destDir, {
        filter: (src) => !src.includes('node_modules')
      });

      expect(await fs.pathExists(path.join(destDir, 'node_modules'))).toBe(false);
    });

    it('should overwrite existing files by default', async () => {
      await fs.writeFile(path.join(sourceDir, 'file.txt'), 'new content');
      await fs.ensureDir(destDir);
      await fs.writeFile(path.join(destDir, 'file.txt'), 'old content');

      await copyDirectory(sourceDir, destDir);

      const content = await fs.readFile(path.join(destDir, 'file.txt'), 'utf-8');
      expect(content).toBe('new content');
    });
  });

  describe('processTemplateFile', () => {
    it('should replace Handlebars variables', async () => {
      const filePath = path.join(tempDir, 'template.txt');
      await fs.writeFile(filePath, 'Hello {{name}}! Welcome to {{project}}.');

      await processTemplateFile(filePath, { name: 'John', project: 'Errika' });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Hello John! Welcome to Errika.');
    });

    it('should handle multiple occurrences of same variable', async () => {
      const filePath = path.join(tempDir, 'template.txt');
      await fs.writeFile(filePath, '{{name}} {{name}} {{name}}');

      await processTemplateFile(filePath, { name: 'Test' });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Test Test Test');
    });

    it('should handle nested objects in variables', async () => {
      const filePath = path.join(tempDir, 'template.txt');
      await fs.writeFile(filePath, 'Author: {{author.name}}, Email: {{author.email}}');

      await processTemplateFile(filePath, {
        author: { name: 'John Doe', email: 'john@example.com' }
      });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Author: John Doe, Email: john@example.com');
    });

    it('should handle files without variables', async () => {
      const filePath = path.join(tempDir, 'plain.txt');
      const originalContent = 'Plain text without variables';
      await fs.writeFile(filePath, originalContent);

      await processTemplateFile(filePath, { name: 'Test' });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe(originalContent);
    });

    it('should handle non-existent files gracefully', async () => {
      const filePath = path.join(tempDir, 'nonexistent.txt');
      await expect(processTemplateFile(filePath, {})).resolves.not.toThrow();
    });

    it('should handle empty variables object', async () => {
      const filePath = path.join(tempDir, 'template.txt');
      await fs.writeFile(filePath, 'No {{variables}} here');

      await processTemplateFile(filePath, {});

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('No  here'); // Handlebars replaces undefined with empty string
    });
  });

  describe('processTemplateDirectory', () => {
    it('should process all eligible files in directory', async () => {
      await fs.writeFile(path.join(tempDir, 'file1.json'), '{"name": "{{projectName}}"}');
      await fs.writeFile(path.join(tempDir, 'file2.md'), '# {{projectName}}');
      await fs.writeFile(path.join(tempDir, 'file3.ts'), 'const name = "{{projectName}}";');

      await processTemplateDirectory(tempDir, { projectName: 'MyApp' });

      const json = await fs.readFile(path.join(tempDir, 'file1.json'), 'utf-8');
      const md = await fs.readFile(path.join(tempDir, 'file2.md'), 'utf-8');
      const ts = await fs.readFile(path.join(tempDir, 'file3.ts'), 'utf-8');

      expect(json).toBe('{"name": "MyApp"}');
      expect(md).toBe('# MyApp');
      expect(ts).toBe('const name = "MyApp";');
    });

    it('should process files recursively', async () => {
      const subdir = path.join(tempDir, 'subdir');
      await fs.ensureDir(subdir);
      await fs.writeFile(path.join(subdir, 'nested.json'), '{"project": "{{name}}"}');

      await processTemplateDirectory(tempDir, { name: 'Test' });

      const content = await fs.readFile(path.join(subdir, 'nested.json'), 'utf-8');
      expect(content).toBe('{"project": "Test"}');
    });

    it('should only process specified file extensions', async () => {
      await fs.writeFile(path.join(tempDir, 'process.json'), '{"name": "{{name}}"}');
      await fs.writeFile(path.join(tempDir, 'ignore.txt'), 'Name: {{name}}');

      await processTemplateDirectory(tempDir, { name: 'Test' }, ['.json']);

      const jsonContent = await fs.readFile(path.join(tempDir, 'process.json'), 'utf-8');
      const txtContent = await fs.readFile(path.join(tempDir, 'ignore.txt'), 'utf-8');

      expect(jsonContent).toBe('{"name": "Test"}');
      expect(txtContent).toBe('Name: {{name}}'); // Not processed
    });

    it('should skip binary files and images', async () => {
      await fs.writeFile(path.join(tempDir, 'image.png'), Buffer.from([0x89, 0x50, 0x4E, 0x47]));
      await fs.writeFile(path.join(tempDir, 'text.json'), '{"name": "{{name}}"}');

      await processTemplateDirectory(tempDir, { name: 'Test' });

      // Binary file should remain unchanged
      const binary = await fs.readFile(path.join(tempDir, 'image.png'));
      expect(binary[0]).toBe(0x89);
    });
  });

  describe('renameSpecialFiles', () => {
    it('should rename gitignore to .gitignore', async () => {
      await fs.writeFile(path.join(tempDir, 'gitignore'), 'node_modules\n');

      await renameSpecialFiles(tempDir);

      expect(await fs.pathExists(path.join(tempDir, '.gitignore'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'gitignore'))).toBe(false);
    });

    it('should rename npmrc to .npmrc', async () => {
      await fs.writeFile(path.join(tempDir, 'npmrc'), 'registry=https://registry.npmjs.org/');

      await renameSpecialFiles(tempDir);

      expect(await fs.pathExists(path.join(tempDir, '.npmrc'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'npmrc'))).toBe(false);
    });

    it('should rename env.example to .env.example', async () => {
      await fs.writeFile(path.join(tempDir, 'env.example'), 'API_KEY=xxx');

      await renameSpecialFiles(tempDir);

      expect(await fs.pathExists(path.join(tempDir, '.env.example'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'env.example'))).toBe(false);
    });

    it('should handle missing files gracefully', async () => {
      await expect(renameSpecialFiles(tempDir)).resolves.not.toThrow();
    });

    it('should rename multiple files in one call', async () => {
      await fs.writeFile(path.join(tempDir, 'gitignore'), '');
      await fs.writeFile(path.join(tempDir, 'npmrc'), '');
      await fs.writeFile(path.join(tempDir, 'env.example'), '');

      await renameSpecialFiles(tempDir);

      expect(await fs.pathExists(path.join(tempDir, '.gitignore'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, '.npmrc'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, '.env.example'))).toBe(true);
    });
  });

  describe('ensureEmptyDirectory', () => {
    it('should create directory if it does not exist', async () => {
      const newDir = path.join(tempDir, 'newdir');

      await ensureEmptyDirectory(newDir);

      expect(await fs.pathExists(newDir)).toBe(true);
    });

    it('should pass if directory exists and is empty', async () => {
      const emptyDir = path.join(tempDir, 'empty');
      await fs.ensureDir(emptyDir);

      await expect(ensureEmptyDirectory(emptyDir)).resolves.not.toThrow();
    });

    it('should throw if directory exists and is not empty', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'content');

      await expect(ensureEmptyDirectory(tempDir)).rejects.toThrow('not empty');
    });
  });

  describe('prepareDirectory', () => {
    it('should create directory if it does not exist', async () => {
      const newDir = path.join(tempDir, 'prepare-test');

      await prepareDirectory(newDir);

      expect(await fs.pathExists(newDir)).toBe(true);
    });

    it('should throw if directory is not empty by default', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'content');

      await expect(prepareDirectory(tempDir)).rejects.toThrow('not empty');
    });

    it('should allow non-empty directory when allowNonEmpty is true', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'content');

      await expect(prepareDirectory(tempDir, true)).resolves.not.toThrow();
    });

    it('should pass if directory exists and is empty', async () => {
      const emptyDir = path.join(tempDir, 'empty');
      await fs.ensureDir(emptyDir);

      await expect(prepareDirectory(emptyDir)).resolves.not.toThrow();
    });
  });
});

