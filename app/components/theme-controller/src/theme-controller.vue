<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import Color from 'color'
import { Lunar } from 'lunar-typescript'
import { ref } from 'vue'
import { themeList } from './theme-list'

const themeGroupList = Array.from({ length: Math.ceil(themeList.length / 6) }, (_, i) => {
  return themeList.slice(i * 6, i * 6 + 6)
})

const panelVisible = ref(false)
const selectedTheme = useLocalStorage<string | null>('selectedTheme', null)

init()

function init() {
  const selectedThemeItem = themeList.find(item => item.name === selectedTheme.value)
  if (selectedThemeItem) {
    setTheme(selectedThemeItem)
    return
  }

  const d = Lunar.fromDate(new Date())
  const jieQi = d.getCurrentJieQi() ?? d.getPrevJieQi()

  const theme = themeList.find(item => item.name === jieQi.getName())

  setTheme(theme || themeList[0]!)
}

function setTheme(theme: typeof themeList[number]) {
  document?.documentElement.style.setProperty('--theme-color', theme.color)
  document?.documentElement.style.setProperty('--theme-bg-color', Color(theme.bgColor).alpha(0.3).toString())
  document?.documentElement.style.setProperty('--theme-bg-img', `url('${theme.poetryPicture}')`)
}

function selectTheme(theme: typeof themeList[number]) {
  if (selectedTheme.value === theme.name) {
    selectedTheme.value = null
    init()

    return
  }

  selectedTheme.value = theme.name
  setTheme(theme)
}
</script>

<template>
  <div
    class="fixed bottom-[10vw] right-[3vw] h-16 w-16 cursor-pointer overflow-hidden border border-[var(--theme-color)] rounded-full opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"
    @click="panelVisible = !panelVisible"
  >
    <img src="/imgs//比丢00.webp" class="h-full w-full object-cover">
  </div>

  <div
    v-if="panelVisible"
    class="fixed left-0 top-0 h-screen w-screen overflow-y-auto bg-black/50 backdrop-blur-sm"
    @click="panelVisible = false"
  >
    <div
      v-for="(themeGroup, index) in themeGroupList"
      :key="index"
      class="container grid grid-cols-6 mx-auto gap-4 p-11"
    >
      <img
        v-for="theme in themeGroup" :key="theme.name"
        :src="theme.picture"
        draggable="false"
        class="mx-auto h-full w-48 cursor-pointer rounded-lg shadow-[0px_0px_12px] shadow-blue-500/0 transition duration-300 ease-in-out hover:shadow-blue-500/100"
        :class="theme.name === selectedTheme ? 'shadow-blue-500/100' : ''"
        @click="selectTheme(theme)"
      >
    </div>
  </div>
</template>

<style lang="postcss" scoped>
</style>
