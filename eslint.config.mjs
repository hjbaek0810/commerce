import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

import js from '@eslint/js';

import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    settings: {
      'import/resolver': {
        typescript: './tsconfig.json',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    languageOptions: {
      ecmaVersion: 2021,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
          modules: true,
        },
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'warn',
      'no-var': 'error',
      'no-duplicate-case': 'error',
      'no-useless-catch': 'warn',
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
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-throw-literal': 'off',
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
      // 'react/destructuring-assignment': 'warn',
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
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    ignores: [
      '.next',
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
  },
  eslintConfigPrettier,
);
