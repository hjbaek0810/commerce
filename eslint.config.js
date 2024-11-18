import nextPlugin from '@next/eslint-plugin-next';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint-define-config';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default defineConfig({
  plugins: {
    '@typescript-eslint': typescriptEslintPlugin,
    import: importPlugin,
    next: nextPlugin,
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
  },
  languageOptions: {
    parser: parser,
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module',
    },
  },
  settings: {
    next: {
      rootDir: ['./'],
    },
    react: {
      version: '18.3.1',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-unused-vars': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-var': 'error',
    'no-duplicate-case': 'error',
    'padding-line-between-statements': [
      'warn',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],
    eqeqeq: ['warn', 'always'],
    'prefer-destructuring': 'warn',
    'sort-imports': [
      'warn',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/no-relative-packages': 'off',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['sibling', 'parent', 'index'],
          'object',
          'type',
          'unknown',
        ],
        pathGroups: [
          {
            pattern: '{react*,react*/**}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '**/*\\.scss',
            group: 'object',
          },
          {
            pattern: '{@*/**}',
            group: 'internal',
            position: 'after',
          },
        ],
        warnOnUnassignedImports: true,
        pathGroupsExcludedImportTypes: [],
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        'newlines-between': 'always',
      },
    ],
    'react/no-array-index-key': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/button-has-type': 'off',
    'react/self-closing-comp': [
      'warn',
      {
        component: true,
        html: true,
      },
    ],
    'react/destructuring-assignment': 'warn',
    'react/jsx-pascal-case': 'error',
    'react/jsx-no-useless-fragment': 'warn',
    'react/jsx-key': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/consistent-type-exports': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-throw-literal': 'off',
  },
  ignores: [
    'tsconfig.json',
    'node_modules',
    'dist',
    'public',
    '*.mjs',
    'next-sitemap.config.js',
    'lint-staged.config.js',
    'commitlint.config.js',
    'babel.config.json',
  ],
});
