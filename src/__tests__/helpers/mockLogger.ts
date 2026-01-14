import { vi } from 'vitest';

/**
 * Mock logger for testing to prevent console noise
 */
export const mockLogger = {
  info: vi.fn(),
  success: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
  bold: vi.fn(),
  gray: vi.fn(),
  cyan: vi.fn(),
  blueBright: vi.fn(),
  newLine: vi.fn(),
  spinner: vi.fn(() => ({
    succeed: vi.fn(),
    fail: vi.fn(),
    start: vi.fn(),
    stop: vi.fn()
  }))
};

export function resetMockLogger() {
  Object.values(mockLogger).forEach(fn => {
    if (typeof fn === 'function' && 'mockClear' in fn) {
      fn.mockClear();
    }
  });
}

