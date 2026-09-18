import { defineStore } from 'pinia'
import { Lunar } from 'lunar-typescript'
import { themeList } from '~/components/theme-controller/src/theme-list'

export type SolarTermTheme = (typeof themeList)[number]

/** 依据当前节气推导出的主题（自动模式） */
function resolveSolarTermTheme(): SolarTermTheme {
  const d = Lunar.fromDate(new Date())
  const jieQi = d.getCurrentJieQi() ?? d.getPrevJieQi()
  return themeList.find((item) => item.name === jieQi.getName()) ?? themeList[0]!
}

export const useThemeStore = defineStore('theme', () => {
  /** 用户手动选择的节气名称，为 null 时跟随节气 */
  const selectedTheme = useLocalStorage<string | null>('selectedTheme', null)
  const currentTheme = ref<SolarTermTheme | null>(null)
  /** 当前节气对应的主题 */
  const autoTheme = ref<SolarTermTheme>(themeList[0]!)

  const panelVisible = ref(false)
  /** 面板定位锚点（触发按钮） */
  const anchorEl = shallowRef<HTMLElement | null>(null)

  function setTheme(theme: SolarTermTheme) {
    currentTheme.value = theme

    // 更新 appConfig 的颜色配置
    updateAppConfig({
      ui: {
        colors: {
          primary: theme.colors.primary,
          secondary: theme.colors.secondary,
        },
      },
    })

    // 设置背景图片（保留原有逻辑）
    document?.documentElement.style.setProperty('--bg-img', `url('${theme.poetryPicture}')`)
  }

  function init() {
    autoTheme.value = resolveSolarTermTheme()

    const selected = themeList.find((item) => item.name === selectedTheme.value)
    setTheme(selected ?? autoTheme.value)
  }

  function selectTheme(theme: SolarTermTheme) {
    selectedTheme.value = theme.name
    setTheme(theme)
  }

  /** 清除手动选择，恢复跟随节气 */
  function resetTheme() {
    selectedTheme.value = null
    setTheme(autoTheme.value)
  }

  function openPanel(anchor?: HTMLElement | null) {
    if (anchor) {
      anchorEl.value = anchor
    }
    panelVisible.value = true
  }

  function closePanel() {
    panelVisible.value = false
  }

  function togglePanel(anchor?: HTMLElement | null) {
    if (panelVisible.value) {
      closePanel()
      return
    }
    openPanel(anchor)
  }

  return {
    selectedTheme,
    currentTheme,
    autoTheme,
    panelVisible,
    anchorEl,
    init,
    setTheme,
    selectTheme,
    resetTheme,
    openPanel,
    closePanel,
    togglePanel,
  }
})
