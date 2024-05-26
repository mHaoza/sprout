import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['node_modules', '**/node_modules/**', 'pnpm-lock.yaml', '**/pnpm-lock.yaml/**'],
    formatters: true,
    vue: true,
    stylistic: {
      overrides: {
        'style/brace-style': ['error', '1tbs'],
      },
    },
  },
  {
    rules: {
      'no-console': ['off'],
      'vue/singleline-html-element-content-newline': ['off'],
      'curly': ['error', 'all'],
    },
  },
)
