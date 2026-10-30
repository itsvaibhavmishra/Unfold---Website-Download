import js from '@eslint/js'
import globals from 'globals'
import typescript from 'typescript-eslint'

export default typescript.config(
  { ignores: ['dist', 'coverage'] },
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: { ecmaVersion: 2022, globals: { ...globals.browser, chrome: 'readonly' } },
    rules: {
      // Every module is reached as @/…, including siblings, so a file move cannot leave a
      // path pointing somewhere else and the same import never looks like two.
      'no-restricted-imports': ['error', { patterns: ['./*', '../*'] }],
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
)
