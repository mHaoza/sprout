/**
 * 把防闪烁脚本注入 <head>
 *
 * SSR 阶段无从得知用户的颜色模式，只能靠这段内联脚本抢在首帧前把
 * `dark` 类写到 <html> 上，之后的同步全部由 `useColorModeStore` 负责。
 */
export default defineNuxtPlugin(() => {
  useHead({
    script: [
      {
        key: 'color-mode-init',
        tagPriority: 'critical',
        innerHTML: COLOR_MODE_INIT_SCRIPT,
      },
    ],
  })
})
