import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextjsGenerator } from '../../generators/nextjsGenerator';
import { ExpressReactGenerator } from '../../generators/expressReactGenerator';
import { GeneratorOptions } from '../../generators/baseGenerator';
import { processTemplateFile, processTemplateDirectory } from '../../utils/fileUtils';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir } from '../setup';

vi.mock('child_process');
vi.mock('../../utils/logger', () => ({
  Logger: {
    bold: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
    gray: vi.fn(),
    cyan: vi.fn(),
    blueBright: vi.fn(),
    newLine: vi.fn(),
    spinner: vi.fn(() => ({
      succeed: vi.fn(),
      fail: vi.fn()
    }))
  }
}));

describe('Placeholder Replacement Tests', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('errika-placeholder-');
    vi.clearAllMocks();
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('Basic Placeholder Replacement', () => {
    it('should replace {{projectName}} in files', async () => {
      const filePath = path.join(tempDir, 'test.json');
      await fs.writeFile(filePath, JSON.stringify({ name: '{{projectName}}' }));

      await processTemplateFile(filePath, { projectName: 'my-app' });

      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.name).toBe('my-app');
    });

    it('should replace multiple occurrences of the same placeholder', async () => {
      const filePath = path.join(tempDir, 'test.md');
      await fs.writeFile(filePath, '# {{projectName}}\n\nWelcome to {{projectName}}!');

      await processTemplateFile(filePath, { projectName: 'awesome-app' });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('# awesome-app\n\nWelcome to awesome-app!');
    });

    it('should replace placeholders in multiple files', async () => {
      await fs.writeFile(path.join(tempDir, 'file1.json'), '{"name": "{{projectName}}"}');
      await fs.writeFile(path.join(tempDir, 'file2.md'), '# {{projectName}}');
      await fs.writeFile(path.join(tempDir, 'file3.ts'), 'const name = "{{projectName}}";');

      await processTemplateDirectory(tempDir, { projectName: 'multi-file-app' });

      const json = JSON.parse(await fs.readFile(path.join(tempDir, 'file1.json'), 'utf-8'));
      const md = await fs.readFile(path.join(tempDir, 'file2.md'), 'utf-8');
      const ts = await fs.readFile(path.join(tempDir, 'file3.ts'), 'utf-8');

      expect(json.name).toBe('multi-file-app');
      expect(md).toContain('multi-file-app');
      expect(ts).toContain('multi-file-app');
    });
  });

  describe('Nested Placeholder Replacement', () => {
    it('should replace placeholders in nested directories', async () => {
      const subdir = path.join(tempDir, 'src', 'components');
      await fs.ensureDir(subdir);
      await fs.writeFile(path.join(subdir, 'component.tsx'), 'export const {{projectName}}Component = () => {};');

      await processTemplateDirectory(tempDir, { projectName: 'MyApp' });

      const content = await fs.readFile(path.join(subdir, 'component.tsx'), 'utf-8');
      expect(content).toContain('MyAppComponent');
    });

    it('should handle deeply nested directory structures', async () => {
      const deepPath = path.join(tempDir, 'a', 'b', 'c', 'd', 'e');
      await fs.ensureDir(deepPath);
      await fs.writeFile(path.join(deepPath, 'deep.json'), '{"name": "{{projectName}}"}');

      await processTemplateDirectory(tempDir, { projectName: 'deep-app' });

      const content = JSON.parse(await fs.readFile(path.join(deepPath, 'deep.json'), 'utf-8'));
      expect(content.name).toBe('deep-app');
    });
  });

  describe('Complex Template Variables', () => {
    it('should handle nested object variables', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'Author: {{author.name}}, Email: {{author.email}}');

      await processTemplateFile(filePath, {
        author: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Author: John Doe, Email: john@example.com');
    });

    it('should handle array variables with Handlebars helpers', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, '{{#each items}}{{this}}\n{{/each}}');

      await processTemplateFile(filePath, {
        items: ['Item 1', 'Item 2', 'Item 3']
      });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('Item 1');
      expect(content).toContain('Item 2');
      expect(content).toContain('Item 3');
    });

    it('should handle conditional variables', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, '{{#if isPublic}}Public{{else}}Private{{/if}}');

      await processTemplateFile(filePath, { isPublic: true });
      let content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Public');

      await fs.writeFile(filePath, '{{#if isPublic}}Public{{else}}Private{{/if}}');
      await processTemplateFile(filePath, { isPublic: false });
      content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Private');
    });
  });

  describe('Special Characters in Replacements', () => {
    it('should handle project names with hyphens', async () => {
      const filePath = path.join(tempDir, 'package.json');
      await fs.writeFile(filePath, '{"name": "{{projectName}}"}');

      await processTemplateFile(filePath, { projectName: 'my-awesome-app' });

      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      expect(content.name).toBe('my-awesome-app');
    });

    it('should handle project names with underscores', async () => {
      const filePath = path.join(tempDir, 'package.json');
      await fs.writeFile(filePath, '{"name": "{{projectName}}"}');

      await processTemplateFile(filePath, { projectName: 'my_awesome_app' });

      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      expect(content.name).toBe('my_awesome_app');
    });

    it('should handle project names with numbers', async () => {
      const filePath = path.join(tempDir, 'package.json');
      await fs.writeFile(filePath, '{"name": "{{projectName}}"}');

      await processTemplateFile(filePath, { projectName: 'app123' });

      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      expect(content.name).toBe('app123');
    });

    it('should handle project names with mixed case', async () => {
      const filePath = path.join(tempDir, 'package.json');
      await fs.writeFile(filePath, '{"name": "{{projectName}}"}');

      await processTemplateFile(filePath, { projectName: 'MyAwesomeApp' });

      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      expect(content.name).toBe('MyAwesomeApp');
    });
  });

  describe('File Extension Filtering', () => {
    it('should only process specified file extensions', async () => {
      await fs.writeFile(path.join(tempDir, 'process.json'), '{"name": "{{projectName}}"}');
      await fs.writeFile(path.join(tempDir, 'ignore.txt'), 'Name: {{projectName}}');
      await fs.writeFile(path.join(tempDir, 'binary.bin'), 'Name: {{projectName}}');

      await processTemplateDirectory(tempDir, { projectName: 'test-app' }, ['.json']);

      const json = JSON.parse(await fs.readFile(path.join(tempDir, 'process.json'), 'utf-8'));
      const txt = await fs.readFile(path.join(tempDir, 'ignore.txt'), 'utf-8');
      const bin = await fs.readFile(path.join(tempDir, 'binary.bin'), 'utf-8');

      expect(json.name).toBe('test-app');
      expect(txt).toBe('Name: {{projectName}}'); // Not processed
      expect(bin).toBe('Name: {{projectName}}'); // Not processed
    });

    it('should process common development file extensions', async () => {
      const extensions = ['.json', '.ts', '.tsx', '.js', '.jsx', '.md', '.html', '.css'];
      
      for (const ext of extensions) {
        const fileName = `file${ext}`;
        const content = ext === '.json' ? '{"name": "{{projectName}}"}' : '{{projectName}}';
        await fs.writeFile(path.join(tempDir, fileName), content);
      }

      await processTemplateDirectory(tempDir, { projectName: 'test-app' });

      for (const ext of extensions) {
        const fileName = `file${ext}`;
        const content = await fs.readFile(path.join(tempDir, fileName), 'utf-8');
        expect(content).toContain('test-app');
      }
    });
  });

  describe('Integration with Generators', () => {
    it('should replace projectName in Next.js generator', async () => {
      const projectDir = path.join(tempDir, 'nextjs-replace-test');
      const options: GeneratorOptions = {
        projectName: 'nextjs-replacement-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await generator.generate();

      const packageJson = await fs.readJSON(path.join(projectDir, 'package.json'));
      expect(packageJson.name).toBe('nextjs-replacement-app');
    });

    it('should replace projectName in Express + React generator', async () => {
      const projectDir = path.join(tempDir, 'express-react-replace-test');
      const options: GeneratorOptions = {
        projectName: 'express-react-replacement',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        installDependencies: false,
        initGit: false
      };

      const generator = new ExpressReactGenerator(options);
      await generator.generate();

      const rootPackageJson = await fs.readJSON(path.join(projectDir, 'package.json'));
      expect(rootPackageJson.name).toBe('express-react-replacement');
    });

    it('should handle custom template variables', async () => {
      const projectDir = path.join(tempDir, 'custom-vars-test');
      
      // Create a custom template file
      await fs.ensureDir(projectDir);
      await fs.writeFile(
        path.join(projectDir, 'custom.txt'),
        'Project: {{projectName}}\nAuthor: {{author}}\nVersion: {{version}}'
      );

      await processTemplateDirectory(projectDir, {
        projectName: 'my-app',
        author: 'John Doe',
        version: '1.0.0'
      });

      const content = await fs.readFile(path.join(projectDir, 'custom.txt'), 'utf-8');
      expect(content).toContain('Project: my-app');
      expect(content).toContain('Author: John Doe');
      expect(content).toContain('Version: 1.0.0');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, '{{projectName}}');

      await processTemplateFile(filePath, { projectName: '' });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('');
    });

    it('should handle files without placeholders', async () => {
      const filePath = path.join(tempDir, 'plain.txt');
      const originalContent = 'Plain text without placeholders';
      await fs.writeFile(filePath, originalContent);

      await processTemplateFile(filePath, { projectName: 'test-app' });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe(originalContent);
    });

    it('should handle files with only whitespace placeholders', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, '{{   projectName   }}');

      await processTemplateFile(filePath, { projectName: 'test-app' });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content.trim()).toBeTruthy();
    });

    it('should preserve file structure and permissions', async () => {
      const subdir = path.join(tempDir, 'subdir');
      await fs.ensureDir(subdir);
      await fs.writeFile(path.join(subdir, 'file.json'), '{"name": "{{projectName}}"}');

      await processTemplateDirectory(tempDir, { projectName: 'test-app' });

      expect(await fs.pathExists(path.join(subdir, 'file.json'))).toBe(true);
      const content = JSON.parse(await fs.readFile(path.join(subdir, 'file.json'), 'utf-8'));
      expect(content.name).toBe('test-app');
    });

    it('should handle very long project names', async () => {
      const longName = 'a'.repeat(200);
      const filePath = path.join(tempDir, 'test.json');
      await fs.writeFile(filePath, '{"name": "{{projectName}}"}');

      await processTemplateFile(filePath, { projectName: longName });

      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      expect(content.name).toBe(longName);
    });
  });

  describe('Unicode and International Characters', () => {
    it('should handle Unicode characters in values', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'Project: {{projectName}}');

      await processTemplateFile(filePath, { projectName: '我的应用' });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('我的应用');
    });

    it('should handle emoji in values', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'Project: {{projectName}}');

      await processTemplateFile(filePath, { projectName: '🚀 rocket-app' });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('🚀 rocket-app');
    });

    it('should handle accented characters', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'Project: {{projectName}}');

      await processTemplateFile(filePath, { projectName: 'café-münchën' });

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('café-münchën');
    });
  });
});

