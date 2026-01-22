import { defineStore } from 'pinia'
import { Lunar } from 'lunar-typescript'
import { themeList } from '~/components/theme-controller/src/theme-list'

export const useThemeStore = defineStore('theme', () => {
  const selectedTheme = useLocalStorage<string | null>('selectedTheme', null)
  const currentTheme = ref<(typeof themeList)[number] | null>(null)

  function init() {
    const selectedThemeItem = themeList.find((item) => item.name === selectedTheme.value)
    if (selectedThemeItem) {
      setTheme(selectedThemeItem)
      return
    }

    const d = Lunar.fromDate(new Date())
    const jieQi = d.getCurrentJieQi() ?? d.getPrevJieQi()

    const theme = themeList.find((item) => item.name === jieQi.getName())

    setTheme(theme || themeList[0]!)
  }

  function setTheme(theme: (typeof themeList)[number]) {
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

  function selectTheme(theme: (typeof themeList)[number]) {
    if (selectedTheme.value === theme.name) {
      selectedTheme.value = null
      init()
      return
    }

    selectedTheme.value = theme.name
    setTheme(theme)
  }

  return {
    selectedTheme,
    currentTheme,
    init,
    setTheme,
    selectTheme,
  }
})
