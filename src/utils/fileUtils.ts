import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';

/**
 * Validate that the resolved path is within the intended directory (prevent path traversal)
 * Preserves security validation from original implementation
 */
export function validatePath(targetPath: string, basePath: string): void {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedBase = path.resolve(basePath);
  
  if (!resolvedTarget.startsWith(resolvedBase)) {
    throw new Error(`Project path must be within the current directory. Invalid path: ${targetPath}`);
  }
}

/**
 * Recursively copy a directory with optional file filtering
 */
export async function copyDirectory(
  source: string,
  destination: string,
  options?: {
    filter?: (src: string) => boolean;
    overwrite?: boolean;
  }
): Promise<void> {
  await fs.copy(source, destination, {
    overwrite: options?.overwrite ?? true,
    errorOnExist: false,
    filter: options?.filter
  });
}

/**
 * Process a template file by replacing variables using Handlebars
 */
export async function processTemplateFile(
  filePath: string,
  variables: Record<string, any>
): Promise<void> {
  if (!await fs.pathExists(filePath)) {
    return;
  }

  const content = await fs.readFile(filePath, 'utf-8');
  const template = Handlebars.compile(content);
  const processed = template(variables);
  await fs.writeFile(filePath, processed, 'utf-8');
}

/**
 * Process all files in a directory recursively with template variables
 */
export async function processTemplateDirectory(
  directory: string,
  variables: Record<string, any>,
  extensions: string[] = ['.json', '.ts', '.tsx', '.js', '.jsx', '.md', '.html', '.css']
): Promise<void> {
  const files = await fs.readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      await processTemplateDirectory(filePath, variables, extensions);
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        await processTemplateFile(filePath, variables);
      }
    }
  }
}

/**
 * Rename files that need special handling (e.g., .gitignore, .npmrc)
 */
export async function renameSpecialFiles(directory: string): Promise<void> {
  const renames: Record<string, string> = {
    'gitignore': '.gitignore',
    'npmrc': '.npmrc',
    'env.example': '.env.example'
  };

  for (const [oldName, newName] of Object.entries(renames)) {
    const oldPath = path.join(directory, oldName);
    const newPath = path.join(directory, newName);
    
    if (await fs.pathExists(oldPath)) {
      await fs.rename(oldPath, newPath);
    }
  }
}

/**
 * Ensure a directory is empty before proceeding
 */
export async function ensureEmptyDirectory(directory: string): Promise<void> {
  if (await fs.pathExists(directory)) {
    const files = await fs.readdir(directory);
    if (files.length > 0) {
      throw new Error(`Directory "${directory}" is not empty.`);
    }
  } else {
    await fs.ensureDir(directory);
  }
}

/**
 * Check if directory exists and is empty, or create it
 */
export async function prepareDirectory(directory: string, allowNonEmpty: boolean = false): Promise<void> {
  if (await fs.pathExists(directory)) {
    if (!allowNonEmpty) {
      const files = await fs.readdir(directory);
      if (files.length > 0) {
        throw new Error(`Directory "${directory}" is not empty.`);
      }
    }
  } else {
    await fs.ensureDir(directory);
  }
}

