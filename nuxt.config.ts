import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devServer: { host: 'localhost' },
  vite: {
    plugins: [
      tailwindcss() as any,
      { src: '~/plugins/router-nprogress.client.ts', mode: 'client' },
    ],
    // clearScreen: false,
    // 启用环境变量
    envPrefix: ['VITE_'],
    // server: {
    //   strictPort: true,
    // },
    optimizeDeps: {
      include: ['@vueuse/core', 'vue', 'vue-router'],
      exclude: [
        '@nuxtjs/mdc',
        'remark-gfm',
        'remark-emoji',
        'remark-mdc',
        'remark-rehype',
        'rehype-raw',
        'parse5',
        'unist-util-visit',
        'unified',
        'debug',
      ],
    },
    ssr: {
      noExternal: ['@vueuse/core', 'vue', 'vue-router'],
    },
  },
  modules: ['@pinia/nuxt', '@nuxt/ui', '@nuxt/content', '@vueuse/nuxt'],
  css: ['~/assets/styles/main.css'],
  icon: {
    clientBundle: {
      // 扫描并打包使用的图标到客户端
      scan: true,
    },
  },
  ui: {
    fonts: false,
    colorMode: false,
    experimental: {
      componentDetection: true,
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'material-theme-lighter',
            dark: 'material-theme-palenight',
          },
          langs: [
            'javascript',
            'typescript',
            'jsx',
            'tsx',
            'vue',
            'html',
            'css',
            'scss',
            'json',
            'yaml',
            'markdown',
            'bash',
            'shell',
            'python',
            'py',
            'java',
            'cpp',
            'c',
            'go',
            'rust',
            'php',
            'ruby',
            'sql',
            'xml',
            'dockerfile',
            'diff',
          ],
        },
        toc: { depth: 4, searchDepth: 4 },
      },
    },
    experimental: {
      sqliteConnector: 'native',
    },
  },
})
