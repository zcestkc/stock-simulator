// ESLint 9 flat config (replaces the old .eslintrc.cjs, which ESLint 9 no longer reads).
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import vitest from '@vitest/eslint-plugin';
import checkFile from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tailwind from 'eslint-plugin-tailwindcss';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Each feature may only import from itself (CLAUDE.md: features don't import each other).
const FEATURES = ['auth', 'portfolio', 'stocks'];

export default tseslint.config(
  {
    ignores: [
      'node_modules/',
      '.next/',
      'next-env.d.ts',
      'public/',
      'mock.ts',
      '*.config.{js,mjs,ts}',
    ],
  },

  js.configs.recommended,
  // Type-aware rules: they use the TypeScript compiler (e.g. floating promises, unsafe `any`).
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  // Rules of Hooks + React Compiler rules (purity, immutability, refs, …)
  reactHooks.configs.flat['recommended-latest'],
  jsxA11y.flatConfigs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ...tailwind.configs['flat/recommended'],
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { typescript: true, node: true },
      tailwindcss: { config: 'tailwind.config.ts', callees: ['cn', 'cva'] },
    },
    rules: {
      '@next/next/no-img-element': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'react/prop-types': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-cycle': 'error',
      // Import order/sorting is handled by the editor (source.sortImports on save).
      'import/order': 'off',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            ...FEATURES.map((feature) => ({
              target: `./src/features/${feature}`,
              from: './src/features',
              except: [`./${feature}`],
            })),
            // Unidirectional: app → features → shared, never backwards.
            { target: './src/features', from: './src/app' },
            {
              target: [
                './src/components',
                './src/hooks',
                './src/lib',
                './src/types',
                './src/utils',
              ],
              from: ['./src/features', './src/app'],
            },
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },

  {
    files: ['src/**/*'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          '!(src/app)/**/*': 'KEBAB_CASE',
          '!(**/__tests__)/**/*': 'KEBAB_CASE',
        },
      ],
    },
  },

  {
    files: ['**/__tests__/**', '**/*.test.{ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
    ...vitest.configs.recommended,
    plugins: {
      ...testingLibrary.configs['flat/react'].plugins,
      ...vitest.configs.recommended.plugins,
    },
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      ...vitest.configs.recommended.rules,
    },
  },

  // Last, so it turns off stylistic rules that conflict with Prettier.
  prettierRecommended,
);
