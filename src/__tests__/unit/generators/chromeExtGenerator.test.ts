import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChromeExtGenerator } from '../../../generators/chromeExtGenerator';
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

describe('ChromeExtGenerator', () => {
  let tempDir: string;
  let projectDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    projectDir = path.join(tempDir, 'chrome-ext');
    vi.clearAllMocks();
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('constructor', () => {
    it('should initialize with correct metadata', () => {
      const options: GeneratorOptions = {
        projectName: 'chrome-ext',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new ChromeExtGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.id).toBe('chrome-extension');
      expect(metadata.name).toBe('Chrome Extension');
      expect(metadata.description).toContain('Manifest V3');
      expect(metadata.description).toContain('React');
    });

    it('should support all package managers', () => {
      const options: GeneratorOptions = {
        projectName: 'chrome-ext',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new ChromeExtGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).toContain('npm');
      expect(metadata.supportedPackageManagers).toContain('yarn');
      expect(metadata.supportedPackageManagers).toContain('pnpm');
      expect(metadata.supportedPackageManagers).toContain('bun');
    });
  });

  describe('metadata', () => {
    it('should have chrome-extension as template id', () => {
      const options: GeneratorOptions = {
        projectName: 'chrome-ext',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new ChromeExtGenerator(options);
      expect(generator.getMetadata().id).toBe('chrome-extension');
    });

    it('should describe Chrome extension features', () => {
      const options: GeneratorOptions = {
        projectName: 'chrome-ext',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new ChromeExtGenerator(options);
      const description = generator.getMetadata().description;

      expect(description.toLowerCase()).toContain('manifest');
      expect(description.toLowerCase()).toContain('react');
      expect(description.toLowerCase()).toContain('typescript');
    });
  });

  describe('package manager compatibility', () => {
    const packageManagers = ['npm', 'yarn', 'pnpm', 'bun'] as const;

    packageManagers.forEach(pm => {
      it(`should work with ${pm}`, () => {
        const options: GeneratorOptions = {
          projectName: 'chrome-ext',
          targetDirectory: projectDir,
          packageManager: pm
        };

        const generator = new ChromeExtGenerator(options);
        const metadata = generator.getMetadata();

        expect(metadata.supportedPackageManagers).toContain(pm);
      });
    });
  });
});

