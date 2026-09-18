/**
 * 全局页面标题模板：`<页面标题> @ site.name`
 *
 * 之所以注册在插件里而不是写进 `nuxt.config` 的 `app.head`：
 * 1. 可以直接读取 `app.config.ts` 的 `site.name`，署名只需维护一处，不会和页脚署名走样；
 * 2. 渲染错误页时 `error.vue` 会替换掉 `app.vue`，只有挂在 Nuxt app 上的 useHead 才能一并覆盖；
 * 3. 用函数形式兜底，避免没有标题的页面（如极少数边界情况）渲染出孤零零的 `@`。
 */
export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()

  useHead({
    titleTemplate: (title?: string) =>
      title ? `${appConfig.site.name} - ${title}` : appConfig.site.name,
  })
})
