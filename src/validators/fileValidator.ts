import fs from 'fs-extra';
import path from 'path';
import { Logger } from '../utils/logger';

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface RequiredFile {
  path: string;
  description: string;
  optional?: boolean;
}

export class FileValidator {
  /**
   * Validate that required files exist in the template
   */
  static async validateRequiredFiles(
    templateDir: string,
    requiredFiles: RequiredFile[]
  ): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    for (const file of requiredFiles) {
      const filePath = path.join(templateDir, file.path);
      const exists = await fs.pathExists(filePath);

      if (!exists) {
        if (file.optional) {
          result.warnings.push(
            `Optional file missing: ${file.path} - ${file.description}`
          );
        } else {
          result.valid = false;
          result.errors.push(
            `Required file missing: ${file.path} - ${file.description}`
          );
        }
      }
    }

    return result;
  }

  /**
   * Validate .gitignore file has necessary entries
   */
  static async validateGitignore(templateDir: string): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    const gitignorePath = path.join(templateDir, 'gitignore');
    const exists = await fs.pathExists(gitignorePath);

    if (!exists) {
      result.valid = false;
      result.errors.push('.gitignore file is missing');
      return result;
    }

    try {
      const content = await fs.readFile(gitignorePath, 'utf-8');
      const lines = content.split('\n').map(line => line.trim());

      // Essential entries that should be in every .gitignore
      const essentialEntries = [
        { pattern: 'node_modules', description: 'Node modules directory' },
        { pattern: '.env', description: 'Environment variables' },
        { pattern: 'dist', description: 'Build output', optional: true },
        { pattern: 'build', description: 'Build output', optional: true }
      ];

      for (const entry of essentialEntries) {
        const hasEntry = lines.some(line => 
          line === entry.pattern || 
          line.includes(entry.pattern)
        );

        if (!hasEntry) {
          if (entry.optional) {
            result.warnings.push(
              `Recommended .gitignore entry missing: ${entry.pattern} (${entry.description})`
            );
          } else {
            result.valid = false;
            result.errors.push(
              `Essential .gitignore entry missing: ${entry.pattern} (${entry.description})`
            );
          }
        }
      }
    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to read .gitignore: ${error}`);
    }

    return result;
  }

  /**
   * Scan for sensitive data in template files
   */
  static async scanForSensitiveData(templateDir: string): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    // Patterns that might indicate sensitive data
    const sensitivePatterns = [
      { regex: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi, name: 'API Key' },
      { regex: /secret[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Secret Key' },
      { regex: /password\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Password' },
      { regex: /token\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Token' },
      { regex: /bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, name: 'Bearer Token' },
      { regex: /sk-[a-zA-Z0-9]{32,}/g, name: 'OpenAI API Key' },
      { regex: /AIza[0-9A-Za-z\\-_]{35}/g, name: 'Google API Key' },
      { regex: /aws[_-]?access[_-]?key[_-]?id\s*[:=]\s*['"][^'"]+['"]/gi, name: 'AWS Access Key' }
    ];

    // Files to skip
    const skipPatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.turbo',
      '.next',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock'
    ];

    async function scanDirectory(dir: string): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(templateDir, fullPath);

        // Skip excluded patterns
        if (skipPatterns.some(pattern => relativePath.includes(pattern))) {
          continue;
        }

        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.isFile()) {
          // Only scan text files
          const ext = path.extname(entry.name).toLowerCase();
          const textExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.env', '.md', '.txt', '.yml', '.yaml', '.toml'];
          
          if (textExtensions.includes(ext) || entry.name.startsWith('.env')) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              const lines = content.split('\n');
              
              for (let lineNum = 0; lineNum < lines.length; lineNum++) {
                const line = lines[lineNum];
                
                // Skip full-line comments
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || 
                    trimmedLine.startsWith('/*') || trimmedLine.startsWith('#')) {
                  continue;
                }
                
                // Remove inline comments for scanning
                const lineWithoutComments = line.split('//')[0].split('#')[0];
                
                for (const pattern of sensitivePatterns) {
                  const matches = lineWithoutComments.match(pattern.regex);
                  if (matches) {
                    // Check if it's just a placeholder or example
                    const isPlaceholder = matches.some(match => 
                      match.includes('your_') ||
                      match.includes('YOUR_') ||
                      match.includes('{{') ||
                      match.includes('xxx') ||
                      match.includes('...') ||
                      match.includes('example') ||
                      match.includes('placeholder')
                    );

                    if (!isPlaceholder) {
                      result.valid = false;
                      result.errors.push(
                        `Potential ${pattern.name} found in ${relativePath}:${lineNum + 1}: ${matches[0].substring(0, 50)}...`
                      );
                    }
                  }
                }
              }
            } catch (error) {
              // Skip files that can't be read as text
            }
          }
        }
      }
    }

    try {
      await scanDirectory(templateDir);
    } catch (error) {
      result.errors.push(`Error scanning for sensitive data: ${error}`);
      result.valid = false;
    }

    return result;
  }

  /**
   * Check for common file structure issues
   */
  static async validateFileStructure(templateDir: string): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    // Check for common directories
    const commonDirs = ['src'];
    for (const dir of commonDirs) {
      const dirPath = path.join(templateDir, dir);
      const exists = await fs.pathExists(dirPath);
      if (!exists) {
        result.warnings.push(`Common directory not found: ${dir}`);
      }
    }

    // Check for empty directories
    async function checkEmptyDirs(dir: string): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      if (entries.length === 0) {
        const relativePath = path.relative(templateDir, dir);
        result.warnings.push(`Empty directory found: ${relativePath}`);
      }

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const fullPath = path.join(dir, entry.name);
          await checkEmptyDirs(fullPath);
        }
      }
    }

    try {
      await checkEmptyDirs(templateDir);
    } catch (error) {
      // Ignore errors for this check
    }

    return result;
  }
}

