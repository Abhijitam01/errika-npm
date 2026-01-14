import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validatePackageManager,
  checkPackageManagerExists,
  detectPackageManager,
  getInstallCommand,
  getRunCommand,
  PackageManager
} from '../../../utils/packageManager';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

vi.mock('child_process');
vi.mock('fs-extra');

describe('packageManager utilities', () => {
  describe('validatePackageManager', () => {
    it('should accept valid package managers', () => {
      const validPMs: PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];
      
      validPMs.forEach(pm => {
        expect(() => validatePackageManager(pm)).not.toThrow();
      });
    });

    it('should reject invalid package managers', () => {
      const invalidPMs = ['invalid', 'apt', 'brew', '', null, undefined];
      
      invalidPMs.forEach(pm => {
        expect(() => validatePackageManager(pm as any)).toThrow('Invalid package manager');
      });
    });

    it('should provide allowed values in error message', () => {
      try {
        validatePackageManager('invalid' as any);
      } catch (error: any) {
        expect(error.message).toContain('npm');
        expect(error.message).toContain('yarn');
        expect(error.message).toContain('pnpm');
        expect(error.message).toContain('bun');
      }
    });
  });

  describe('checkPackageManagerExists', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should pass when package manager is installed (Unix)', () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'linux' });
      
      vi.mocked(execSync).mockReturnValue(Buffer.from('/usr/bin/npm'));
      
      expect(() => checkPackageManagerExists('npm')).not.toThrow();
      expect(execSync).toHaveBeenCalledWith(
        'which npm',
        expect.objectContaining({ stdio: 'ignore' })
      );

      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });

    it('should pass when package manager is installed (Windows)', () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'win32' });
      
      vi.mocked(execSync).mockReturnValue(Buffer.from('C:\\Program Files\\nodejs\\npm.cmd'));
      
      expect(() => checkPackageManagerExists('npm')).not.toThrow();
      expect(execSync).toHaveBeenCalledWith(
        'where npm',
        expect.objectContaining({ stdio: 'ignore' })
      );

      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });

    it('should throw when package manager is not installed', () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Command not found');
      });
      
      expect(() => checkPackageManagerExists('pnpm')).toThrow('pnpm is not installed');
    });

    it('should provide installation instructions in error message', () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Command not found');
      });
      
      const pmInstructions: Record<PackageManager, string> = {
        npm: 'nodejs.org',
        yarn: 'npm install -g yarn',
        pnpm: 'npm install -g pnpm',
        bun: 'bun.sh'
      };

      Object.entries(pmInstructions).forEach(([pm, instruction]) => {
        try {
          checkPackageManagerExists(pm as PackageManager);
        } catch (error: any) {
          expect(error.message).toContain(instruction);
        }
      });
    });
  });

  describe('detectPackageManager', () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = path.join(os.tmpdir(), `test-${Date.now()}`);
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should detect pnpm from pnpm-lock.yaml', () => {
      vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
        return filePath.includes('pnpm-lock.yaml');
      });

      const result = detectPackageManager(tempDir);
      expect(result).toBe('pnpm');
    });

    it('should detect yarn from yarn.lock', () => {
      vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
        return filePath.includes('yarn.lock');
      });

      const result = detectPackageManager(tempDir);
      expect(result).toBe('yarn');
    });

    it('should detect npm from package-lock.json', () => {
      vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
        return filePath.includes('package-lock.json');
      });

      const result = detectPackageManager(tempDir);
      expect(result).toBe('npm');
    });

    it('should detect bun from bun.lockb', () => {
      vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
        return filePath.includes('bun.lockb');
      });

      const result = detectPackageManager(tempDir);
      expect(result).toBe('bun');
    });

    it('should return null when no lockfile is found', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const result = detectPackageManager(tempDir);
      expect(result).toBeNull();
    });

    it('should prioritize pnpm over other package managers', () => {
      vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
        return filePath.includes('pnpm-lock.yaml') || filePath.includes('yarn.lock');
      });

      const result = detectPackageManager(tempDir);
      expect(result).toBe('pnpm');
    });
  });

  describe('getInstallCommand', () => {
    it('should return correct install command for each package manager', () => {
      expect(getInstallCommand('npm')).toBe('npm install');
      expect(getInstallCommand('yarn')).toBe('yarn install');
      expect(getInstallCommand('pnpm')).toBe('pnpm install');
      expect(getInstallCommand('bun')).toBe('bun install');
    });
  });

  describe('getRunCommand', () => {
    it('should return npm run command for npm', () => {
      expect(getRunCommand('npm', 'dev')).toBe('npm run dev');
      expect(getRunCommand('npm', 'build')).toBe('npm run build');
      expect(getRunCommand('npm', 'test')).toBe('npm run test');
    });

    it('should return direct command for yarn', () => {
      expect(getRunCommand('yarn', 'dev')).toBe('yarn dev');
      expect(getRunCommand('yarn', 'build')).toBe('yarn build');
    });

    it('should return direct command for pnpm', () => {
      expect(getRunCommand('pnpm', 'dev')).toBe('pnpm dev');
      expect(getRunCommand('pnpm', 'build')).toBe('pnpm build');
    });

    it('should return direct command for bun', () => {
      expect(getRunCommand('bun', 'dev')).toBe('bun dev');
      expect(getRunCommand('bun', 'build')).toBe('bun build');
    });
  });
});

