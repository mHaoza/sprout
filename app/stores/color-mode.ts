import { defineStore, skipHydrate } from 'pinia'
import type { ColorMode, ColorModePreference } from '~/utils/color-mode'

/**
 * 黑白模式
 *
 * 默认跟随操作系统；用户手动切换后写入 localStorage，并优先于系统设置。
 */
export const useColorModeStore = defineStore('color-mode', () => {
  /**
   * 用户偏好，`system` 表示跟随系统
   *
   * 必须 skipHydrate：这两个值只有客户端知道，而服务端渲染时它们只是默认值
   * （`system` / `false`），会被原样序列化进 payload。若不跳过，Pinia 在 hydration
   * 时会用 payload 覆盖掉刚从 localStorage 读到的真实偏好，VueUse 的写回 watcher
   * 随即把 `system` 写回存储 —— 表现就是「切换后一切正常，一刷新偏好就丢」。
   */
  const preference = skipHydrate(
    useLocalStorage<ColorModePreference>(COLOR_MODE_STORAGE_KEY, 'system'),
  )
  /** 系统是否偏好深色，同理不能参与 hydration */
  const systemDark = skipHydrate(useMediaQuery('(prefers-color-scheme: dark)'))

  /** 实际生效的模式 */
  const mode = computed<ColorMode>(() =>
    preference.value === 'system' ? (systemDark.value ? 'dark' : 'light') : preference.value,
  )
  const isDark = computed(() => mode.value === 'dark')
  const isSystem = computed(() => preference.value === 'system')

  // 状态 → DOM 的唯一出口：首屏由内联脚本铺好底，这里保证之后始终同步。
  // flush: 'sync' 是为了让类名在 View Transition 的更新回调里立刻生效。
  if (import.meta.client) {
    watchEffect(() => applyColorMode(mode.value), { flush: 'sync' })
  }

  /** 显式指定模式（此后不再跟随系统） */
  function setMode(value: ColorMode) {
    transitionColorMode(() => {
      preference.value = value
    })
  }

  /** 在黑白之间来回切换 */
  function toggle() {
    setMode(isDark.value ? 'light' : 'dark')
  }

  /** 交还给系统决定 */
  function followSystem() {
    transitionColorMode(() => {
      preference.value = 'system'
    })
  }

  return { preference, mode, isDark, isSystem, setMode, toggle, followSystem }
})
