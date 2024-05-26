import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { cdn } from './build/cdn'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cdn,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
