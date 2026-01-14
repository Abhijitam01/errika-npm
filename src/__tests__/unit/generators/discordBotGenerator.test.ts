import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DiscordBotGenerator } from '../../../generators/discordBotGenerator';
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

describe('DiscordBotGenerator', () => {
  let tempDir: string;
  let projectDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    projectDir = path.join(tempDir, 'discord-bot');
    vi.clearAllMocks();
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('constructor', () => {
    it('should initialize with correct metadata', () => {
      const options: GeneratorOptions = {
        projectName: 'discord-bot',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new DiscordBotGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.id).toBe('discord-bot');
      expect(metadata.name).toBe('Discord Bot');
      expect(metadata.description).toContain('discord.js');
      expect(metadata.description).toContain('v14');
    });

    it('should support all package managers', () => {
      const options: GeneratorOptions = {
        projectName: 'discord-bot',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new DiscordBotGenerator(options);
      const metadata = generator.getMetadata();

      expect(metadata.supportedPackageManagers).toContain('npm');
      expect(metadata.supportedPackageManagers).toContain('yarn');
      expect(metadata.supportedPackageManagers).toContain('pnpm');
      expect(metadata.supportedPackageManagers).toContain('bun');
    });
  });

  describe('metadata', () => {
    it('should have discord-bot as template id', () => {
      const options: GeneratorOptions = {
        projectName: 'discord-bot',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new DiscordBotGenerator(options);
      expect(generator.getMetadata().id).toBe('discord-bot');
    });

    it('should describe Discord bot features', () => {
      const options: GeneratorOptions = {
        projectName: 'discord-bot',
        targetDirectory: projectDir,
        packageManager: 'npm'
      };

      const generator = new DiscordBotGenerator(options);
      const description = generator.getMetadata().description;

      expect(description.toLowerCase()).toContain('discord');
      expect(description.toLowerCase()).toContain('slash commands');
      expect(description.toLowerCase()).toContain('event');
    });
  });

  describe('package manager compatibility', () => {
    const packageManagers = ['npm', 'yarn', 'pnpm', 'bun'] as const;

    packageManagers.forEach(pm => {
      it(`should work with ${pm}`, () => {
        const options: GeneratorOptions = {
          projectName: 'discord-bot',
          targetDirectory: projectDir,
          packageManager: pm
        };

        const generator = new DiscordBotGenerator(options);
        const metadata = generator.getMetadata();

        expect(metadata.supportedPackageManagers).toContain(pm);
      });
    });
  });
});

