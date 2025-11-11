import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  // 启用 SSG
  // ssr: false,
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
  },
  modules: ['@nuxt/eslint', 'shadcn-nuxt'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui',
  },
  ignore: ['app/pages/**/modules/**'],
  hooks: {
    'pages:extend': function (pages) {
      // 添加首页路由
      pages.push({
        name: 'home',
        path: '/',
        file: '~/pages/home/index.vue',
      })
      // 移除首页home路由
      const index = pages.findIndex(page => page.path === '/home')
      if (index >= 0) {
        pages.splice(index, 1)
      }
    },
  },
  css: ['~/assets/styles/main.css'],
  eslint: {
    config: {
      standalone: false,
    },
  },
})
