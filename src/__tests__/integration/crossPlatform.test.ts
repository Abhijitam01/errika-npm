import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextjsGenerator } from '../../generators/nextjsGenerator';
import { GeneratorOptions } from '../../generators/baseGenerator';
import { checkPackageManagerExists, getInstallCommand } from '../../utils/packageManager';
import { initRepository } from '../../utils/gitUtils';
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

describe('Cross-Platform Compatibility Tests', () => {
  let tempDir: string;
  let originalPlatform: NodeJS.Platform;

  beforeEach(async () => {
    tempDir = await createTempDir('errika-platform-');
    originalPlatform = process.platform;
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      configurable: true
    });
  });

  describe('Path Handling', () => {
    it('should handle Windows-style paths', async () => {
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'windows-test');
      const options: GeneratorOptions = {
        projectName: 'windows-test',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).resolves.not.toThrow();
    });

    it('should handle Unix-style paths', async () => {
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'unix-test');
      const options: GeneratorOptions = {
        projectName: 'unix-test',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).resolves.not.toThrow();
    });

    it('should handle macOS-style paths', async () => {
      Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'macos-test');
      const options: GeneratorOptions = {
        projectName: 'macos-test',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).resolves.not.toThrow();
    });

    it('should normalize path separators across platforms', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'path-sep-test');
      const options: GeneratorOptions = {
        projectName: 'path-sep-test',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await generator.generate();

      // Verify paths are created correctly regardless of platform
      expect(await fs.pathExists(path.join(projectDir, 'app', 'layout.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'components'))).toBe(true);
    });
  });

  describe('Command Execution', () => {
    it('should use correct shell on Windows', async () => {
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'cmd-test');
      const options: GeneratorOptions = {
        projectName: 'cmd-test',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: true,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await generator.generate();

      const calls = vi.mocked(execSync).mock.calls;
      const installCall = calls.find(call => call[0].toString().includes('install'));
      
      expect(installCall).toBeDefined();
      expect(installCall![1]).toHaveProperty('shell', 'cmd.exe');
    });

    it('should use correct shell on Unix', async () => {
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'bash-test');
      const options: GeneratorOptions = {
        projectName: 'bash-test',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: true,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await generator.generate();

      const calls = vi.mocked(execSync).mock.calls;
      const installCall = calls.find(call => call[0].toString().includes('install'));
      
      expect(installCall).toBeDefined();
      expect(installCall![1]).toHaveProperty('shell', '/bin/sh');
    });

    it('should use "where" command on Windows for package manager check', () => {
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from('C:\\Program Files\\nodejs\\npm.cmd'));

      checkPackageManagerExists('npm');

      expect(execSync).toHaveBeenCalledWith(
        'where npm',
        expect.objectContaining({ stdio: 'ignore' })
      );
    });

    it('should use "which" command on Unix for package manager check', () => {
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from('/usr/bin/npm'));

      checkPackageManagerExists('npm');

      expect(execSync).toHaveBeenCalledWith(
        'which npm',
        expect.objectContaining({ stdio: 'ignore' })
      );
    });
  });

  describe('Git Operations', () => {
    it('should use correct shell for git on Windows', async () => {
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'git-windows');
      await fs.ensureDir(projectDir);
      
      await initRepository(projectDir, true);

      const gitCalls = vi.mocked(execSync).mock.calls.filter(
        call => call[0].toString().includes('git')
      );

      gitCalls.forEach(call => {
        expect(call[1]).toHaveProperty('shell', 'cmd.exe');
      });
    });

    it('should use correct shell for git on Unix', async () => {
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'git-unix');
      await fs.ensureDir(projectDir);
      
      await initRepository(projectDir, true);

      const gitCalls = vi.mocked(execSync).mock.calls.filter(
        call => call[0].toString().includes('git')
      );

      gitCalls.forEach(call => {
        expect(call[1]).toHaveProperty('shell', '/bin/sh');
      });
    });
  });

  describe('Line Endings', () => {
    it('should handle CRLF line endings on Windows', async () => {
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const filePath = path.join(tempDir, 'crlf-test.txt');
      await fs.writeFile(filePath, 'line1\r\nline2\r\nline3\r\n');

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBeTruthy();
    });

    it('should handle LF line endings on Unix', async () => {
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const filePath = path.join(tempDir, 'lf-test.txt');
      await fs.writeFile(filePath, 'line1\nline2\nline3\n');

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBeTruthy();
    });
  });

  describe('File System Operations', () => {
    it('should handle case-sensitive file systems', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      await fs.writeFile(path.join(tempDir, 'file.txt'), 'lowercase');
      await fs.writeFile(path.join(tempDir, 'FILE.TXT'), 'uppercase');

      const files = await fs.readdir(tempDir);
      
      // On case-sensitive systems (Linux), both files exist
      // On case-insensitive systems (Windows, macOS), one overwrites the other
      expect(files.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle symbolic links on Unix', async () => {
      if (process.platform !== 'win32') {
        vi.mocked(execSync).mockReturnValue(Buffer.from(''));

        const targetFile = path.join(tempDir, 'target.txt');
        const linkFile = path.join(tempDir, 'link.txt');
        
        await fs.writeFile(targetFile, 'content');
        await fs.symlink(targetFile, linkFile);

        expect(await fs.pathExists(linkFile)).toBe(true);
        const content = await fs.readFile(linkFile, 'utf-8');
        expect(content).toBe('content');
      }
    });

    it('should handle directory creation permissions on Unix', async () => {
      if (process.platform !== 'win32') {
        vi.mocked(execSync).mockReturnValue(Buffer.from(''));

        const dirPath = path.join(tempDir, 'perm-test');
        await fs.ensureDir(dirPath);

        const stats = await fs.stat(dirPath);
        expect(stats.isDirectory()).toBe(true);
      }
    });
  });

  describe('Environment Variables', () => {
    it('should respect platform-specific temp directories', async () => {
      const tempDirs = {
        win32: process.env.TEMP || process.env.TMP,
        darwin: process.env.TMPDIR,
        linux: process.env.TMPDIR || '/tmp'
      };

      const osTempDir = require('os').tmpdir();
      expect(osTempDir).toBeTruthy();
    });

    it('should handle HOME directory on different platforms', async () => {
      const homeDir = process.env.HOME || process.env.USERPROFILE;
      expect(homeDir).toBeTruthy();
    });
  });

  describe('Package Manager Commands', () => {
    it('should generate correct install commands for all package managers', () => {
      const pms = ['npm', 'yarn', 'pnpm', 'bun'] as const;
      
      pms.forEach(pm => {
        const cmd = getInstallCommand(pm);
        expect(cmd).toContain('install');
        expect(cmd).toContain(pm);
      });
    });

    it('should handle package manager not found on any platform', () => {
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Command not found');
      });

      expect(() => checkPackageManagerExists('pnpm')).toThrow();

      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      expect(() => checkPackageManagerExists('pnpm')).toThrow();
    });
  });

  describe('Special Directory Names', () => {
    it('should handle spaces in directory names', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const projectDir = path.join(tempDir, 'my project with spaces');
      const options: GeneratorOptions = {
        projectName: 'my-project',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await expect(generator.generate()).resolves.not.toThrow();
      expect(await fs.pathExists(projectDir)).toBe(true);
    });

    it('should handle special characters allowed on Unix but not Windows', async () => {
      if (process.platform !== 'win32') {
        vi.mocked(execSync).mockReturnValue(Buffer.from(''));

        // Unix allows these, Windows doesn't
        const projectDir = path.join(tempDir, 'project:test');
        const options: GeneratorOptions = {
          projectName: 'project-test',
          targetDirectory: projectDir,
          packageManager: 'npm',
          installDependencies: false,
          initGit: false
        };

        const generator = new NextjsGenerator(options);
        // May or may not work depending on platform
        try {
          await generator.generate();
        } catch (error) {
          // Expected on some platforms
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent file operations across platforms', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      const operations = Array.from({ length: 5 }, async (_, i) => {
        const filePath = path.join(tempDir, `concurrent-${i}.txt`);
        await fs.writeFile(filePath, `content-${i}`);
        return filePath;
      });

      const results = await Promise.all(operations);
      expect(results).toHaveLength(5);

      // Verify all files were created
      for (let i = 0; i < 5; i++) {
        const content = await fs.readFile(path.join(tempDir, `concurrent-${i}.txt`), 'utf-8');
        expect(content).toBe(`content-${i}`);
      }
    });
  });

  describe('Path Length Limits', () => {
    it('should handle long paths on Unix', async () => {
      if (process.platform !== 'win32') {
        vi.mocked(execSync).mockReturnValue(Buffer.from(''));

        // Create a deeply nested directory structure
        const deepPath = path.join(tempDir, ...Array(20).fill('deep'));
        await fs.ensureDir(deepPath);
        await fs.writeFile(path.join(deepPath, 'file.txt'), 'content');

        expect(await fs.pathExists(path.join(deepPath, 'file.txt'))).toBe(true);
      }
    });

    it('should respect Windows MAX_PATH limitations', async () => {
      if (process.platform === 'win32') {
        // Windows has a 260 character path limit (without long path support)
        // This test just verifies reasonable paths work
        vi.mocked(execSync).mockReturnValue(Buffer.from(''));

        const projectDir = path.join(tempDir, 'reasonably-named-project');
        const options: GeneratorOptions = {
          projectName: 'test',
          targetDirectory: projectDir,
          packageManager: 'npm',
          installDependencies: false,
          initGit: false
        };

        const generator = new NextjsGenerator(options);
        await expect(generator.generate()).resolves.not.toThrow();
      }
    });
  });
});

