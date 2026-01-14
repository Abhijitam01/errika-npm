# Template Validation System

This document describes the template validation system in the Errika project.

## Overview

The validation system ensures all templates are correctly structured, secure, and follow best practices before being published. It performs comprehensive checks on templates including:

- Directory structure validation
- Required files presence
- Configuration file validity
- Security checks (sensitive data scanning)
- Placeholder validation
- .gitignore completeness

## Usage

### Validate a Specific Template

```bash
errika validate <template-name>
```

Example:
```bash
errika validate nextjs
```

Valid template names:
- `turborepo`
- `nextjs`
- `express-react`
- `discord-bot`
- `chrome-extension`

### Validate All Templates

```bash
errika validate --all
# or simply
errika validate
```

### Pre-Publish Validation

The validation runs automatically before NPM publish:

```bash
npm run validate
```

This is configured in `package.json` as a `prepublishOnly` script.

## Validation Checks

### 1. Directory Structure Check

Validates that the template directory exists and is accessible.

**Errors:**
- Template directory does not exist

### 2. Required Files Check

Ensures all required files are present in the template.

**Common Required Files:**
- `package.json` - Package configuration
- `README.md` - Documentation
- `gitignore` - Git ignore file

**Template-Specific Files:**

**Next.js:**
- `next.config.js`
- `tsconfig.json`
- `tailwind.config.ts`
- `app/layout.tsx`
- `app/page.tsx`

**Turborepo:**
- `turbo.json`
- `pnpm-workspace.yaml`

**Express-React:**
- `backend/package.json`
- `frontend/package.json`
- `backend/tsconfig.json`
- `frontend/tsconfig.json`

**Discord Bot:**
- `tsconfig.json`
- `src/index.ts`

**Chrome Extension:**
- `tsconfig.json`
- `vite.config.ts`
- `public/manifest.json`

**Errors:**
- Required file missing

**Warnings:**
- Optional file missing

### 3. Configuration Files Check

Validates the structure and content of configuration files.

#### package.json Validation

**Errors:**
- File is missing
- Invalid JSON syntax
- Missing required fields: `name`, `version`

**Warnings:**
- Missing recommended fields: `description`, `scripts`
- Missing recommended scripts: `dev`, `build`
- Placeholder values present (expected behavior)

#### tsconfig.json Validation

**Warnings:**
- File not found (may not use TypeScript)
- Non-standard JSON (TypeScript allows trailing commas)
- Missing recommended compiler options:
  - `strict`
  - `esModuleInterop`
  - `skipLibCheck`
  - `forceConsistentCasingInFileNames`
- Missing `target` or `module` configuration

#### env.example Validation

**Warnings:**
- Incorrect key format (should be UPPERCASE_WITH_UNDERSCORES)
- Line doesn't follow KEY=value format
- Potential real sensitive data detected

#### Framework-Specific Config Validation

- **Next.js:** Validates `next.config.js` exports configuration
- **Vite:** Validates `vite.config.ts` uses `defineConfig`

### 4. Gitignore Check

Validates that `.gitignore` has all necessary entries.

**Errors:**
- File is missing
- Essential entries missing:
  - `node_modules`
  - `.env`

**Warnings:**
- Recommended entries missing:
  - `dist` or `build` (build outputs)

### 5. Placeholders Check

Validates placeholders used in template files.

**Valid Placeholders:**
- `{{projectName}}`
- `{{PROJECT_NAME}}`
- `{{description}}`
- `{{author}}`
- `{{frontendType}}`

**Warnings:**
- Unknown placeholder detected

### 6. Sensitive Data Check

Scans template files for potential sensitive data leaks.

**Patterns Detected:**
- API Keys (`api_key`, `apikey`)
- Secret Keys (`secret_key`, `secretkey`)
- Passwords (`password`)
- Tokens (`token`, `bearer`)
- OpenAI API Keys (`sk-...`)
- Google API Keys (`AIza...`)
- AWS Access Keys (`aws_access_key_id`)

**Excluded from Scanning:**
- Comments (inline and block)
- Placeholder values (containing `your_`, `example`, `xxx`, etc.)
- URLs and localhost references
- Common database connection strings

**Errors:**
- Potential sensitive data found in file

### 7. File Structure Check

Validates the overall file structure.

**Warnings:**
- Common directories not found (e.g., `src`)
- Empty directories detected

## Validation Results

### Exit Codes

- `0` - Validation passed
- `1` - Validation failed (has errors)

### Output Format

```
🔍 Validating template: <template-name>

[Running checks...]

✅ Template validation passed!
(or)
❌ Template validation failed!

Files checked: <count>
Placeholders found: <count>

❌ Errors (<count>):
  • Error message 1
  • Error message 2

⚠️  Warnings (<count>):
  • Warning message 1
  • Warning message 2
```

### Summary Output (All Templates)

