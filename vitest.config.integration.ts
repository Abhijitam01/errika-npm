import { defineConfig } from 'vitest/config';
import baseConfig from './vitest.config';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/__tests__/integration/**/*.test.ts'],
      testTimeout: 60000,
      hookTimeout: 60000,
      // Run integration tests sequentially to avoid conflicts
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  })
);

