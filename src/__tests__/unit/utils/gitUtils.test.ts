import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initRepository, createGitignore } from '../../../utils/gitUtils';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir } from '../../setup';

vi.mock('child_process');
vi.mock('../../../utils/logger', () => ({
  Logger: {
    warning: vi.fn(),
    info: vi.fn(),
    success: vi.fn()
  }
}));

describe('gitUtils', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('initRepository', () => {
    it('should initialize git repository successfully', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      await initRepository(tempDir, false);

      expect(execSync).toHaveBeenCalledWith(
        'git --version',
        expect.objectContaining({ stdio: 'ignore' })
      );
      expect(execSync).toHaveBeenCalledWith(
        'git init',
        expect.objectContaining({ cwd: tempDir })
      );
    });

    it('should make initial commit when requested', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      await initRepository(tempDir, true);

      expect(execSync).toHaveBeenCalledWith(
        'git add -A',
        expect.objectContaining({ cwd: tempDir })
      );
      expect(execSync).toHaveBeenCalledWith(
        'git commit -m "Initial commit from Errika"',
        expect.objectContaining({ cwd: tempDir })
      );
    });

    it('should not make initial commit when not requested', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));

      await initRepository(tempDir, false);

      const calls = vi.mocked(execSync).mock.calls;
      const hasAddCall = calls.some(call => call[0].includes('git add'));
      const hasCommitCall = calls.some(call => call[0].includes('git commit'));

      expect(hasAddCall).toBe(false);
      expect(hasCommitCall).toBe(false);
    });

    it('should handle git not being installed', async () => {
      vi.mocked(execSync).mockImplementation((cmd: any) => {
        if (cmd.includes('--version')) {
          throw new Error('git not found');
        }
        return Buffer.from('');
      });

      await expect(initRepository(tempDir)).resolves.not.toThrow();
    });

    it('should skip if git directory already exists', async () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));
      await fs.ensureDir(path.join(tempDir, '.git'));

      await initRepository(tempDir);

      const calls = vi.mocked(execSync).mock.calls;
      const hasInitCall = calls.some(call => call[0].includes('git init'));

      expect(hasInitCall).toBe(false);
    });

    it('should use correct shell for platform', async () => {
      const originalPlatform = process.platform;
      
      // Test Windows
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));
      
      await initRepository(tempDir);
      
      expect(execSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ shell: 'cmd.exe' })
      );

      // Test Unix
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      vi.clearAllMocks();
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));
      
      await initRepository(tempDir);
      
      expect(execSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ shell: '/bin/sh' })
      );

      Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
    });

    it('should handle git init failures gracefully', async () => {
      vi.mocked(execSync).mockImplementation((cmd: any) => {
        if (cmd.includes('git init')) {
          throw new Error('Permission denied');
        }
        return Buffer.from('');
      });

      await expect(initRepository(tempDir)).resolves.not.toThrow();
    });
  });

  describe('createGitignore', () => {
    it('should create .gitignore with default patterns', async () => {
      await createGitignore(tempDir);

      const gitignorePath = path.join(tempDir, '.gitignore');
      expect(await fs.pathExists(gitignorePath)).toBe(true);

      const content = await fs.readFile(gitignorePath, 'utf-8');
      expect(content).toContain('node_modules/');
      expect(content).toContain('dist/');
      expect(content).toContain('.env');
      expect(content).toContain('*.log');
      expect(content).toContain('.turbo/');
    });

    it('should include additional patterns', async () => {
      const additionalPatterns = ['custom-dir/', '*.custom'];

      await createGitignore(tempDir, additionalPatterns);

      const content = await fs.readFile(path.join(tempDir, '.gitignore'), 'utf-8');
      expect(content).toContain('custom-dir/');
      expect(content).toContain('*.custom');
    });

    it('should contain all major ignore categories', async () => {
      await createGitignore(tempDir);

      const content = await fs.readFile(path.join(tempDir, '.gitignore'), 'utf-8');
      
      // Check for categories
      expect(content).toContain('# Dependencies');
      expect(content).toContain('# Build outputs');
      expect(content).toContain('# Environment variables');
      expect(content).toContain('# IDE');
      expect(content).toContain('# Testing');
      expect(content).toContain('# Logs');
    });

    it('should ignore common build outputs', async () => {
      await createGitignore(tempDir);

      const content = await fs.readFile(path.join(tempDir, '.gitignore'), 'utf-8');
      expect(content).toContain('.next/');
      expect(content).toContain('build/');
      expect(content).toContain('out/');
    });

    it('should ignore environment files', async () => {
      await createGitignore(tempDir);

      const content = await fs.readFile(path.join(tempDir, '.gitignore'), 'utf-8');
      expect(content).toContain('.env');
      expect(content).toContain('.env.local');
      expect(content).toContain('.env.*.local');
    });

    it('should ignore IDE files', async () => {
      await createGitignore(tempDir);

      const content = await fs.readFile(path.join(tempDir, '.gitignore'), 'utf-8');
      expect(content).toContain('.vscode/');
      expect(content).toContain('.idea/');
      expect(content).toContain('.DS_Store');
    });

    it('should ignore testing artifacts', async () => {
      await createGitignore(tempDir);

      const content = await fs.readFile(path.join(tempDir, '.gitignore'), 'utf-8');
      expect(content).toContain('coverage/');
      expect(content).toContain('.nyc_output/');
    });

    it('should overwrite existing .gitignore', async () => {
      const gitignorePath = path.join(tempDir, '.gitignore');
      await fs.writeFile(gitignorePath, 'old content');

      await createGitignore(tempDir);

      const content = await fs.readFile(gitignorePath, 'utf-8');
      expect(content).not.toContain('old content');
      expect(content).toContain('node_modules/');
    });
  });
});

