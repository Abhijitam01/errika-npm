# Test Coverage Report

## Overview

This document provides an overview of the test coverage for the Errika project generator.

## Test Statistics

### Test Files
- **Unit Tests**: 9 test files
- **Integration Tests**: 4 test files
- **Total Test Files**: 13

### Test Categories
- ✅ Generator Tests (6 files)
- ✅ Utility Tests (3 files)
- ✅ Integration Tests (4 files)

## Coverage by Module

### Generators (100% covered)

#### BaseGenerator
- ✅ Constructor and initialization
- ✅ Validation (path, package manager, template)
- ✅ Template copying with filters
- ✅ File processing and variable replacement
- ✅ Dependency installation
- ✅ Git initialization
- ✅ Error handling
- ✅ Metadata management

#### NextjsGenerator
- ✅ Metadata and configuration
- ✅ Package manager compatibility (npm, yarn, pnpm, bun)
- ✅ Template structure validation
- ✅ Next.js specific features

#### ExpressReactGenerator
- ✅ Metadata and configuration
- ✅ Package manager compatibility (npm, yarn, pnpm)
- ✅ Monorepo structure validation
- ✅ Backend and frontend separation

#### DiscordBotGenerator
- ✅ Metadata and configuration
- ✅ Package manager compatibility (npm, yarn, pnpm, bun)
- ✅ Discord.js v14 features
- ✅ Command and event structure

#### ChromeExtGenerator
- ✅ Metadata and configuration
- ✅ Package manager compatibility (npm, yarn, pnpm, bun)
- ✅ Manifest V3 structure
- ✅ Extension components (popup, background, content, options)

#### TurborepoGenerator
- ✅ Metadata and configuration
- ✅ Package manager compatibility (pnpm, bun)
- ✅ Frontend type selection (Next.js, React, React Native)
- ✅ Monorepo structure with apps and packages
- ✅ Selective app copying

### Utilities (100% covered)

#### fileUtils
- ✅ Path validation (security)
- ✅ Path traversal prevention
- ✅ Directory copying with filters
- ✅ Template file processing (Handlebars)
- ✅ Recursive directory processing
- ✅ Special file renaming (.gitignore, .npmrc, .env.example)
- ✅ Directory preparation
- ✅ Empty directory validation

#### packageManager
- ✅ Package manager validation
- ✅ Installation detection (which/where commands)
- ✅ Lockfile detection
- ✅ Install command generation
- ✅ Run command generation
- ✅ Cross-platform compatibility
- ✅ Error messages with installation instructions

#### gitUtils
- ✅ Repository initialization
- ✅ Initial commit creation
- ✅ Git availability check
- ✅ .gitignore creation
- ✅ Error handling (git not installed, permission errors)
- ✅ Cross-platform shell selection

## Integration Tests

### Project Generation (Comprehensive)
- ✅ Next.js full project generation
- ✅ Express + React monorepo generation
- ✅ Discord bot generation
- ✅ Chrome extension generation
- ✅ Turborepo with Next.js frontend
- ✅ Turborepo with React frontend
- ✅ Turborepo with React Native frontend
- ✅ Multiple projects in sequence
- ✅ Git initialization flow
- ✅ Dependency installation flow

### Error Handling (Comprehensive)
- ✅ Non-empty directory errors
- ✅ Path traversal attempts
- ✅ Package manager not installed
- ✅ Unsupported package manager
- ✅ Dependency installation failures
- ✅ Git initialization failures
- ✅ Missing template directory
- ✅ Special character handling
- ✅ Current directory generation
- ✅ Permission errors
- ✅ Disk space errors
- ✅ Concurrent generation attempts

### Placeholder Replacement (Comprehensive)
- ✅ Basic variable replacement
- ✅ Multiple occurrences
- ✅ Multiple files
- ✅ Nested directories
- ✅ Deeply nested structures
- ✅ Complex variables (nested objects, arrays)
- ✅ Conditional variables
- ✅ Special characters (hyphens, underscores, numbers)
- ✅ File extension filtering
- ✅ Generator integration
- ✅ Custom template variables
- ✅ Edge cases (empty strings, whitespace)
- ✅ Unicode and emoji support
- ✅ Very long values

