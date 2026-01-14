# Developer Guide - Errika 2.0

A guide for developers who want to understand, contribute to, or extend Errika.

---

## 🏗️ Architecture Overview

Errika 2.0 uses a **generator pattern** with a **template registry system** for extensibility.

### Core Components

```
1. CLI Layer (src/index.ts, src/cli.ts, src/prompts.ts)
   ↓
2. Generator Registry (src/generators/index.ts)
   ↓
3. Base Generator (src/generators/baseGenerator.ts)
   ↓
4. Concrete Generators (turborepoGenerator, nextjsGenerator, etc.)
   ↓
5. Utility Modules (fileUtils, packageManager, gitUtils, logger)
```

---

## 📂 Directory Structure Explained

### `/src` - Source Code
- **`index.ts`** - CLI entry point with shebang
- **`cli.ts`** - Commander.js configuration, imports all generators
- **`prompts.ts`** - Interactive prompt definitions using `prompts` library

### `/src/generators` - Generator Classes
- **`index.ts`** - Template registry and factory function
- **`baseGenerator.ts`** - Abstract base class with lifecycle methods
- **`*Generator.ts`** - Concrete implementations for each template

### `/src/utils` - Shared Utilities
- **`logger.ts`** - Chalk + Ora logging and spinners
- **`packageManager.ts`** - PM detection, validation, and commands
- **`fileUtils.ts`** - File operations with security validations
- **`gitUtils.ts`** - Git initialization and .gitignore generation

### `/src/templates` - Template Files
- **`turborepo/`** - Full Turborepo monorepo
- **`nextjs/`** - Next.js 15 app
- **`express-react/`** - Express + React workspace
- **`discord-bot/`** - Discord.js bot
- **`chrome-extension/`** - Chrome extension with Manifest V3

---

## 🔄 Generator Lifecycle

Every generator follows this lifecycle:

```typescript
1. validate()
   - Validate package manager
   - Check if package manager is installed
   - Validate target directory
   - Template-specific validation

2. copyTemplate()
   - Copy template files to target directory
   - Filter out unwanted files (node_modules, etc.)
   - Rename special files (.gitignore, .env.example)

3. processFiles()
   - Process Handlebars template variables
   - Replace {{projectName}} and other variables
   - Template-specific file processing

4. installDependencies()
   - Run package manager install command
   - Display progress with spinner

5. initGit() [Optional]
   - Initialize git repository
   - Create initial commit

6. postGenerate()
   - Display success message
   - Show next steps
```

---

## 🆕 Adding a New Template

Follow these steps to add a new template:

### 1. Create Template Directory

```bash
mkdir -p src/templates/my-template
# Add your template files
```

### 2. Create Generator Class

```typescript
// src/generators/myTemplateGenerator.ts
import { BaseGenerator, GeneratorOptions, TemplateMetadata } from './baseGenerator';
import { templateRegistry } from './index';
import { Logger } from '../utils/logger';

export class MyTemplateGenerator extends BaseGenerator {
  constructor(options: GeneratorOptions) {
    const metadata: TemplateMetadata = {
      id: 'my-template',
      name: 'My Template',
      description: 'A description of what this template does',
      supportedPackageManagers: ['npm', 'yarn', 'pnpm', 'bun']
    };

    super(options, metadata);
  }

  // Override methods if needed
  protected async validateTemplate(): Promise<void> {
    // Custom validation
  }

  protected displayNextSteps(): void {
    // Custom next steps message
    super.displayNextSteps(); // Call parent if needed
  }
}

// Register the generator
templateRegistry.register({
  metadata: {
    id: 'my-template',
    name: 'My Template',
    description: 'A description of what this template does',
    supportedPackageManagers: ['npm', 'yarn', 'pnpm', 'bun']
  },
  GeneratorClass: MyTemplateGenerator as any
});
```

### 3. Import Generator in CLI

```typescript
// src/cli.ts
import './generators/myTemplateGenerator'; // Add this import
```

### 4. Build and Test

```bash
pnpm build
node dist/index.js
```

Your new template will now appear in the interactive prompt!

---

## 🔧 Utility Functions

### Logger

