import baseConfig from '@repo/eslint-config/base.js';

export default [
  ...baseConfig,
  {
    ignores: ['node_modules/**', 'android/**', 'ios/**'],
  },
];

