import { defineConfig } from 'vitest/config';
import baseConfig from './vitest.config';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/__tests__/unit/**/*.test.ts'],
      testTimeout: 10000
    }
  })
);

