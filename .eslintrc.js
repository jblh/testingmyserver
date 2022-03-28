module.exports = {
  parser: '@babel/eslint-parser',
  root: true,
  env: {
    node: true,
    commonjs: true,
    es6: true,
    es2021: true,
    browser: true,
  },
  extends: ['standard', 'plugin:json/recommended', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  rules: {
    indent: ['warn', 2, { SwitchCase: 1 }],
    quotes: ['warn', 'single'],
    semi: ['error', 'never'],
    'no-var': ['error'],
    'no-console': ['off'],
    'no-unused-vars': ['warn', { args: 'all', argsIgnorePattern: '^_' }],
    'no-mixed-spaces-and-tabs': ['warn'],
  },
}
