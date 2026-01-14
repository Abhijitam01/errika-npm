import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TurborepoGenerator, TurborepoOptions } from '../../../generators/turborepoGenerator';
import { execSync } from 'child_process';
import path from 'path';
import { createTempDir, cleanupTempDir } from '../../setup';

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
      fail: vi.fn()
    }))
  }
}));

describe('TurborepoGenerator', () => {
  let tempDir: string;
  let projectDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    projectDir = path.join(tempDir, 'turborepo-app');
    vi.clearAllMocks();
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('constructor', () => {
    it('should initialize with correct metadata', () => {
      const options: TurborepoOptions = {
        projectName: 'turborepo-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'nextjs'
      };

      const generator = new TurborepoGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.id).toBe('turborepo');
      expect(metadata.name).toBe('Turborepo Monorepo');
      expect(metadata.description).toContain('Turborepo');
      expect(metadata.description).toContain('monorepo');
    });

    it('should only support pnpm and bun', () => {
      const options: TurborepoOptions = {
        projectName: 'turborepo-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'nextjs'
      };

      const generator = new TurborepoGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).toContain('pnpm');
      expect(metadata.supportedPackageManagers).toContain('bun');
      expect(metadata.supportedPackageManagers).not.toContain('npm');
      expect(metadata.supportedPackageManagers).not.toContain('yarn');
    });
  });

  describe('frontend type support', () => {
    it('should support nextjs frontend', () => {
      const options: TurborepoOptions = {
        projectName: 'turborepo-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'nextjs'
      };

      const generator = new TurborepoGenerator(options);
      expect(generator.getMetadata().id).toBe('turborepo');
    });

    it('should support react frontend', () => {
      const options: TurborepoOptions = {
        projectName: 'turborepo-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'react'
      };

      const generator = new TurborepoGenerator(options);
      expect(generator.getMetadata().id).toBe('turborepo');
    });

    it('should support react-native frontend', () => {
      const options: TurborepoOptions = {
        projectName: 'turborepo-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'react-native'
      };

      const generator = new TurborepoGenerator(options);
      expect(generator.getMetadata().id).toBe('turborepo');
    });
  });

  describe('metadata', () => {
    it('should have turborepo as template id', () => {
      const options: TurborepoOptions = {
        projectName: 'turborepo-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'nextjs'
      };

      const generator = new TurborepoGenerator(options);
      expect(generator.getMetadata().id).toBe('turborepo');
    });

    it('should describe monorepo features', () => {
      const options: TurborepoOptions = {
        projectName: 'turborepo-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'nextjs'
      };

      const generator = new TurborepoGenerator(options);
      const description = generator.getMetadata().description;

      expect(description.toLowerCase()).toContain('turborepo');
      expect(description.toLowerCase()).toContain('monorepo');
      expect(description.toLowerCase()).toContain('backend');
      expect(description.toLowerCase()).toContain('frontend');
    });
  });

  describe('package manager compatibility', () => {
    it('should work with pnpm', () => {
      const options: TurborepoOptions = {
        projectName: 'turborepo-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'nextjs'
      };

      const generator = new TurborepoGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).toContain('pnpm');
    });

    it('should work with bun', () => {
      const options: TurborepoOptions = {
        projectName: 'turborepo-app',
        targetDirectory: projectDir,
        packageManager: 'bun',
        frontendType: 'nextjs'
      };

      const generator = new TurborepoGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).toContain('bun');
    });
  });
});

