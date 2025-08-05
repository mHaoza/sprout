<script setup lang="ts">
import { useScroll } from '@vueuse/core'

const { y } = useScroll(document?.body)

const navList = [
  { path: '/', name: '首页' },
  { path: '/anime', name: '追番' },
  { path: '/demo', name: '案例' },
  { path: '/about', name: '关于' },
]

const route = useRoute()

function isActive(path: string) {
  if (
    (path === '/' && route.path === '/')
    || (path !== '/' && route.path.startsWith(path))
  ) {
    return true
  }

  return false
}
</script>

<template>
  <header
    class="fixed left-0 right-0 top-0 z-0 h-24 w-screen flex flex-col items-center justify-center backdrop-blur-md transition-[top]"
    :class="{ 'slide-down': y > 100 }"
  >
    <NuxtLink to="/" class="mb-2 text-2xl transition-all">
      私の
    </NuxtLink>

    <nav class="header-nav">
      <NuxtLink
        v-for="item in navList"
        :key="item.path"
        :to="item.path"
        class="mx-3 px-2 py-1 hover:text-[var(--theme-color)]"
        :class="{ 'text-[var(--theme-color)]': isActive(item.path) }"
      >
        {{ item.name }}
      </NuxtLink>
    </nav>
  </header>
</template>

<style lang="postcss" scoped>
.slide-down {
  @apply top-[-45px] shadow-md;
}
</style>
