import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExpressReactGenerator } from '../../../generators/expressReactGenerator';
import { GeneratorOptions } from '../../../generators/baseGenerator';
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

describe('ExpressReactGenerator', () => {
  let tempDir: string;
  let projectDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    projectDir = path.join(tempDir, 'express-react-app');
    vi.clearAllMocks();
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('constructor', () => {
    it('should initialize with correct metadata', () => {
      const options: GeneratorOptions = {
        projectName: 'express-react-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm'
      };

      const generator = new ExpressReactGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.id).toBe('express-react');
      expect(metadata.name).toBe('Express + React');
      expect(metadata.description).toContain('Express');
      expect(metadata.description).toContain('React');
      expect(metadata.description).toContain('monorepo');
    });

    it('should support pnpm, npm, and yarn', () => {
      const options: GeneratorOptions = {
        projectName: 'express-react-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm'
      };

      const generator = new ExpressReactGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).toContain('pnpm');
      expect(metadata.supportedPackageManagers).toContain('npm');
      expect(metadata.supportedPackageManagers).toContain('yarn');
    });

    it('should not support bun', () => {
      const options: GeneratorOptions = {
        projectName: 'express-react-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm'
      };

      const generator = new ExpressReactGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).not.toContain('bun');
    });
  });

  describe('metadata', () => {
    it('should have express-react as template id', () => {
      const options: GeneratorOptions = {
        projectName: 'express-react-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm'
      };

      const generator = new ExpressReactGenerator(options);
      expect(generator.getMetadata().id).toBe('express-react');
    });

    it('should describe full-stack features', () => {
      const options: GeneratorOptions = {
        projectName: 'express-react-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm'
      };

      const generator = new ExpressReactGenerator(options);
      const description = generator.getMetadata().description;

      expect(description.toLowerCase()).toContain('express');
      expect(description.toLowerCase()).toContain('react');
      expect(description.toLowerCase()).toContain('backend');
      expect(description.toLowerCase()).toContain('frontend');
    });
  });

  describe('package manager compatibility', () => {
    it('should work with pnpm', () => {
      const options: GeneratorOptions = {
        projectName: 'express-react-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm'
      };

      const generator = new ExpressReactGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).toContain('pnpm');
    });

    it('should work with npm', () => {
      const options: GeneratorOptions = {
        projectName: 'express-react-app',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new ExpressReactGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).toContain('npm');
    });

    it('should work with yarn', () => {
      const options: GeneratorOptions = {
        projectName: 'express-react-app',
        targetDirectory: projectDir,
        packageManager: 'yarn'
      };

      const generator = new ExpressReactGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).toContain('yarn');
    });
  });
});

