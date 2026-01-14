# Errika Testing Guide

Complete guide for testing the Errika project generator.

## Table of Contents
- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Test Organization](#test-organization)
- [Writing Tests](#writing-tests)
- [Debugging Tests](#debugging-tests)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Quick Start

### Install Dependencies
```bash
pnpm install
```

### Run All Tests
```bash
pnpm test
```

### Watch Mode (Recommended for Development)
```bash
pnpm test:watch
```

## Running Tests

### All Tests
```bash
pnpm test
```
Runs all unit and integration tests once.

### Unit Tests Only
```bash
pnpm test:unit
```
Runs only unit tests (faster, good for TDD).

### Integration Tests Only
```bash
pnpm test:integration
```
Runs only integration tests (slower, validates full workflows).

### Watch Mode
```bash
pnpm test:watch
```
Runs tests in watch mode. Tests automatically re-run when files change.

### Coverage Report
```bash
pnpm test:coverage
```
Generates a detailed coverage report in the `coverage/` directory.

**View HTML Report:**
```bash
# macOS
open coverage/index.html

# Linux
xdg-open coverage/index.html

# Windows
start coverage/index.html
```

### Run Specific Test File
```bash
pnpm vitest run src/__tests__/unit/utils/fileUtils.test.ts
```

### Run Tests Matching a Pattern
```bash
pnpm vitest run -t "should replace projectName"
```

### Run Tests for a Specific Suite
```bash
pnpm vitest run -t "fileUtils"
```

## Test Organization

```
src/__tests__/
├── unit/                           # Unit tests (fast, isolated)
│   ├── generators/                # Generator class tests
│   │   ├── baseGenerator.test.ts
│   │   ├── nextjsGenerator.test.ts
│   │   ├── expressReactGenerator.test.ts
│   │   ├── discordBotGenerator.test.ts
│   │   ├── chromeExtGenerator.test.ts
│   │   └── turborepoGenerator.test.ts
│   └── utils/                     # Utility function tests
│       ├── fileUtils.test.ts
│       ├── packageManager.test.ts
│       └── gitUtils.test.ts
│
├── integration/                    # Integration tests (slower, realistic)
│   ├── projectGeneration.test.ts  # Full project generation flows
│   ├── errorHandling.test.ts      # Error scenarios
│   ├── placeholderReplacement.test.ts  # Template processing
│   └── crossPlatform.test.ts      # Cross-platform compatibility
│
├── helpers/                        # Test utilities
│   ├── mockLogger.ts              # Mock logger for tests
│   └── mockExecSync.ts            # Mock command execution
│
├── setup.ts                        # Test setup and helpers
└── README.md                       # Test documentation
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Feature Name', () => {
  // Setup runs before each test
  beforeEach(async () => {
    // Initialize test data
    // Create temp directories
    // Mock dependencies
  });

  // Cleanup runs after each test
  afterEach(async () => {
    // Clean up temp files
    // Reset mocks
  });

  describe('Specific functionality', () => {
    it('should do something specific', async () => {
      // Arrange: Set up test data
      const input = 'test-input';

      // Act: Execute the code
      const result = doSomething(input);

      // Assert: Verify the result
      expect(result).toBe('expected-output');
    });
  });
});
```

### Using Test Helpers

#### Creating Temporary Directories
```typescript
import { createTempDir, cleanupTempDir } from '../setup';

const tempDir = await createTempDir('my-test-');
// Use tempDir for testing...
await cleanupTempDir(tempDir);
```

#### Creating Mock Templates
```typescript
import { createMockTemplate } from '../setup';

const templateDir = await createMockTemplate('nextjs');
// Use templateDir in generator tests...
await cleanupTempDir(templateDir);
```

#### Mocking execSync
```typescript
import { vi } from 'vitest';
import { execSync } from 'child_process';

vi.mock('child_process');

// Mock successful execution
vi.mocked(execSync).mockReturnValue(Buffer.from('success'));

// Mock failure
vi.mocked(execSync).mockImplementation(() => {
  throw new Error('Command failed');
});
```

#### Mocking Logger
```typescript
import { mockLogger, resetMockLogger } from '../helpers/mockLogger';

// Logger is automatically mocked in tests
// Reset between tests if needed
beforeEach(() => {
  resetMockLogger();
});
```

### Testing Async Code
```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

### Testing Errors
```typescript
it('should throw error for invalid input', async () => {
  await expect(functionThatThrows()).rejects.toThrow('Error message');
});

it('should handle errors gracefully', () => {
  expect(() => functionThatThrows()).toThrow('Error message');
});
```

### Testing with File System
```typescript
import fs from 'fs-extra';
import path from 'path';

it('should create file', async () => {
  const filePath = path.join(tempDir, 'test.txt');
  await fs.writeFile(filePath, 'content');
  
  expect(await fs.pathExists(filePath)).toBe(true);
  const content = await fs.readFile(filePath, 'utf-8');
  expect(content).toBe('content');
});
```

### Parameterized Tests
```typescript
describe('package manager compatibility', () => {
  const packageManagers = ['npm', 'yarn', 'pnpm', 'bun'] as const;

  packageManagers.forEach(pm => {
    it(`should work with ${pm}`, () => {
      const generator = new NextjsGenerator({
        projectName: 'test',
        targetDirectory: tempDir,
        packageManager: pm
      });
      
      expect(generator.getMetadata().supportedPackageManagers).toContain(pm);
    });
  });
});
```

## Debugging Tests

### Using Console Output
```typescript
it('should debug test', () => {
  console.log('Debug info:', variable);
  expect(variable).toBe('expected');
});
```

### Using Vitest UI
```bash
pnpm vitest --ui
```
Opens a browser interface for running and debugging tests.

### VS Code Debugging

1. Set a breakpoint in your test file
2. Run test in debug mode using VS Code's built-in test runner
3. Step through code and inspect variables

### Isolating Tests

Focus on a single test:
```typescript
it.only('should run only this test', () => {
  // Only this test will run
});
```

Skip a test:
```typescript
it.skip('should skip this test', () => {
  // This test will be skipped
});
```

### Increasing Timeout

For slow tests:
```typescript
it('should handle long operation', async () => {
  // Test code...
}, 30000); // 30 second timeout
```

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

### Platforms Tested
- Ubuntu Latest (Node 18, 20)
- Windows Latest (Node 18, 20)
- macOS Latest (Node 18, 20)

### CI Commands
```bash
# In CI environment
pnpm install
pnpm build
pnpm test:unit
pnpm test:integration
pnpm test:coverage
```

### Coverage Reports
Coverage reports are uploaded to Codecov for pull requests.

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use `beforeEach` and `afterEach` for setup/cleanup
- Don't rely on test execution order

### 2. Clear Test Names
```typescript
// ❌ Bad
it('works', () => { /* ... */ });

// ✅ Good
it('should generate Next.js project with correct package.json', () => { /* ... */ });
```

### 3. Arrange-Act-Assert Pattern
```typescript
it('should format user name', () => {
  // Arrange
  const user = { firstName: 'John', lastName: 'Doe' };
  
  // Act
  const fullName = formatUserName(user);
  
  // Assert
  expect(fullName).toBe('John Doe');
});
```

### 4. Test One Thing at a Time
```typescript
// ❌ Bad - testing multiple things
it('should handle everything', () => {
  expect(validate(input)).toBe(true);
  expect(process(input)).toBe('processed');
  expect(save(input)).toBe(true);
});

// ✅ Good - separate tests
it('should validate input', () => {
  expect(validate(input)).toBe(true);
});

it('should process valid input', () => {
  expect(process(input)).toBe('processed');
});

it('should save processed input', () => {
  expect(save(input)).toBe(true);
});
```

### 5. Mock External Dependencies
```typescript
// Mock file system, network, external commands
vi.mock('child_process');
vi.mock('fs-extra');
```

### 6. Clean Up Resources
```typescript
afterEach(async () => {
  // Clean up temp files
  await cleanupTempDir(tempDir);
  
  // Reset mocks
  vi.clearAllMocks();
});
```

### 7. Test Edge Cases
```typescript
it('should handle empty string', () => { /* ... */ });
it('should handle very long input', () => { /* ... */ });
it('should handle special characters', () => { /* ... */ });
it('should handle null/undefined', () => { /* ... */ });
```

### 8. Test Error Cases
```typescript
it('should throw error for invalid input', () => { /* ... */ });
it('should handle file not found', () => { /* ... */ });
it('should recover from network error', () => { /* ... */ });
```

### 9. Use Descriptive Assertions
```typescript
// ❌ Bad
expect(result).toBeTruthy();

// ✅ Good
expect(result.status).toBe('success');
expect(result.data).toHaveLength(5);
expect(result.error).toBeUndefined();
```

### 10. Keep Tests Fast
- Mock slow operations (network, file I/O)
- Use temporary directories
- Run integration tests separately from unit tests

## Common Issues and Solutions

### Issue: Tests timing out
**Solution:** Increase timeout or mock slow operations
```typescript
it('slow test', async () => {
  // Test code...
}, 30000);
```

### Issue: Tests failing on different platforms
**Solution:** Use path utilities and check platform
```typescript
import path from 'path';

const filePath = path.join(dir, 'file.txt'); // Cross-platform
```

### Issue: Temp files not cleaned up
**Solution:** Always use try-finally
```typescript
afterEach(async () => {
  try {
    await cleanupTempDir(tempDir);
  } catch (error) {
    // Ignore cleanup errors in tests
  }
});
```

### Issue: Flaky tests
**Solution:** Ensure proper cleanup and avoid race conditions
```typescript
// Use async/await properly
await allAsyncOperations();
```

## Performance Tips

1. **Run unit tests frequently** - They're fast
2. **Run integration tests before commits** - They're slower
3. **Use watch mode during development** - Automatic re-runs
4. **Run coverage periodically** - Not on every change
5. **Mock external dependencies** - Faster tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Test Coverage Report](TEST_COVERAGE.md)
- [Project README](README.md)

## Getting Help

- Check existing tests for examples
- Read test helper documentation in `setup.ts`
- Review CI logs for failures
- Ask in GitHub issues for guidance

## Contributing Tests

When adding new features:
1. Write tests first (TDD approach)
2. Ensure tests pass locally
3. Check coverage doesn't decrease
4. Verify tests pass in CI
5. Document complex test scenarios

---

**Happy Testing! 🧪✨**

