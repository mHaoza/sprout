<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

const navList = [
  { path: '/', name: '首页' },
  { path: '/anime', name: '追番' },
  { path: '/demo', name: '案例' },
  { path: '/about', name: '关于' },
]
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 w-screen transition-[top]" :class="{ scrolled: y > 200 }">
    <nav class="flex justify-center items-end pb-3 h-24 bg-[var(--theme-background-color)]">
      <RouterLink to="/" class="absolute top-4 text-2xl">mHaoza</RouterLink>
      <RouterLink v-for="item in navList" :key="item.path" :to="item.path" class="px-2 py-1 mx-3 hover:text-[var(--theme-color)]">{{ item.name }}</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.scrolled {
  top: -43px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
