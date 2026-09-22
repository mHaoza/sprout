/**
 * 黑白模式的底层工具
 *
 * 全站的颜色模式只有一个开关：`<html>` 上的 `dark` 类。
 * 之所以用类名而不是自定义属性，是因为三个下游都认这个约定：
 *   - Tailwind 的 `dark:` 变体（见 main.css 的 @custom-variant）
 *   - Nuxt UI 的 `.dark` 令牌块
 *   - Shiki 为代码块生成的 `html.dark .shiki span { ... }`
 */

/** 实际生效的颜色模式 */
export type ColorMode = 'light' | 'dark'

/** 用户偏好：`system` 表示跟随操作系统 */
export type ColorModePreference = ColorMode | 'system'

export const COLOR_MODE_STORAGE_KEY = 'color-mode'

/**
 * 首屏防闪烁脚本
 *
 * 必须内联在 <head> 里同步执行：SSR 阶段无从得知用户偏好，
 * 只有抢在首帧绘制前把 `dark` 类写上去，才不会闪一下浅色。
 */
export const COLOR_MODE_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('${COLOR_MODE_STORAGE_KEY}');var m=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',m==='dark')}catch(e){}})()`

/** 把颜色模式写到 <html> 上 */
export function applyColorMode(mode: ColorMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

/**
 * 带揭幕动画地执行一次模式变更
 *
 * 用 View Transition API 让新旧两种配色以「翻页」的方式交接，
 * 浏览器不支持或用户偏好减少动效时直接生效。
 * 注意 `apply` 必须在回调里同步改完 DOM，否则新快照会拍在变更之前。
 */
export function transitionColorMode(apply: () => void) {
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => { finished: Promise<void> }
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!doc.startViewTransition || reduceMotion) {
    apply()
    return
  }

  doc.startViewTransition(apply)
}
