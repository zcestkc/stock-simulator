/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  plugins: [
    // Compile with the React Compiler, like the app (next.config.ts), so tests catch
    // components that break when auto-memoised.
    react({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
    viteTsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    // setupFiles: './src/testing/setup-tests.ts',
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      include: ['src/**'],
    },
  },
});
