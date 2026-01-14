# Changelog

All notable changes to Errika will be documented in this file.

## [2.0.0] - 2026-01-14

### 🎉 Major Release - Multi-Template Support

**Errika 2.0** is a complete architectural overhaul, transforming from a single Turborepo generator into a powerful multi-template project generator.

### ✨ Added

#### New Templates
- **Next.js Full-Stack** - Next.js 15 with App Router, Tailwind CSS, and TypeScript
- **Express + React** - Full-stack monorepo with Express.js backend and React frontend
- **Discord Bot** - Discord bot with discord.js v14, slash commands, and event handling
- **Chrome Extension** - Manifest V3 extension with React UI and TypeScript

#### New Architecture
- **Base Generator Pattern** - Abstract class with lifecycle methods for all generators
- **Template Registry System** - Centralized template management and factory pattern
- **Modular Utilities** - Organized utilities for file operations, package management, git, and logging
- **Enhanced Prompts** - Template selection with dynamic package manager filtering

#### New Features
- **Multi-template Support** - 5 professional templates to choose from
- **Template-specific Options** - Custom configuration per template type
- **Package Manager Flexibility** - Support for npm, yarn, pnpm, and bun (template-dependent)
- **Improved UX** - Ora spinners for better progress indication
- **Template Variables** - Handlebars-based template processing
- **Git Integration** - Optional git initialization with initial commit

#### New Dependencies
- `ora@5.4.1` - Loading spinners and progress indicators
- `handlebars@4.7.8` - Template variable processing

### 🔄 Changed

#### Restructured Codebase
- **Before:** Single file at `bin/create-errika.ts` (275 lines)
- **After:** Modular architecture in `src/` directory:
  - `src/index.ts` - CLI entry point
  - `src/cli.ts` - Commander.js integration
  - `src/prompts.ts` - Interactive prompts
  - `src/generators/` - Template generators
  - `src/utils/` - Utility modules
  - `src/templates/` - Template files

#### Refactored Turborepo Generator
- Extracted from monolithic file into `TurborepoGenerator` class
- Maintains all existing functionality
- Improved code organization and maintainability

#### Updated Package Manager Support
- Turborepo: pnpm, bun (unchanged)
- Next.js: npm, yarn, pnpm, bun
- Express+React: pnpm, npm, yarn
- Discord Bot: npm, yarn, pnpm, bun
- Chrome Extension: npm, yarn, pnpm, bun

### 🔒 Security

#### Preserved Security Features
All security validations from v1.x maintained and enhanced:
- ✅ Path traversal prevention (`validatePath`)
- ✅ Package manager validation (`validatePackageManager`)
- ✅ Package manager existence check (`checkPackageManagerExists`)
- ✅ Project name validation (reserved names, regex, dots)
- ✅ Post-prompt validation
- ✅ Defense-in-depth strategy

### 📚 Documentation

- **Enhanced README** - Comprehensive documentation for all 5 templates
- **Template-specific READMEs** - Each template includes detailed setup guides
- **Security Documentation** - Preserved and referenced existing security docs

### 🏗️ Technical Improvements

- **TypeScript Strict Mode** - Enhanced type safety throughout
- **Better Error Handling** - Improved error messages and user guidance
- **Separation of Concerns** - Clean architecture with single responsibility
- **Extensibility** - Easy to add new templates via registry system
- **Build Optimization** - Templates excluded from TypeScript compilation

### 📦 Breaking Changes

- **Entry Point Changed** - `dist/create-errika.js` → `dist/index.js`
- **New Prompt Flow** - Template selection is now the first step
- **API Changes** - Internal APIs completely restructured (external API unchanged)

### 🔧 Migration Guide

For existing users:
1. The CLI interface remains the same: `npx create-errika@latest`
2. First prompt is now template selection instead of project name
3. Turborepo template is first option for backward compatibility
4. All existing Turborepo functionality preserved

---

## [1.1.0] - 2024-12-20

### Added
- Security enhancements (path traversal prevention, package manager validation)
- Enhanced project name validation
- Improved error handling and user messages

### Changed
- Better security documentation
- Improved validation flow

---

## [1.0.0] - Initial Release

### Added
- Turborepo monorepo template
- Next.js, React, and React Native frontend options
- HTTP and WebSocket backends
- Shared packages (UI, ESLint, TypeScript configs)
- Interactive CLI with prompts
- Package manager support (pnpm, bun)

---

## Version History

- **2.0.0** - Multi-template generator with 5 templates
- **1.1.0** - Security enhancements
- **1.0.0** - Initial Turborepo generator

