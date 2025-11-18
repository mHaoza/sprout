<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import Color from 'color'
import { Check } from 'lucide-vue-next'
import { Lunar } from 'lunar-typescript'
import { ref } from 'vue'
import { themeList } from './theme-list'

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
  // 设置主色调 - 用于主体元素
  document?.documentElement.style.setProperty('--primary', theme.colors.primary)
  // 设置强调色调 - 用于强调元素
  document?.documentElement.style.setProperty('--accent', theme.colors.accent)
  // 设置背景色调 - 用于卡片、面板等背景
  document?.documentElement.style.setProperty('--background', Color(theme.colors.background).alpha(0.3).toString())
  // 设置背景图片
  document?.documentElement.style.setProperty('--bg-img', `url('${theme.poetryPicture}')`)
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
  <UiDialog v-model:open="panelVisible">
    <UiDialogTrigger as-child>
      <div
        class="fixed bottom-[10vw] right-[3vw] h-16 w-16 cursor-pointer overflow-hidden border-2 border-[--primary] rounded-full opacity-0 transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-100 hover:shadow-[--primary]/50 hover:shadow-lg"
        @click="panelVisible = true"
      >
        <img src="/imgs/比丢00.webp" class="h-full w-full object-cover transition-transform duration-300 hover:scale-105">
      </div>
    </UiDialogTrigger>

    <UiDialogContent hide-overlay class="p-0 w-5xl bg-(--background-base)">
      <UiDialogHeader class="p-6 pb-0">
        <UiDialogTitle>
          <div>主题选择</div>
        </UiDialogTitle>
        <UiDialogDescription />
      </UiDialogHeader>

      <div class="grid grid-cols-6 gap-4 overflow-y-scroll max-h-[80dvh] px-6 pb-6">
        <div
          v-for="theme in themeList"
          :key="theme.name"
          class="group relative cursor-pointer rounded-md overflow-hidden border transition-colors aspect-square"
          @click="selectTheme(theme)"
        >
          <img
            :src="theme.poetryPicture"
            :alt="theme.name"
            draggable="false"
            class="absolute right-0 bottom-[-5px] scale-140 origin-bottom-right pointer-events-none"
          >

          <div class="absolute left-2 top-2 rounded-full bg-white/70 px-2 py-1 text-xs text-neutral-700 border border-black/10 shadow-sm backdrop-blur-sm">
            {{ theme.name }}
          </div>

          <div class="absolute top-3 right-3 flex gap-2 rounded-md">
            <div class="size-3 border rounded-full transition-colors duration-300" :style="{ backgroundColor: theme.colors.primary }" />
            <div class="size-3 border rounded-full transition-colors duration-300" :style="{ backgroundColor: theme.colors.accent }" />
            <div class="size-3 border rounded-full transition-colors duration-300" :style="{ backgroundColor: theme.colors.background }" />
          </div>

          <div
            class="absolute bottom-0 p-2 from-(--background-base) from-50% to-transparent bg-linear-to-t opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            :style="{ color: theme.colors.primary }"
          >
            <h3 class="mb-1 text-sm font-bold sm:text-base">
              {{ theme.name }}
            </h3>
            <p class="mb-2 text-xs opacity-90">
              {{ theme.description }}
            </p>
            <p class="hidden text-xs leading-relaxed opacity-75 sm:block">
              {{ theme.poetry }}
            </p>
          </div>

          <div
            v-if="theme.name === selectedTheme"
            class="absolute right-2 top-2 h-6 w-6 flex items-center justify-center rounded-full bg-primary text-white shadow-lg"
          >
            <Check class="h-3 w-3" />
          </div>
        </div>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
