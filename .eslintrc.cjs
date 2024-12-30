module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'airbnb-typescript',
    'eslint-config-prettier',
  ],
  ignorePatterns: ['dist', 'vite.config.ts', 'vitest.config.ts', 'tailwind.config.js', 'tests', '*.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react-refresh', 'prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': 'error',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-no-bind': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        "": 'never',
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never',
        'mjs': 'never'
      }
    ],
  },
};
