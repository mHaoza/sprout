<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

import themeList from '@/utils/theme'
import Header from '@/components/Header'

onMounted(() => {
  const theme = themeList[0]
  document.documentElement.style.setProperty('--theme-color', theme.color)
  document.documentElement.style.setProperty('--theme-background-color', theme.backgroundColor)
  document.documentElement.style.setProperty('--background-image', `url('${theme.image}')`)
  document.getElementsByTagName('body')[0].className = theme.type
})
</script>

<template>
  <Header />
  <!-- <Banner /> -->
  <main class="mx-auto md:max-w-screen-lg px-4 py-12 tracking-wide">
    <RouterView class="mt-24" />
  </main>
</template>

<style>
#app {
  width: 100%;
}
</style>
