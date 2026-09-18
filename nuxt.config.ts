import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  vite: {
    plugins: [tailwindcss() as any],
    optimizeDeps: {
      include: ['@vueuse/core', 'vue', 'vue-router'],
      exclude: [
        '@nuxtjs/mdc',
        'remark-gfm',
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
  plugins: [{ src: '~/plugins/router-nprogress.client.ts', mode: 'client' }],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
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
          theme: 'rose-pine-dawn',
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
