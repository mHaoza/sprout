import type { PresetUnoTheme } from 'unocss'
import { presetIcons, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'
import { defineConfig } from 'unocss/vite'
import presetDefault from './configs/unocss'
// import { themeVars } from "./src/theme/vars";

export default defineConfig<PresetUnoTheme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  theme: {
    // ...themeVars,
    fontSize: {
      'icon-xs': '0.875rem',
      'icon-small': '1rem',
      'icon': '1.125rem',
      'icon-large': '1.5rem',
      'icon-xl': '2rem',
    },
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm',
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetWind3({ dark: 'class' }),
    presetDefault(),
    presetIcons({ prefix: 'i-', warn: true }),
  ],
})
