import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'src/index.js',
        'coverage/'
      ],
      thresholds: {
        lines: 60,
        functions: 50,
        branches: 60,
        statements: 60
      }
    },
    include: ['tests/**/*.test.js']
  }
});

