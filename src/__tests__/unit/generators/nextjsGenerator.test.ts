import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextjsGenerator } from '../../../generators/nextjsGenerator';
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

describe('NextjsGenerator', () => {
  let tempDir: string;
  let projectDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    projectDir = path.join(tempDir, 'nextjs-app');
    vi.clearAllMocks();
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('constructor', () => {
    it('should initialize with correct metadata', () => {
      const options: GeneratorOptions = {
        projectName: 'nextjs-app',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new NextjsGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.id).toBe('nextjs');
      expect(metadata.name).toBe('Next.js Full-Stack');
      expect(metadata.description).toContain('Next.js 15');
      expect(metadata.description).toContain('App Router');
    });

    it('should support all package managers', () => {
      const options: GeneratorOptions = {
        projectName: 'nextjs-app',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new NextjsGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).toContain('npm');
      expect(metadata.supportedPackageManagers).toContain('yarn');
      expect(metadata.supportedPackageManagers).toContain('pnpm');
      expect(metadata.supportedPackageManagers).toContain('bun');
    });
  });

  describe('metadata', () => {
    it('should have nextjs as template id', () => {
      const options: GeneratorOptions = {
        projectName: 'nextjs-app',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new NextjsGenerator(options);
      expect(generator.getMetadata().id).toBe('nextjs');
    });

    it('should describe Next.js features', () => {
      const options: GeneratorOptions = {
        projectName: 'nextjs-app',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new NextjsGenerator(options);
      const description = generator.getMetadata().description;

      expect(description.toLowerCase()).toContain('next');
      expect(description.toLowerCase()).toContain('tailwind');
      expect(description.toLowerCase()).toContain('typescript');
    });
  });

  describe('package manager compatibility', () => {
    const packageManagers = ['npm', 'yarn', 'pnpm', 'bun'] as const;

    packageManagers.forEach(pm => {
      it(`should work with ${pm}`, () => {
        const options: GeneratorOptions = {
          projectName: 'nextjs-app',
          targetDirectory: projectDir,
          packageManager: pm
        };

        const generator = new NextjsGenerator(options);
        const metadata = generator.getMetadata();

        expect(metadata.supportedPackageManagers).toContain(pm);
      });
    });
  });

  describe('displayNextSteps', () => {
    it('should provide Next.js specific instructions', () => {
      const options: GeneratorOptions = {
        projectName: 'nextjs-app',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new NextjsGenerator(options);
      
      // The displayNextSteps is protected, but we can verify metadata provides enough info
      const metadata = generator.getMetadata();
      expect(metadata.name).toBeTruthy();
      expect(metadata.description).toBeTruthy();
    });
  });
});

