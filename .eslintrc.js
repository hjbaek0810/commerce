module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'react-hooks'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  settings: {
    next: {
      rootDir: ['./src/'],
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
    'react/react-in-jsx-scope': 'off',
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
  ignorePatterns: ['.eslintrc.js'],
};
