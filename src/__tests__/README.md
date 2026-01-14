# Errika Test Suite

Comprehensive test suite for the Errika project generator CLI.

## Overview

This test suite provides extensive coverage for all aspects of Errika, including:
- Unit tests for utility modules and generator classes
- Integration tests for full project generation
- Error handling and edge case tests
- Template placeholder replacement tests
- Cross-platform compatibility tests

## Test Structure

```
__tests__/
├── unit/                      # Unit tests
│   ├── generators/           # Tests for each generator class
│   │   ├── baseGenerator.test.ts
│   │   ├── nextjsGenerator.test.ts
│   │   ├── expressReactGenerator.test.ts
│   │   ├── discordBotGenerator.test.ts
│   │   ├── chromeExtGenerator.test.ts
│   │   └── turborepoGenerator.test.ts
│   └── utils/                # Tests for utility modules
│       ├── fileUtils.test.ts
│       ├── packageManager.test.ts
│       └── gitUtils.test.ts
├── integration/              # Integration tests
│   ├── projectGeneration.test.ts
│   ├── errorHandling.test.ts
│   ├── placeholderReplacement.test.ts
│   └── crossPlatform.test.ts
├── helpers/                  # Test helpers and mocks
│   ├── mockLogger.ts
│   └── mockExecSync.ts
├── setup.ts                  # Test setup and utilities
└── README.md                 # This file
```

## Running Tests

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode
```bash
pnpm test:watch
```

### Run unit tests only
```bash
pnpm test:unit
```

### Run integration tests only
```bash
pnpm test:integration
```

### Generate coverage report
```bash
pnpm test:coverage
```

The coverage report will be generated in the `coverage/` directory and includes:
- HTML report: `coverage/index.html`
- JSON report: `coverage/coverage-final.json`
- LCOV report: `coverage/lcov.info`

## Test Categories

### Unit Tests

#### Generator Tests
- **baseGenerator.test.ts**: Tests the abstract base generator class
  - Constructor initialization
  - Template validation
  - File copying and processing
  - Dependency installation
  - Git initialization
  - Error handling

- **Individual Generator Tests**: Tests for each specific generator
  - Metadata validation
  - Package manager compatibility
  - Template-specific features

#### Utility Tests
- **fileUtils.test.ts**: File operation utilities
  - Path validation and security
  - Directory copying with filters
  - Template file processing
  - Special file renaming
  - Directory preparation

- **packageManager.test.ts**: Package manager utilities
  - Package manager validation
  - Installation detection
  - Command generation
  - Cross-platform compatibility

- **gitUtils.test.ts**: Git operations
  - Repository initialization
  - .gitignore creation
  - Commit handling

### Integration Tests

#### Project Generation Tests
- Full end-to-end project generation
- Tests for all template types:
  - Next.js applications
  - Express + React monorepos
  - Discord bots
  - Chrome extensions
  - Turborepo monorepos
- Multiple project generation scenarios
- Dependency installation flows
- Git repository setup

#### Error Handling Tests
- Directory validation errors
- Package manager validation
- Dependency installation failures
- Git initialization failures
- Template file issues
- Special character handling
- Permission errors
- Concurrent operation handling

#### Placeholder Replacement Tests
- Basic variable replacement
- Nested directory processing
- Complex template variables
- Special characters in values
- File extension filtering
- Unicode and international characters
- Edge cases and empty values

#### Cross-Platform Tests
- Windows, macOS, and Linux compatibility
- Path handling across platforms
- Command execution with correct shells
- Line ending handling
- File system operations
- Package manager detection
- Special directory names
- Path length limitations

## Coverage Goals

Current coverage thresholds:
- Lines: 70%
- Functions: 70%
- Branches: 60%
- Statements: 70%

## Writing New Tests

### Test File Naming
- Unit tests: `<module>.test.ts`
- Integration tests: Descriptive names like `projectGeneration.test.ts`

### Test Structure
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(async () => {
    // Setup code
  });

  afterEach(async () => {
    // Cleanup code
  });

  describe('Sub-feature', () => {
    it('should do something specific', async () => {
      // Arrange
      const input = 'test';

      // Act
      const result = doSomething(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Using Test Helpers

#### Creating Temporary Directories
```typescript
import { createTempDir, cleanupTempDir } from '../setup';

const tempDir = await createTempDir('test-prefix-');
// Use tempDir...
await cleanupTempDir(tempDir);
```

#### Creating Mock Templates
```typescript
import { createMockTemplate } from '../setup';

const templateDir = await createMockTemplate('nextjs');
// Use templateDir...
await cleanupTempDir(templateDir);
```

#### Using Mock Logger
```typescript
import { mockLogger, resetMockLogger } from '../helpers/mockLogger';

// Logger is automatically mocked
// Reset between tests if needed
resetMockLogger();
```

## Continuous Integration

Tests are designed to run in CI environments:
- No user interaction required
- Temporary directories are cleaned up
- Platform-specific tests are handled gracefully
- Mocked external commands (git, npm, etc.)

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up temporary files and directories
3. **Mocking**: Mock external commands and file system operations when appropriate
4. **Descriptive Names**: Use clear, descriptive test names
5. **Assertions**: Include meaningful assertion messages
6. **Coverage**: Aim for high coverage but prioritize meaningful tests
7. **Performance**: Keep tests fast by mocking slow operations

## Debugging Tests

### Run a specific test file
```bash
pnpm vitest run path/to/test.ts
```

### Run a specific test by name
```bash
pnpm vitest run -t "test name pattern"
```

### Debug with VS Code
Add a breakpoint and use the VS Code debugger with the provided launch configuration.

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update this README if adding new test categories

## Known Issues

- Some cross-platform tests may behave differently on different operating systems
- Symlink tests are skipped on Windows
- Long path tests have different behaviors on Windows vs Unix

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Node.js fs-extra](https://github.com/jprichardson/node-fs-extra)
- [Handlebars Templates](https://handlebarsjs.com/)

