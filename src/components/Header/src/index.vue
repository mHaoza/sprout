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
  <header class="fixed top-0 left-0 right-0 z-50 flex flex-col justify-center items-center w-screen h-24 transition-[top]" :class="{ 'slide-down': y > 100 }">
    <RouterLink to="/" class="header-logo text-2xl mb-2 transition-all">私の</RouterLink>
    <nav class="header-nav">
      <RouterLink v-for="item in navList" :key="item.path" :to="item.path" class="px-2 py-1 mx-3 hover:text-[var(--theme-color)]">{{ item.name }}</RouterLink>
    </nav>
  </header>
</template>

<style lang="postcss" scoped>
.slide-down {
  top: -45px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* .header-logo {
    display: none;
  } */
}
</style>
