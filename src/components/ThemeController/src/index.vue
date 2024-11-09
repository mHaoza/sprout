<script setup lang="ts">
import { ref } from 'vue'
import { CircleX } from 'lucide-vue-next'
import { themeList } from './themeList'
import './index.css'

const panelVisible = ref(false)
const currentTheme = ref(themeList[0])

setTheme(themeList[themeList.length - 1])

function setTheme(theme: typeof themeList[number]) {
  currentTheme.value = theme
  document.documentElement.style.setProperty('--theme-color', theme.color)
  document.documentElement.style.setProperty('--theme-bg-color', theme.bgColor)
  document.documentElement.style.setProperty('--background-image', `url('${theme.cardImg}')`)
}
</script>

<template>
  <div class="bg">
    <div class="bg-color-mask" />
  </div>
  <div class="theme-controller">
    <div
      class="
      fixed bottom-[10vw] right-[3vw]
      w-16 h-16 rounded-full overflow-hidden border border-[var(--theme-color)] cursor-pointer
      opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out
    "
      @click="panelVisible = !panelVisible"
    >
      <img src="@/assets/Hei/比丢00.webp" alt="">
    </div>

    <div v-if="panelVisible" class="theme-controller-panel fixed top-0 left-0 w-screen h-screen bg-opacity-50 z-50" @click="panelVisible = false">
      <div class="theme-wrap absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-6 gap-4 bg-white p-8 rounded-lg" @click.stop>
        <div class="close absolute top-1 right-1 cursor-pointer" @click="panelVisible = false"><CircleX color="#999" /></div>
        <img
          v-for="theme in themeList"
          :key="theme.name"
          :src="theme.avatarImg"
          draggable="false"
          class="w-16 h-16 cursor-pointer rounded-full hover:scale-105 active:scale-100 transition-transform duration-300 ease-in-out"
          @click="setTheme(theme)"
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