```typescript
import { Logger } from './utils/logger';

Logger.info('Information message');
Logger.success('Success message');
Logger.error('Error message');
Logger.warning('Warning message');
Logger.cyan('Colored message');

const spinner = Logger.spinner('Loading...');
spinner.succeed('Done!');
spinner.fail('Failed!');
```

### Package Manager

```typescript
import { 
  PackageManager,
  validatePackageManager,
  checkPackageManagerExists,
  detectPackageManager,
  getInstallCommand 
} from './utils/packageManager';

// Validate
validatePackageManager('pnpm'); // throws if invalid

// Check if installed
checkPackageManagerExists('pnpm'); // throws if not found

// Detect from lockfiles
const pm = detectPackageManager(directory); // returns PackageManager | null

// Get command
const cmd = getInstallCommand('pnpm'); // returns 'pnpm install'
```

### File Utils

```typescript
import {
  validatePath,
  copyDirectory,
  processTemplateFile,
  renameSpecialFiles
} from './utils/fileUtils';

// Security validation
validatePath(targetPath, basePath); // throws if path traversal

// Copy directory
await copyDirectory(source, destination, {
  filter: (src) => !src.includes('node_modules')
});

// Process Handlebars template
await processTemplateFile(filePath, { projectName: 'my-app' });

// Rename special files (gitignore → .gitignore)
await renameSpecialFiles(directory);
```

---

## 🧪 Testing

### Manual Testing

```bash
# Build
pnpm build

# Test locally
node dist/index.js

# Test in a test directory
cd /tmp
node /path/to/errika-npm/dist/index.js
```

### Testing a Specific Template

```bash
# You can't skip prompts, but you can test quickly:
node dist/index.js
# Select your template
# Use "test-project" as name
# Select pnpm
# Don't init git (faster)
```

---

## 🔒 Security Considerations

### Path Validation

Always use `validatePath()` before file operations:

```typescript
import { validatePath } from './utils/fileUtils';

validatePath(targetDirectory, process.cwd());
```

### Package Manager Validation

Always validate package managers:

```typescript
import { validatePackageManager, checkPackageManagerExists } from './utils/packageManager';

validatePackageManager(pm); // Runtime validation
checkPackageManagerExists(pm); // Existence check
```

### Input Sanitization

Project names are validated in `prompts.ts`:
- Reserved names blocked
- Path traversal patterns blocked
- Only safe characters allowed

---

## 📝 Code Style

- **TypeScript Strict Mode** - All code uses strict type checking
- **Async/Await** - Prefer async/await over callbacks
- **Error Handling** - Always catch and provide helpful error messages
- **Logging** - Use Logger utilities for consistency
- **Comments** - Document complex logic and security measures

---

## 🚀 Build & Release

### Development

```bash
pnpm build        # Build TypeScript
pnpm dev          # Build and run
```

### Release Process

```bash
# 1. Update version in package.json
# 2. Update CHANGELOG.md
# 3. Build and test
pnpm build

# 4. Commit and push
git add .
git commit -m "Release v2.x.x"
git push

# 5. Create git tag
git tag v2.x.x
git push --tags

# 6. Publish to npm
pnpm publish --access public
```

---

## 🐛 Common Issues

### Template files being compiled by TypeScript

**Problem:** TypeScript tries to compile template files  
**Solution:** Add to `tsconfig.json`:
```json
{
  "exclude": ["src/templates"]
}
```

### Templates not included in npm package

**Problem:** Templates missing after `npm install`  
**Solution:** Add to `package.json`:
```json
{
  "files": ["dist", "src/templates"]
}
```

### Generator not appearing in prompts

**Problem:** New generator doesn't show up  
**Solution:** Import it in `src/cli.ts`:
```typescript
import './generators/myGenerator';
```

---

## 📚 Useful Resources

- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Prompts](https://github.com/terkelg/prompts) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal colors
- [Ora](https://github.com/sindresorhus/ora) - Loading spinners
- [Handlebars](https://handlebarsjs.com/) - Template processing

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

**Areas for contribution:**
- New templates
- Bug fixes
- Documentation improvements
- Performance optimizations
- Additional utility functions

---

**Happy coding! 🎉**

