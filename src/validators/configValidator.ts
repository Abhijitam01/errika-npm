import fs from 'fs-extra';
import path from 'path';
import { Logger } from '../utils/logger';

export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class ConfigValidator {
  /**
   * Validate package.json file
   */
  static async validatePackageJson(templateDir: string): Promise<ConfigValidationResult> {
    const result: ConfigValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    const packageJsonPath = path.join(templateDir, 'package.json');
    const exists = await fs.pathExists(packageJsonPath);

    if (!exists) {
      result.valid = false;
      result.errors.push('package.json is missing');
      return result;
    }

    try {
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      
      // Validate JSON syntax
      let packageJson;
      try {
        packageJson = JSON.parse(content);
      } catch (parseError) {
        result.valid = false;
        result.errors.push(`package.json has invalid JSON syntax: ${parseError}`);
        return result;
      }

      // Validate required fields
      const requiredFields = ['name', 'version'];
      for (const field of requiredFields) {
        if (!packageJson[field]) {
          result.valid = false;
          result.errors.push(`package.json is missing required field: ${field}`);
        }
      }

      // Validate recommended fields
      const recommendedFields = ['description', 'scripts'];
      for (const field of recommendedFields) {
        if (!packageJson[field]) {
          result.warnings.push(`package.json is missing recommended field: ${field}`);
        }
      }

      // Check for placeholder values that should be replaced
      if (packageJson.name && packageJson.name.includes('{{')) {
        result.warnings.push('package.json name contains placeholder {{...}} - this is expected');
      }

      // Validate scripts
      if (packageJson.scripts) {
        const recommendedScripts = ['dev', 'build'];
        for (const script of recommendedScripts) {
          if (!packageJson.scripts[script]) {
            result.warnings.push(`package.json scripts missing recommended script: ${script}`);
          }
        }
      }

      // Check dependencies format
      if (packageJson.dependencies) {
        for (const [dep, version] of Object.entries(packageJson.dependencies)) {
          if (typeof version !== 'string') {
            result.errors.push(`Invalid version for dependency ${dep}: ${version}`);
            result.valid = false;
          }
        }
      }

      // Check devDependencies format
      if (packageJson.devDependencies) {
        for (const [dep, version] of Object.entries(packageJson.devDependencies)) {
          if (typeof version !== 'string') {
            result.errors.push(`Invalid version for devDependency ${dep}: ${version}`);
            result.valid = false;
          }
        }
      }

    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to read package.json: ${error}`);
    }

    return result;
  }

  /**
   * Validate TypeScript configuration files
   */
  static async validateTypeScriptConfig(templateDir: string): Promise<ConfigValidationResult> {
    const result: ConfigValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    const tsconfigPath = path.join(templateDir, 'tsconfig.json');
    const exists = await fs.pathExists(tsconfigPath);

    if (!exists) {
      result.warnings.push('tsconfig.json not found - template may not use TypeScript');
      return result;
    }

    try {
      const content = await fs.readFile(tsconfigPath, 'utf-8');
      
      // Remove comments and trailing commas for JSON parsing
      let cleanContent = content;
      
      // Remove single-line comments
      cleanContent = cleanContent
        .split('\n')
        .filter(line => !line.trim().startsWith('//'))
        .join('\n');
      
      // Remove multi-line comments
      cleanContent = cleanContent.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Remove trailing commas before } or ]
      cleanContent = cleanContent.replace(/,(\s*[}\]])/g, '$1');
      
      // Validate JSON syntax
      let tsconfig;
      try {
        tsconfig = JSON.parse(cleanContent);
      } catch (parseError) {
        // tsconfig.json might have non-standard JSON, which is OK for TypeScript
        result.warnings.push(`tsconfig.json has non-standard JSON (this is usually fine for TypeScript): ${parseError}`);
        return result;
      }

      // Validate compilerOptions
      if (!tsconfig.compilerOptions) {
        result.warnings.push('tsconfig.json is missing compilerOptions');
      } else {
        // Check for recommended options
        const recommendedOptions = {
          'strict': true,
          'esModuleInterop': true,
          'skipLibCheck': true,
          'forceConsistentCasingInFileNames': true
        };

        for (const [option, recommendedValue] of Object.entries(recommendedOptions)) {
          if (!(option in tsconfig.compilerOptions)) {
            result.warnings.push(
              `tsconfig.json compilerOptions missing recommended option: ${option}`
            );
          }
        }

        // Check for target and module
        if (!tsconfig.compilerOptions.target) {
          result.warnings.push('tsconfig.json compilerOptions missing target');
        }
        if (!tsconfig.compilerOptions.module) {
          result.warnings.push('tsconfig.json compilerOptions missing module');
        }
      }

    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to validate tsconfig.json: ${error}`);
    }

    return result;
  }

  /**
   * Validate environment variable templates
   */
  static async validateEnvExample(templateDir: string): Promise<ConfigValidationResult> {
    const result: ConfigValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    const envExamplePath = path.join(templateDir, 'env.example');
    const exists = await fs.pathExists(envExamplePath);

    if (!exists) {
      // Not all templates need env files
      return result;
    }

    try {
      const content = await fs.readFile(envExamplePath, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip comments and empty lines
        if (line.startsWith('#') || line === '') {
          continue;
        }

        // Check format: KEY=value
        if (!line.includes('=')) {
          result.warnings.push(
            `env.example line ${i + 1} doesn't follow KEY=value format: ${line}`
          );
          continue;
        }

        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');

        // Check if key is valid (uppercase with underscores)
        if (!/^[A-Z][A-Z0-9_]*$/.test(key.trim())) {
          result.warnings.push(
            `env.example line ${i + 1} key should be uppercase with underscores: ${key}`
          );
        }

        // Check if value looks like real sensitive data
        // Skip URLs, localhost, and common placeholder patterns
        const isUrl = /^https?:\/\//.test(value);
        const isLocalhost = /localhost|127\.0\.0\.1/.test(value);
        const isPlaceholder = value.includes('your_') || value.includes('YOUR_') || 
                              value.includes('example') || value.includes('xxx') ||
                              value.includes('postgres') || value.includes('DATABASE');
        
        if (value && !isUrl && !isLocalhost && !isPlaceholder && value.length > 30) {
          result.warnings.push(
            `env.example line ${i + 1} might contain real sensitive data: ${key}`
          );
        }
      }

    } catch (error) {
      result.errors.push(`Failed to validate env.example: ${error}`);
      result.valid = false;
    }

    return result;
  }

  /**
   * Validate Next.js config (if present)
   */
  static async validateNextConfig(templateDir: string): Promise<ConfigValidationResult> {
    const result: ConfigValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    const nextConfigPath = path.join(templateDir, 'next.config.js');
    const exists = await fs.pathExists(nextConfigPath);

    if (!exists) {
      // Not a Next.js template
      return result;
    }

    try {
      const content = await fs.readFile(nextConfigPath, 'utf-8');
      
      // Basic validation - check if it's valid JavaScript
      if (!content.includes('module.exports') && !content.includes('export default')) {
        result.errors.push('next.config.js must export a configuration object');
        result.valid = false;
      }

    } catch (error) {
      result.errors.push(`Failed to validate next.config.js: ${error}`);
      result.valid = false;
    }

    return result;
  }

  /**
   * Validate Vite config (if present)
   */
  static async validateViteConfig(templateDir: string): Promise<ConfigValidationResult> {
    const result: ConfigValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    const viteConfigPath = path.join(templateDir, 'vite.config.ts');
    const viteConfigJsPath = path.join(templateDir, 'vite.config.js');
    
    const tsExists = await fs.pathExists(viteConfigPath);
    const jsExists = await fs.pathExists(viteConfigJsPath);

    if (!tsExists && !jsExists) {
      // Not a Vite template
      return result;
    }

    const configPath = tsExists ? viteConfigPath : viteConfigJsPath;

    try {
      const content = await fs.readFile(configPath, 'utf-8');
      
      // Basic validation - check if it exports a config
      if (!content.includes('export default')) {
        result.errors.push('vite.config must export a configuration object');
        result.valid = false;
      }

      // Check if it imports defineConfig
      if (!content.includes('defineConfig')) {
        result.warnings.push('vite.config should use defineConfig for type safety');
      }

    } catch (error) {
      result.errors.push(`Failed to validate vite.config: ${error}`);
      result.valid = false;
    }

    return result;
  }

  /**
   * Validate all configs in a template
   */
  static async validateAllConfigs(templateDir: string): Promise<ConfigValidationResult> {
    const results = await Promise.all([
      this.validatePackageJson(templateDir),
      this.validateTypeScriptConfig(templateDir),
      this.validateEnvExample(templateDir),
      this.validateNextConfig(templateDir),
      this.validateViteConfig(templateDir)
    ]);

    // Combine all results
    const combined: ConfigValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    for (const result of results) {
      if (!result.valid) {
        combined.valid = false;
      }
      combined.errors.push(...result.errors);
      combined.warnings.push(...result.warnings);
    }

    return combined;
  }
}

