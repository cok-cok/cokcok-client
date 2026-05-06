const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const tseslint = require('@typescript-eslint/eslint-plugin');

module.exports = defineConfig([
  globalIgnores([
    '.github',
    'node_modules',
    'dist',
    '.expo',
    'build',
    'coverage',
    '*.config.js',
    '*.config.mjs',
    'babel.config.js',
    'metro.config.js',
    '**/lib/**',
  ]),
  ...expoConfig,
  eslintConfigPrettier,
  {
    plugins: {
      '@typescript-eslint': tseslint,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^node:'], ['^react$', '^react-native'], ['^@(?!/)', '^[a-z]'], ['^@/'], ['^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off',
      'react/display-name': 'off',
      'no-console': 'off',
    },
  },
]);
