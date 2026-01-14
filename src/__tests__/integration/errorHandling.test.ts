import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextjsGenerator } from '../../generators/nextjsGenerator';
import { TurborepoGenerator, TurborepoOptions } from '../../generators/turborepoGenerator';
import { GeneratorOptions } from '../../generators/baseGenerator';
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

describe('Error Handling and Edge Cases', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('errika-error-test-');
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('Directory Validation', () => {
    it('should throw error when target directory is not empty', async () => {
      const projectDir = path.join(tempDir, 'nonempty');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'existing.txt'), 'content');

      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).rejects.toThrow('not empty');
    });

    it('should handle path traversal attempts', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: '/etc/passwd',
        packageManager: 'npm',
        installDependencies: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).rejects.toThrow();
    });

    it('should handle relative path traversal attempts', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const options: GeneratorOptions = {
        projectName: '../../../etc/passwd',
        targetDirectory: path.join(process.cwd(), '../../../etc/passwd'),
        packageManager: 'npm',
        installDependencies: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).rejects.toThrow();
    });
  });

  describe('Package Manager Validation', () => {
    it('should throw error when package manager is not installed', async () => {
      vi.mocked(execSync).mockImplementation((cmd: any) => {
        if (cmd.includes('which') || cmd.includes('where')) {
          throw new Error('Command not found');
        }
        return Buffer.from('');
      });

      const projectDir = path.join(tempDir, 'test-app');
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).rejects.toThrow();
    });

    it('should throw error when package manager is not supported by template', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'test-app');
      const options: TurborepoOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm' as any, // npm not supported by Turborepo
        frontendType: 'nextjs',
        installDependencies: false
      };

      const generator = new TurborepoGenerator(options);
      await expect(generator.generate()).rejects.toThrow('not supported');
    });

    it('should provide helpful error message with supported package managers', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'test-app');
      const options: TurborepoOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'yarn' as any,
        frontendType: 'nextjs',
        installDependencies: false
      };

      const generator = new TurborepoGenerator(options);
      
      try {
        await generator.generate();
      } catch (error: any) {
        expect(error.message).toContain('pnpm');
        expect(error.message).toContain('bun');
      }
    });
  });

  describe('Dependency Installation Failures', () => {
    it('should throw error when dependency installation fails', async () => {
      vi.mocked(execSync).mockImplementation((cmd: any) => {
        if (cmd.includes('install')) {
          throw new Error('Installation failed: Network error');
        }
        return Buffer.from('');
      });

      const projectDir = path.join(tempDir, 'test-app');
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: true,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).rejects.toThrow();
    });
  });

  describe('Git Initialization Failures', () => {
    it('should continue gracefully when git is not installed', async () => {
      vi.mocked(execSync).mockImplementation((cmd: any) => {
        if (cmd.includes('git')) {
          throw new Error('git not found');
        }
        return Buffer.from('');
      });

      const projectDir = path.join(tempDir, 'test-app');
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: true
      };

      const generator = new NextjsGenerator(options);
      // Should not throw, just warn
      await expect(generator.generate()).resolves.not.toThrow();
    });

    it('should handle git init failures gracefully', async () => {
      vi.mocked(execSync).mockImplementation((cmd: any) => {
        if (cmd.includes('git init')) {
          throw new Error('Permission denied');
        }
        if (cmd.includes('git --version')) {
          return Buffer.from('git version 2.0.0');
        }
        return Buffer.from('');
      });

      const projectDir = path.join(tempDir, 'test-app');
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: true
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).resolves.not.toThrow();
    });
  });

  describe('Template File Issues', () => {
    it('should handle missing template directory', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'test-app');
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      // Override template directory to nonexistent path
      (generator as any).templateDir = '/nonexistent/template/path';

      await expect(generator.generate()).rejects.toThrow();
    });
  });

  describe('Special Character Handling', () => {
    it('should handle project names with hyphens', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'my-awesome-app');
      const options: GeneratorOptions = {
        projectName: 'my-awesome-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).resolves.not.toThrow();
    });

    it('should handle project names with underscores', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'my_awesome_app');
      const options: GeneratorOptions = {
        projectName: 'my_awesome_app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).resolves.not.toThrow();
    });

    it('should handle project names with numbers', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'app123');
      const options: GeneratorOptions = {
        projectName: 'app123',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).resolves.not.toThrow();
    });
  });

  describe('Current Directory Edge Cases', () => {
    it('should handle generation in current directory', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'current-dir-test');
      await fs.ensureDir(projectDir);

      const options: GeneratorOptions = {
        projectName: '.',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).resolves.not.toThrow();
    });
  });

  describe('Permission Issues', () => {
    it('should handle write permission errors gracefully', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      // Try to write to a read-only location (this test may behave differently on different systems)
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: '/root/test-app', // Typically requires root access
        packageManager: 'npm',
        installDependencies: false
      };

      const generator = new NextjsGenerator(options);
      
      // Should throw some kind of error (permission or validation)
      await expect(generator.generate()).rejects.toThrow();
    });
  });

  describe('Disk Space Issues', () => {
    it('should throw meaningful error on file system errors', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'test-app');
      const options: GeneratorOptions = {
        projectName: 'test-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      // Mock fs to throw ENOSPC error
      const originalCopy = fs.copy;
      vi.spyOn(fs, 'copy').mockRejectedValueOnce(
        Object.assign(new Error('ENOSPC: no space left on device'), { code: 'ENOSPC' })
      );

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).rejects.toThrow();

      fs.copy = originalCopy;
    });
  });

  describe('Concurrent Generation Attempts', () => {
    it('should handle multiple generators running in parallel', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const generators = Array.from({ length: 3 }, (_, i) => {
        const projectDir = path.join(tempDir, `parallel-${i}`);
        const options: GeneratorOptions = {
          projectName: `parallel-${i}`,
          targetDirectory: projectDir,
          packageManager: 'npm',
          installDependencies: false,
          initGit: false
        };
        return new NextjsGenerator(options);
      });

      await expect(Promise.all(generators.map(g => g.generate()))).resolves.not.toThrow();

      // Verify all were created
      for (let i = 0; i < 3; i++) {
        const projectDir = path.join(tempDir, `parallel-${i}`);
        expect(await fs.pathExists(path.join(projectDir, 'package.json'))).toBe(true);
      }
    });
  });
});

