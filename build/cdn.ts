import { Plugin as importToCDN } from 'vite-plugin-cdn-import'

/**
 * @description 打包时采用`cdn`模式
 * 可以选择：https://www.bootcdn.cn | https://unpkg.com | https://www.jsdelivr.com
 */
export const cdn = importToCDN({
  // prodUrl: 生产环境的cdn地址，{name}、{version}、{path}会自动替换为对应模块的名称、版本号、文件路径
  // https://unpkg.com/browse/markdown-it@14.1.0/ 查看markdown-it的所有版本
  prodUrl: 'https://unpkg.com/{name}@{version}/{path}',
  modules: [
    {
      name: 'vue',
      var: 'Vue',
      path: 'dist/vue.global.prod.js',
    },
    {
      name: 'vue-router',
      var: 'VueRouter',
      path: 'dist/vue-router.global.prod.js',
    },
    {
      // 这个包项目未使用， 但@vueuse/core依赖它
      name: '@vueuse/shared',
      var: 'VueUse',
      path: 'index.iife.min.js',
    },
    {
      name: '@vueuse/core',
      var: 'VueUse',
      path: 'index.iife.min.js',
    },
    {
      name: 'markdown-it',
      var: 'markdownit',
      path: 'dist/markdown-it.min.js',
    },
  ],
})