```
📊 Validation Summary:

✅ turborepo: 0 errors, 6 warnings
✅ nextjs: 0 errors, 5 warnings
❌ express-react: 1 errors, 4 warnings
✅ discord-bot: 0 errors, 2 warnings
✅ chrome-extension: 0 errors, 5 warnings

Total: 4/5 templates valid
Total errors: 1
Total warnings: 22
```

## Architecture

### Core Components

#### `TemplateValidator`
Main validator class that orchestrates all validation checks.

**Methods:**
- `validate()` - Run all validation checks on a template
- `validateAllTemplates()` - Validate all available templates
- `printResults()` - Display validation results
- `printAllResults()` - Display summary of all template validations

#### `FileValidator`
Handles file-related validation.

**Methods:**
- `validateRequiredFiles()` - Check for required files
- `validateGitignore()` - Validate .gitignore completeness
- `scanForSensitiveData()` - Scan for sensitive data leaks
- `validateFileStructure()` - Check file structure

#### `ConfigValidator`
Handles configuration file validation.

**Methods:**
- `validatePackageJson()` - Validate package.json
- `validateTypeScriptConfig()` - Validate tsconfig.json
- `validateEnvExample()` - Validate env.example
- `validateNextConfig()` - Validate next.config.js
- `validateViteConfig()` - Validate vite.config.ts
- `validateAllConfigs()` - Run all config validations

### File Structure

```
src/
├── validators/
│   ├── index.ts                  # Exports
│   ├── templateValidator.ts      # Main validator
│   ├── fileValidator.ts          # File validation
│   └── configValidator.ts        # Config validation
├── scripts/
│   └── validate-templates.ts     # Pre-publish script
└── cli.ts                        # CLI with validate command
```

## Extending the Validation System

### Adding a New Template

1. Create the template in `src/templates/<template-name>/`
2. Add template-specific required files in `getTemplateSpecificFiles()` method in `templateValidator.ts`
3. Add the template name to the `validTemplates` array in CLI
4. Run validation to ensure it passes

### Adding a New Validation Check

1. Create a new validation method in the appropriate validator class
2. Add the check to the `validate()` method in `TemplateValidator`
3. Return a result object with `valid`, `errors`, and `warnings` properties
4. Update this documentation

### Adding a New Configuration Validator

1. Add a new method to `ConfigValidator`
2. Follow the pattern of existing validators
3. Call it from `validateAllConfigs()` if it should run for all templates
4. Update this documentation

## Best Practices

### For Template Authors

1. **Always include required files**
   - package.json with name and version
   - README.md with clear documentation
   - gitignore with essential entries

2. **Use valid placeholders**
   - Stick to the standard placeholder format: `{{variableName}}`
   - Only use approved placeholders

3. **Keep templates secure**
   - Never commit real API keys or tokens
   - Use placeholder values in env.example
   - Add sensitive file patterns to .gitignore

4. **Follow configuration best practices**
   - Use TypeScript strict mode
   - Include recommended compiler options
   - Provide meaningful package.json metadata

5. **Test before committing**
   - Run `errika validate <template-name>` before committing
   - Address all errors
   - Consider addressing warnings for better quality

### For Validator Developers

1. **Prefer warnings over errors**
   - Only use errors for critical issues that prevent template usage
   - Use warnings for style and best practice issues

2. **Provide clear error messages**
   - Include file path and line number when applicable
   - Explain what's wrong and how to fix it

3. **Minimize false positives**
   - Check for common patterns before flagging issues
   - Consider context (comments, placeholders, etc.)

4. **Keep validation fast**
   - Use efficient file scanning
   - Skip unnecessary directories (node_modules, build outputs)

## Troubleshooting

### Validation Takes Too Long

- Ensure you're not scanning node_modules or build directories
- Check for very large files in templates
- Consider optimizing regex patterns

### False Positives in Sensitive Data Scan

- Add the pattern to the exclusion list in `scanForSensitiveData()`
- Ensure comments are properly handled
- Check if placeholder patterns are recognized

### Template-Specific Validation Failing

- Verify the template structure matches expected layout
- Check that required files have correct names and locations
- Review configuration file syntax

## Future Enhancements

Potential improvements to the validation system:

1. **Performance Optimization**
   - Parallel validation of multiple templates
   - Caching of validation results

2. **Enhanced Checks**
   - Dependency version validation
   - License file validation
   - Code quality checks (linting)
   - Package size validation

3. **Custom Validation Rules**
   - Allow templates to define custom validation rules
   - Plugin system for extending validators

4. **Better Reporting**
   - HTML/JSON output formats
   - Integration with CI/CD systems
   - Validation badges

5. **Auto-fixing**
   - Automatic correction of common issues
   - Interactive fixing prompts

## Contributing

When contributing to the validation system:

1. Write tests for new validators
2. Update this documentation
3. Follow existing patterns and naming conventions
4. Ensure all templates pass validation
5. Consider backward compatibility

## License

Part of the Errika project - see main LICENSE file.

