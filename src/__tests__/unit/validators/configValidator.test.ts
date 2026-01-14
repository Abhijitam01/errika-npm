import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { ConfigValidator } from '../../../validators/configValidator';

describe('ConfigValidator', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'errika-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('validatePackageJson', () => {
    it('should pass for valid package.json', async () => {
      await fs.writeJSON(path.join(tempDir, 'package.json'), {
        name: 'test-project',
        version: '1.0.0',
        description: 'Test project',
        scripts: {
          dev: 'echo dev',
          build: 'echo build'
        }
      });

      const result = await ConfigValidator.validatePackageJson(tempDir);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when package.json is missing', async () => {
      const result = await ConfigValidator.validatePackageJson(tempDir);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('package.json is missing');
    });

    it('should fail for invalid JSON', async () => {
      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        '{ "name": "test", invalid json }'
      );

      const result = await ConfigValidator.validatePackageJson(tempDir);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('invalid JSON syntax'))).toBe(true);
    });

    it('should fail when required fields are missing', async () => {
      await fs.writeJSON(path.join(tempDir, 'package.json'), {
        description: 'Missing name and version'
      });

      const result = await ConfigValidator.validatePackageJson(tempDir);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should warn when recommended fields are missing', async () => {
      await fs.writeJSON(path.join(tempDir, 'package.json'), {
        name: 'test',
        version: '1.0.0'
      });

      const result = await ConfigValidator.validatePackageJson(tempDir);

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('validateTypeScriptConfig', () => {
    it('should pass for valid tsconfig.json', async () => {
      await fs.writeJSON(path.join(tempDir, 'tsconfig.json'), {
        compilerOptions: {
          target: 'es2020',
          module: 'commonjs',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true
        }
      });

      const result = await ConfigValidator.validateTypeScriptConfig(tempDir);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should warn when tsconfig.json is missing', async () => {
      const result = await ConfigValidator.validateTypeScriptConfig(tempDir);

      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.includes('not found'))).toBe(true);
    });

    it('should warn for missing recommended options', async () => {
      await fs.writeJSON(path.join(tempDir, 'tsconfig.json'), {
        compilerOptions: {
          target: 'es2020'
        }
      });

      const result = await ConfigValidator.validateTypeScriptConfig(tempDir);

      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should handle trailing commas in tsconfig.json', async () => {
      await fs.writeFile(
        path.join(tempDir, 'tsconfig.json'),
        '{\n  "compilerOptions": {\n    "strict": true,\n  }\n}'
      );

      const result = await ConfigValidator.validateTypeScriptConfig(tempDir);

      // Should not fail - just warning about non-standard JSON
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateEnvExample', () => {
    it('should pass for valid env.example', async () => {
      await fs.writeFile(
        path.join(tempDir, 'env.example'),
        'DATABASE_URL=postgres://localhost/db\nAPI_KEY=your_api_key_here\n'
      );

      const result = await ConfigValidator.validateEnvExample(tempDir);

      expect(result.valid).toBe(true);
    });

    it('should pass when env.example is missing', async () => {
      const result = await ConfigValidator.validateEnvExample(tempDir);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should warn for incorrect key format', async () => {
      await fs.writeFile(
        path.join(tempDir, 'env.example'),
        'apiKey=test\nDATABASE_URL=test\n'
      );

      const result = await ConfigValidator.validateEnvExample(tempDir);

      expect(result.warnings.some(w => w.includes('should be uppercase'))).toBe(true);
    });

    it('should skip comments', async () => {
      await fs.writeFile(
        path.join(tempDir, 'env.example'),
        '# Database configuration\nDATABASE_URL=postgres://localhost/db\n'
      );

      const result = await ConfigValidator.validateEnvExample(tempDir);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateNextConfig', () => {
    it('should pass for valid next.config.js', async () => {
      await fs.writeFile(
        path.join(tempDir, 'next.config.js'),
        'module.exports = { reactStrictMode: true };\n'
      );

      const result = await ConfigValidator.validateNextConfig(tempDir);

      expect(result.valid).toBe(true);
    });

    it('should pass when next.config.js is missing', async () => {
      const result = await ConfigValidator.validateNextConfig(tempDir);

      expect(result.valid).toBe(true);
    });

    it('should fail when next.config.js has no export', async () => {
      await fs.writeFile(
        path.join(tempDir, 'next.config.js'),
        'const config = {};\n'
      );

      const result = await ConfigValidator.validateNextConfig(tempDir);

      expect(result.valid).toBe(false);
    });
  });

  describe('validateViteConfig', () => {
    it('should pass for valid vite.config.ts', async () => {
      await fs.writeFile(
        path.join(tempDir, 'vite.config.ts'),
        'import { defineConfig } from "vite";\nexport default defineConfig({});\n'
      );

      const result = await ConfigValidator.validateViteConfig(tempDir);

      expect(result.valid).toBe(true);
    });

    it('should pass when vite.config is missing', async () => {
      const result = await ConfigValidator.validateViteConfig(tempDir);

      expect(result.valid).toBe(true);
    });

    it('should warn when not using defineConfig', async () => {
      await fs.writeFile(
        path.join(tempDir, 'vite.config.ts'),
        'export default {};\n'
      );

      const result = await ConfigValidator.validateViteConfig(tempDir);

      expect(result.warnings.some(w => w.includes('defineConfig'))).toBe(true);
    });
  });

  describe('validateAllConfigs', () => {
    it('should run all config validations', async () => {
      await fs.writeJSON(path.join(tempDir, 'package.json'), {
        name: 'test',
        version: '1.0.0'
      });

      const result = await ConfigValidator.validateAllConfigs(tempDir);

      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
    });

    it('should combine errors from all validators', async () => {
      // Create invalid package.json
      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        '{ invalid json }'
      );

      const result = await ConfigValidator.validateAllConfigs(tempDir);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

