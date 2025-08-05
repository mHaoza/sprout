import antfn from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfn(
    {
      vue: true,
      unocss: true,
      ignores: ['.nuxt/', '.output/', 'dist', 'node_modules'],
      formatters: {
        /**
         * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
         * By default uses Prettier
         */
        css: true,
        /**
         * Format HTML files
         * By default uses Prettier
         */
        html: true,
        /**
         * Format Markdown files
         * Supports Prettier and dprint
         * By default uses Prettier
         */
        markdown: 'prettier',
      },
    },
    { rules: { 'node/prefer-global/process': 'off' } },
  ),
)
