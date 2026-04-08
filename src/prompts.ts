import prompts from 'prompts';
import { templateRegistry } from './generators/index';
import { PackageManager } from './utils/packageManager';

export interface PromptAnswers {
  template: string;
  projectName: string;
  packageManager: PackageManager;
  frontendType?: 'nextjs' | 'react' | 'react-native'; // For Turborepo
  initGit?: boolean;
}

/**
 * Project name validation (preserves security validations from original)
 */
function validateProjectName(value: string): string | true {
  if (!value || value.trim().length === 0) {
    return 'Project name is required';
  }
  
  const trimmed = value.trim();
  
  // Allow '.' for current directory
  if (trimmed === '.') {
    return true;
  }
  
  // Prevent reserved names
  const reservedNames = ['node_modules', '.git', '..'];
  if (reservedNames.includes(trimmed)) {
    return `"${trimmed}" is a reserved name and cannot be used`;
  }
  
  // Prevent names starting with dots (except single dot)
  if (trimmed.startsWith('.')) {
    return 'Project name cannot start with a dot';
  }
  
  // Validate characters
  if (!/^[a-zA-Z0-9-_.]+$/.test(trimmed)) {
    return 'Project name can only contain letters, numbers, hyphens, underscores, and dots';
  }
  
  // Prevent consecutive dots (path traversal)
  if (trimmed.includes('..')) {
    return 'Project name cannot contain consecutive dots';
  }
  
  return true;
}

/**
 * Run interactive prompts to gather project configuration
 */
export async function runPrompts(): Promise<PromptAnswers> {
  const templates = templateRegistry.getAllMetadata();
  
  // Load custom templates
  const { getCustomTemplates } = await import('./utils/customTemplates');
  const customTemplates = await getCustomTemplates();
  
  // Combine built-in and custom templates
  const allTemplateChoices = [
    ...templates.map(t => ({
      title: t.name,
      value: t.id,
      description: t.description
    })),
    ...Array.from(customTemplates.entries()).map(([id, config]) => ({
      title: config.name,
      value: id,
      description: config.description
    }))
  ];

  const questions: prompts.PromptObject[] = [
    {
      type: 'select',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: allTemplateChoices,
      initial: 0
    },
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: 'my-app',
      validate: validateProjectName
    },
    {
      type: (prev, values) => {
        // Filter package managers based on template support
        const template = templateRegistry.get(values.template);
        if (template && template.metadata.supportedPackageManagers.length === 1) {
          // Skip if only one option
          return null;
        }
        return 'select';
      },
      name: 'packageManager',
      message: 'Which package manager do you want to use?',
      choices: (prev, values) => {
        const template = templateRegistry.get(values.template);
        const supported = template?.metadata.supportedPackageManagers || ['npm', 'yarn', 'pnpm', 'bun'];
        
        const pmChoices = [
          { title: 'npm', value: 'npm' },
          { title: 'yarn', value: 'yarn' },
          { title: 'pnpm (recommended)', value: 'pnpm' },
          { title: 'bun', value: 'bun' }
        ];
        
        return pmChoices.filter(pm => supported.includes(pm.value as PackageManager));
      },
      initial: (prev, values) => {
        const template = templateRegistry.get(values.template);
        const supported = template?.metadata.supportedPackageManagers || [];
        // Default to pnpm if supported, otherwise first option
        return supported.includes('pnpm') ? 
          supported.indexOf('pnpm') : 0;
      }
    },
    {
      type: (prev, values) => values.template === 'turborepo' ? 'select' : null,
      name: 'frontendType',
      message: 'What type of frontend do you want?',
      choices: [
        { title: 'Next.js (SSR React Framework)', value: 'nextjs' },
        { title: 'React (Vite SPA)', value: 'react' },
        { title: 'React Native (Mobile)', value: 'react-native' }
      ],
      initial: 0
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Initialize a git repository?',
      initial: true
    }
  ];

  const answers = await prompts(questions, {
    onCancel: () => {
      console.log('\n❌ Operation cancelled.');
      process.exit(0);
    }
  });

  // Post-validation (defense in depth)
  if (!answers.projectName || !answers.template) {
    throw new Error('Missing required information. Please provide all required fields.');
  }

  // Auto-select package manager if only one option
  if (!answers.packageManager) {
    const template = templateRegistry.get(answers.template);
    if (template && template.metadata.supportedPackageManagers.length === 1) {
      answers.packageManager = template.metadata.supportedPackageManagers[0];
    } else {
      answers.packageManager = 'pnpm'; // Default fallback
    }
  }

  return {
    template: answers.template,
    projectName: answers.projectName.trim(),
    packageManager: answers.packageManager,
    frontendType: answers.frontendType,
    initGit: answers.initGit !== false // Default to true
  };
}

