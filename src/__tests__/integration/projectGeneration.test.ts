import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextjsGenerator } from '../../generators/nextjsGenerator';
import { ExpressReactGenerator } from '../../generators/expressReactGenerator';
import { DiscordBotGenerator } from '../../generators/discordBotGenerator';
import { ChromeExtGenerator } from '../../generators/chromeExtGenerator';
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

describe('Project Generation Integration Tests', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('errika-integration-');
    vi.clearAllMocks();
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('Next.js Full Generation', () => {
    it('should generate a complete Next.js project', async () => {
      const projectDir = path.join(tempDir, 'nextjs-app');
      const options: GeneratorOptions = {
        projectName: 'nextjs-app',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await generator.generate();

      // Check essential files exist
      expect(await fs.pathExists(path.join(projectDir, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'tsconfig.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'next.config.js'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'tailwind.config.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, '.gitignore'))).toBe(true);

      // Check app directory structure
      expect(await fs.pathExists(path.join(projectDir, 'app', 'layout.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'app', 'page.tsx'))).toBe(true);
      
      // Check components
      expect(await fs.pathExists(path.join(projectDir, 'components'))).toBe(true);

      // Verify package.json has correct project name
      const packageJson = await fs.readJSON(path.join(projectDir, 'package.json'));
      expect(packageJson.name).toBe('nextjs-app');
    });

    it('should process template variables in Next.js project', async () => {
      const projectDir = path.join(tempDir, 'my-next-project');
      const options: GeneratorOptions = {
        projectName: 'my-next-project',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await generator.generate();

      const packageJson = await fs.readJSON(path.join(projectDir, 'package.json'));
      expect(packageJson.name).toBe('my-next-project');
    });
  });

  describe('Express + React Full Generation', () => {
    it('should generate a complete Express + React monorepo', async () => {
      const projectDir = path.join(tempDir, 'express-react-app');
      const options: GeneratorOptions = {
        projectName: 'express-react-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        installDependencies: false,
        initGit: false
      };

      const generator = new ExpressReactGenerator(options);
      await generator.generate();

      // Check root files
      expect(await fs.pathExists(path.join(projectDir, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, '.gitignore'))).toBe(true);

      // Check backend structure
      expect(await fs.pathExists(path.join(projectDir, 'backend', 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'backend', 'tsconfig.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'backend', 'src'))).toBe(true);

      // Check frontend structure
      expect(await fs.pathExists(path.join(projectDir, 'frontend', 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'frontend', 'tsconfig.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'frontend', 'vite.config.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'frontend', 'src'))).toBe(true);
    });
  });

  describe('Discord Bot Full Generation', () => {
    it('should generate a complete Discord bot project', async () => {
      const projectDir = path.join(tempDir, 'discord-bot');
      const options: GeneratorOptions = {
        projectName: 'discord-bot',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new DiscordBotGenerator(options);
      await generator.generate();

      // Check essential files
      expect(await fs.pathExists(path.join(projectDir, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'tsconfig.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, '.gitignore'))).toBe(true);

      // Check src structure
      expect(await fs.pathExists(path.join(projectDir, 'src', 'index.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'src', 'commands'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'src', 'events'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'src', 'deploy-commands.ts'))).toBe(true);
    });
  });

  describe('Chrome Extension Full Generation', () => {
    it('should generate a complete Chrome extension project', async () => {
      const projectDir = path.join(tempDir, 'chrome-ext');
      const options: GeneratorOptions = {
        projectName: 'chrome-ext',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };

      const generator = new ChromeExtGenerator(options);
      await generator.generate();

      // Check essential files
      expect(await fs.pathExists(path.join(projectDir, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'tsconfig.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'vite.config.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, '.gitignore'))).toBe(true);

      // Check public directory
      expect(await fs.pathExists(path.join(projectDir, 'public', 'manifest.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'public', 'icons'))).toBe(true);

      // Check src structure
      expect(await fs.pathExists(path.join(projectDir, 'src', 'popup'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'src', 'background'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'src', 'content'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'src', 'options'))).toBe(true);
    });
  });

  describe('Turborepo Full Generation', () => {
    it('should generate a complete Turborepo monorepo with Next.js', async () => {
      const projectDir = path.join(tempDir, 'turborepo-app');
      const options: TurborepoOptions = {
        projectName: 'turborepo-app',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'nextjs',
        installDependencies: false,
        initGit: false
      };

      const generator = new TurborepoGenerator(options);
      await generator.generate();

      // Check root files
      expect(await fs.pathExists(path.join(projectDir, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'turbo.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'pnpm-workspace.yaml'))).toBe(true);

      // Check apps directory
      expect(await fs.pathExists(path.join(projectDir, 'apps', 'web'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'apps', 'http-backend'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'apps', 'ws-backend'))).toBe(true);

      // Check packages directory
      expect(await fs.pathExists(path.join(projectDir, 'packages', 'ui'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'packages', 'eslint-config'))).toBe(true);
      expect(await fs.pathExists(path.join(projectDir, 'packages', 'typescript-config'))).toBe(true);
    });

    it('should generate Turborepo with React frontend', async () => {
      const projectDir = path.join(tempDir, 'turborepo-react');
      const options: TurborepoOptions = {
        projectName: 'turborepo-react',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'react',
        installDependencies: false,
        initGit: false
      };

      const generator = new TurborepoGenerator(options);
      await generator.generate();

      expect(await fs.pathExists(path.join(projectDir, 'apps', 'web'))).toBe(true);
    });

    it('should generate Turborepo with React Native frontend', async () => {
      const projectDir = path.join(tempDir, 'turborepo-rn');
      const options: TurborepoOptions = {
        projectName: 'turborepo-rn',
        targetDirectory: projectDir,
        packageManager: 'pnpm',
        frontendType: 'react-native',
        installDependencies: false,
        initGit: false
      };

      const generator = new TurborepoGenerator(options);
      await generator.generate();

      expect(await fs.pathExists(path.join(projectDir, 'apps', 'mobile'))).toBe(true);
    });
  });

  describe('Git Initialization', () => {
    it('should initialize git repository when requested', async () => {
      const projectDir = path.join(tempDir, 'git-test');
      const options: GeneratorOptions = {
        projectName: 'git-test',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: true
      };

      const generator = new NextjsGenerator(options);
      await generator.generate();

      const gitCalls = vi.mocked(execSync).mock.calls.filter(
        call => call[0].toString().includes('git')
      );
      expect(gitCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Dependency Installation', () => {
    it('should install dependencies when requested', async () => {
      const projectDir = path.join(tempDir, 'install-test');
      const options: GeneratorOptions = {
        projectName: 'install-test',
        targetDirectory: projectDir,
        packageManager: 'npm',
        installDependencies: true,
        initGit: false
      };

      const generator = new NextjsGenerator(options);
      await generator.generate();

      const installCalls = vi.mocked(execSync).mock.calls.filter(
        call => call[0].toString().includes('install')
      );
      expect(installCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple Projects in Sequence', () => {
    it('should generate multiple different projects without conflicts', async () => {
      const nextjsDir = path.join(tempDir, 'nextjs-1');
      const discordDir = path.join(tempDir, 'discord-1');

      // Generate Next.js project
      const nextjsOptions: GeneratorOptions = {
        projectName: 'nextjs-1',
        targetDirectory: nextjsDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };
      await new NextjsGenerator(nextjsOptions).generate();

      // Generate Discord bot project
      const discordOptions: GeneratorOptions = {
        projectName: 'discord-1',
        targetDirectory: discordDir,
        packageManager: 'npm',
        installDependencies: false,
        initGit: false
      };
      await new DiscordBotGenerator(discordOptions).generate();

      // Verify both exist and are independent
      expect(await fs.pathExists(path.join(nextjsDir, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(discordDir, 'package.json'))).toBe(true);

      const nextjsPkg = await fs.readJSON(path.join(nextjsDir, 'package.json'));
      const discordPkg = await fs.readJSON(path.join(discordDir, 'package.json'));

      expect(nextjsPkg.name).toBe('nextjs-1');
      expect(discordPkg.name).toBe('discord-1');
    });
  });
});

