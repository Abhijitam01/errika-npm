import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseGenerator, GeneratorOptions, TemplateMetadata } from '../../../generators/baseGenerator';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir, createMockTemplate } from '../../setup';

vi.mock('child_process');
vi.mock('../../../utils/logger', () => ({
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
      fail: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    }))
  }
}));

// Create a concrete test implementation of BaseGenerator
class TestGenerator extends BaseGenerator {
  constructor(options: GeneratorOptions) {
    const metadata: TemplateMetadata = {
      id: 'test-template',
      name: 'Test Template',
      description: 'A test template',
      supportedPackageManagers: ['npm', 'yarn', 'pnpm']
    };
    super(options, metadata);
  }

  // Override templateDir for testing
  public setTemplateDir(dir: string) {
    this.templateDir = dir;
  }
}

describe('BaseGenerator', () => {
  let tempDir: string;
  let projectDir: string;
  let mockTemplateDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    projectDir = path.join(tempDir, 'test-project');
    mockTemplateDir = await createMockTemplate('test');
    vi.clearAllMocks();
    
    // Mock execSync to return success for most commands
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
    await cleanupTempDir(mockTemplateDir);
  });

  describe('constructor', () => {
    it('should initialize with correct options and metadata', () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new TestGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.id).toBe('test-template');
      expect(metadata.name).toBe('Test Template');
      expect(metadata.supportedPackageManagers).toContain('npm');
    });
  });

  describe('validate', () => {
    it('should validate package manager is installed', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await expect(generator.generate()).resolves.not.toThrow();

      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('npm'),
        expect.any(Object)
      );
    });

    it('should throw if package manager is not supported by template', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'bun' as any, // bun not in supportedPackageManagers
        installDependencies: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await expect(generator.generate()).rejects.toThrow('not supported');
    });

    it('should throw if package manager is not installed', async () => {
      vi.mocked(execSync).mockImplementation((cmd: any) => {
        if (cmd.includes('which') || cmd.includes('where')) {
          throw new Error('Command not found');
        }
        return Buffer.from('');
      });

      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await expect(generator.generate()).rejects.toThrow();
    });

    it('should validate path to prevent traversal attacks', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: '/etc/passwd',
        packageManager: 'npm',
        installDependencies: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await expect(generator.generate()).rejects.toThrow();
    });

    it('should create directory if it does not exist', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await generator.generate();

      expect(await fs.pathExists(projectDir)).toBe(true);
    });

    it('should throw if directory is not empty', async () => {
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'existing.txt'), 'content');

      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await expect(generator.generate()).rejects.toThrow('not empty');
    });
  });

  describe('copyTemplate', () => {
    it('should copy template files to target directory', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await generator.generate();

      expect(await fs.pathExists(path.join(projectDir, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'README.md'))).toBe(true);
    });

    it('should rename special files (gitignore)', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await generator.generate();

      expect(await fs.pathExists(path.join(projectDir, '.gitignore'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'gitignore'))).toBe(false);
    });

    it('should filter out node_modules and build artifacts', async () => {
      // Add node_modules to mock template
      await fs.ensureDir(path.join(mockTemplateDir, 'node_modules'));
      await fs.writeFile(path.join(mockTemplateDir, 'node_modules', 'package.json'), '{}');

      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await generator.generate();

      expect(await fs.pathExists(path.join(projectDir, 'node_modules'))).toBe(false);
    });
  });

  describe('processFiles', () => {
    it('should replace template variables in files', async () => {
      const options: GeneratorOptions = {
        projectName: 'my-awesome-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await generator.generate();

      const packageJson = await fs.readJSON(path.join(projectDir, 'package.json'));
      expect(packageJson.name).toBe('my-awesome-app');

      const readme = await fs.readFile(path.join(projectDir, 'README.md'), 'utf-8');
      expect(readme).toContain('my-awesome-app');
    });

    it('should handle custom template variables', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        templateVariables: {
          author: 'John Doe',
          description: 'A test project'
        },
        installDependencies: false,
        initGit: false
      };

      // Update mock template to use these variables
      await fs.writeFile(
        path.join(mockTemplateDir, 'info.txt'),
        'Author: {{author}}\nDescription: {{description}}'
      );

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await generator.generate();

      const info = await fs.readFile(path.join(projectDir, 'info.txt'), 'utf-8');
      expect(info).toContain('John Doe');
      expect(info).toContain('A test project');
    });
  });

  describe('installDependencies', () => {
    it('should install dependencies by default', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        initGit: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await generator.generate();

      const installCalls = vi.mocked(execSync).mock.calls.filter(
        call => call[0].toString().includes('install')
      );
      expect(installCalls.length).toBeGreaterThan(0);
    });

    it('should skip dependency installation when disabled', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await generator.generate();

      const installCalls = vi.mocked(execSync).mock.calls.filter(
        call => call[0].toString().includes('install')
      );
      expect(installCalls.length).toBe(0);
    });

    it('should use correct install command for each package manager', async () => {
      const packageManagers = ['npm', 'yarn', 'pnpm'] as const;

      for (const pm of packageManagers) {
        vi.clearAllMocks();
        const testDir = path.join(tempDir, `test-${pm}`);

        const options: GeneratorOptions = {
          projectName: 'test-app',
          targetDirectory: testDir,
          packageManager: pm,
          installDependencies: true,
          initGit: false
        };

        const generator = new TestGenerator(options);
        generator.setTemplateDir(mockTemplateDir);

        await generator.generate();

        const installCalls = vi.mocked(execSync).mock.calls.filter(
          call => call[0].toString().includes('install')
        );
        
        expect(installCalls.some(call => 
          call[0].toString().includes(pm)
        )).toBe(true);
      }
    });
  });

  describe('initGit', () => {
    it('should initialize git repository when requested', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: true
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await generator.generate();

      const gitCalls = vi.mocked(execSync).mock.calls.filter(
        call => call[0].toString().includes('git')
      );
      expect(gitCalls.length).toBeGreaterThan(0);
    });

    it('should skip git initialization when not requested', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      await generator.generate();

      const gitCalls = vi.mocked(execSync).mock.calls.filter(
        call => call[0].toString().includes('git init')
      );
      expect(gitCalls.length).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should handle copy failures gracefully', async () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir('/nonexistent/template');

      await expect(generator.generate()).rejects.toThrow();
    });

    it('should provide helpful error messages', async () => {
      vi.mocked(execSync).mockImplementation((cmd: any) => {
        if (cmd.includes('which') || cmd.includes('where')) {
          throw new Error('Command not found');
        }
        return Buffer.from('');
      });

      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false
      };

      const generator = new TestGenerator(options);
      generator.setTemplateDir(mockTemplateDir);

      try {
        await generator.generate();
      } catch (error: any) {
        expect(error.message).toContain('not installed');
      }
    });
  });

  describe('getMetadata', () => {
    it('should return correct metadata', () => {
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new TestGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata).toEqual({
        id: 'test-template',
        name: 'Test Template',
        description: 'A test template',
        supportedPackageManagers: ['npm', 'yarn', 'pnpm']
      });
    });
  });
});