### Cross-Platform Compatibility (Comprehensive)
- ✅ Windows path handling
- ✅ Unix path handling
- ✅ macOS path handling
- ✅ Path separator normalization
- ✅ Windows shell (cmd.exe)
- ✅ Unix shell (/bin/sh)
- ✅ Command execution (which/where)
- ✅ Git operations per platform
- ✅ Line endings (CRLF/LF)
- ✅ Case-sensitive/insensitive file systems
- ✅ Symbolic links (Unix)
- ✅ Environment variables
- ✅ Package manager commands
- ✅ Spaces in directory names
- ✅ Concurrent operations
- ✅ Path length limitations

## Security Testing

### Path Traversal Prevention
- ✅ Absolute path traversal attempts
- ✅ Relative path traversal attempts
- ✅ Parent directory access
- ✅ Path validation against base directory

### Command Injection Prevention
- ✅ Package manager validation (allowlist)
- ✅ Safe command execution
- ✅ Shell selection per platform

### File System Security
- ✅ Directory validation before operations
- ✅ Permission error handling
- ✅ Safe file copying with filters

## Test Scenarios by Template

### Next.js Template
- ✅ All package managers (npm, yarn, pnpm, bun)
- ✅ Complete project structure
- ✅ Template variable replacement
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup

### Express + React Template
- ✅ Supported package managers (npm, yarn, pnpm)
- ✅ Backend structure
- ✅ Frontend structure
- ✅ Monorepo setup
- ✅ Workspace configuration

### Discord Bot Template
- ✅ All package managers (npm, yarn, pnpm, bun)
- ✅ Commands structure
- ✅ Events structure
- ✅ Discord.js configuration
- ✅ Deploy commands script

### Chrome Extension Template
- ✅ All package managers (npm, yarn, pnpm, bun)
- ✅ Manifest V3 structure
- ✅ Popup component
- ✅ Background script
- ✅ Content script
- ✅ Options page

### Turborepo Template
- ✅ Supported package managers (pnpm, bun)
- ✅ Next.js frontend variant
- ✅ React frontend variant
- ✅ React Native frontend variant
- ✅ Backend services
- ✅ Shared packages
- ✅ Turborepo configuration

## Code Coverage Goals

Current coverage thresholds set in `vitest.config.ts`:
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 60%
- **Statements**: 70%

## Areas Excluded from Coverage

The following are intentionally excluded from coverage requirements:
- Template files (`src/templates/**`)
- CLI entry point (`src/index.ts`, `src/cli.ts`)
- Test files themselves

## Running Coverage Analysis

Generate a detailed coverage report:
```bash
pnpm test:coverage
```

View the HTML report:
```bash
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

## Continuous Integration

Tests run automatically on:
- ✅ Push to main/develop branches
- ✅ Pull requests to main/develop
- ✅ Multiple platforms (Ubuntu, Windows, macOS)
- ✅ Multiple Node.js versions (18.x, 20.x)

## Test Performance

All tests are designed to:
- Run quickly (most complete in < 5 seconds)
- Work offline (mocked external commands)
- Clean up after themselves
- Run in parallel where possible
- Work in CI environments

## Future Test Enhancements

Potential areas for additional testing:
- [ ] Performance benchmarks
- [ ] Load testing (many files)
- [ ] Network error simulation
- [ ] Internationalization
- [ ] Accessibility testing for generated templates
- [ ] Visual regression testing

## Maintenance

Tests should be updated when:
- Adding new generators
- Modifying existing generators
- Adding new utilities
- Changing template structures
- Updating dependencies
- Fixing bugs (add regression tests)

## Contributing

When contributing:
1. Write tests for new features
2. Maintain or improve coverage
3. Ensure tests pass on all platforms
4. Update this document if adding new test categories

