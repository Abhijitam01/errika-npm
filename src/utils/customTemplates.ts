import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { Logger } from './logger';

/**
 * Custom template configuration schema
 */
export interface TemplateConfig {
  name: string;
  description: string;
  author?: string;
  version?: string;
  extends?: string; // Base template to inherit from
  supportedPackageManagers?: string[];
  customPrompts?: CustomPrompt[];
  customScripts?: CustomScript[];
  files?: {
    exclude?: string[];
    override?: string[];
  };
}

export interface CustomPrompt {
  name: string;
  type: 'text' | 'select' | 'confirm';
  message: string;
  choices?: string[];
  default?: any;
}

export interface CustomScript {
  name: string;
  description: string;
  command: string;
  when?: 'before' | 'after'; // When to run: before or after generation
}

/**
 * Get the custom templates directory
 */
export function getCustomTemplatesDir(): string {
  return path.join(os.homedir(), '.errika', 'templates');
}

/**
 * Ensure custom templates directory exists
 */
export async function ensureCustomTemplatesDir(): Promise<void> {
  const dir = getCustomTemplatesDir();
  await fs.ensureDir(dir);
}

/**
 * Get all custom templates
 */
export async function getCustomTemplates(): Promise<Map<string, TemplateConfig>> {
  const templates = new Map<string, TemplateConfig>();
  const customDir = getCustomTemplatesDir();

  try {
    await ensureCustomTemplatesDir();
    const entries = await fs.readdir(customDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const configPath = path.join(customDir, entry.name, 'template.config.json');
        
        if (await fs.pathExists(configPath)) {
          try {
            const config = await fs.readJson(configPath) as TemplateConfig;
            templates.set(entry.name, config);
          } catch (error) {
            Logger.warning(`Failed to load template config for ${entry.name}`);
          }
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }

  return templates;
}

/**
 * Get a specific custom template config
 */
export async function getCustomTemplateConfig(templateId: string): Promise<TemplateConfig | null> {
  const configPath = path.join(getCustomTemplatesDir(), templateId, 'template.config.json');

  try {
    if (await fs.pathExists(configPath)) {
      return await fs.readJson(configPath);
    }
  } catch (error) {
    Logger.error(`Failed to load template config: ${error}`);
  }

  return null;
}

/**
 * Get the template directory (custom or built-in)
 */
export function getTemplateDirectory(templateId: string): string {
  const customDir = path.join(getCustomTemplatesDir(), templateId);
  const builtInDir = path.join(__dirname, '../templates', templateId);

  if (fs.existsSync(customDir)) {
    return customDir;
  }

  return builtInDir;
}

/**
 * Add a custom template from a source directory
 */
export async function addCustomTemplate(sourcePath: string, templateName?: string): Promise<void> {
  const spinner = Logger.spinner('Adding custom template...');

  try {
    // Validate source path
    if (!await fs.pathExists(sourcePath)) {
      throw new Error(`Source path does not exist: ${sourcePath}`);
    }

    const stats = await fs.stat(sourcePath);
    if (!stats.isDirectory()) {
      throw new Error('Source path must be a directory');
    }

    // Check for template.config.json
    const configPath = path.join(sourcePath, 'template.config.json');
    if (!await fs.pathExists(configPath)) {
      throw new Error('template.config.json not found in source directory');
    }

    // Load and validate config
    const config = await fs.readJson(configPath) as TemplateConfig;
    if (!config.name) {
      throw new Error('Template config must have a name');
    }

    // Use provided name or config name
    const finalName = templateName || config.name;

    // Ensure custom templates directory exists
    await ensureCustomTemplatesDir();

    // Check if template already exists
    const targetPath = path.join(getCustomTemplatesDir(), finalName);
    if (await fs.pathExists(targetPath)) {
      throw new Error(`Template '${finalName}' already exists. Remove it first.`);
    }

    // Copy template to custom directory
    await fs.copy(sourcePath, targetPath);

    spinner.succeed(`Template '${finalName}' added successfully`);
    Logger.success(`Location: ${targetPath}`);
  } catch (error) {
    spinner.fail('Failed to add template');
    throw error;
  }
}

/**
 * Remove a custom template
 */
export async function removeCustomTemplate(templateName: string): Promise<void> {
  const spinner = Logger.spinner('Removing custom template...');

  try {
    const templatePath = path.join(getCustomTemplatesDir(), templateName);

    if (!await fs.pathExists(templatePath)) {
      throw new Error(`Template '${templateName}' not found`);
    }

    // Verify it's a custom template (has config)
    const configPath = path.join(templatePath, 'template.config.json');
    if (!await fs.pathExists(configPath)) {
      throw new Error('Not a valid custom template');
    }

    // Remove the template directory
    await fs.remove(templatePath);

    spinner.succeed(`Template '${templateName}' removed successfully`);
  } catch (error) {
    spinner.fail('Failed to remove template');
    throw error;
  }
}

/**
 * List all custom templates
 */
export async function listCustomTemplates(): Promise<void> {
  const templates = await getCustomTemplates();

  if (templates.size === 0) {
    Logger.info('No custom templates found.');
    Logger.gray('Add a custom template with: errika add-template <path>');
    return;
  }

  Logger.bold('\n📦 Custom Templates:\n');

  for (const [id, config] of templates) {
    Logger.cyan(`  ${config.name} (${id})`);
    Logger.gray(`    ${config.description}`);
    if (config.extends) {
      Logger.gray(`    Extends: ${config.extends}`);
    }
    if (config.author) {
      Logger.gray(`    Author: ${config.author}`);
    }
    console.log();
  }
}

/**
 * Validate template config schema
 */
export function validateTemplateConfig(config: any): config is TemplateConfig {
  if (!config.name || typeof config.name !== 'string') {
    throw new Error('Template config must have a valid name');
  }

  if (!config.description || typeof config.description !== 'string') {
    throw new Error('Template config must have a valid description');
  }

  if (config.extends && typeof config.extends !== 'string') {
    throw new Error('Template config extends must be a string');
  }

  if (config.customPrompts) {
    if (!Array.isArray(config.customPrompts)) {
      throw new Error('customPrompts must be an array');
    }

    for (const prompt of config.customPrompts) {
      if (!prompt.name || !prompt.type || !prompt.message) {
        throw new Error('Each custom prompt must have name, type, and message');
      }
    }
  }

  if (config.customScripts) {
    if (!Array.isArray(config.customScripts)) {
      throw new Error('customScripts must be an array');
    }

    for (const script of config.customScripts) {
      if (!script.name || !script.command) {
        throw new Error('Each custom script must have name and command');
      }
    }
  }

  return true;
}

/**
 * Get template with inheritance resolved
 */
export async function getResolvedTemplate(templateId: string): Promise<{
  config: TemplateConfig;
  templatePath: string;
  baseTemplatePath?: string;
}> {
  const config = await getCustomTemplateConfig(templateId);
  
  if (!config) {
    // Not a custom template, return built-in template info
    return {
      config: {
        name: templateId,
        description: '',
      },
      templatePath: path.join(__dirname, '../templates', templateId),
    };
  }

  const templatePath = path.join(getCustomTemplatesDir(), templateId);
  let baseTemplatePath: string | undefined;

  if (config.extends) {
    // Template extends another template
    const baseCustomPath = path.join(getCustomTemplatesDir(), config.extends);
    const baseBuiltInPath = path.join(__dirname, '../templates', config.extends);

    if (await fs.pathExists(baseCustomPath)) {
      baseTemplatePath = baseCustomPath;
    } else if (await fs.pathExists(baseBuiltInPath)) {
      baseTemplatePath = baseBuiltInPath;
    } else {
      throw new Error(`Base template '${config.extends}' not found`);
    }
  }

  return {
    config,
    templatePath,
    baseTemplatePath,
  };
}

