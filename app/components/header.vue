<script setup lang="ts">
import { useScroll } from '@vueuse/core'

const { y } = useScroll(document?.body)

const navList = [
  { path: '/', name: '首页' },
  { path: '/anime', name: '追番' },
  { path: '/demo', name: '案例' },
  { path: '/about', name: '关于' },
]

const scrolled = computed(() => y.value > 100)
</script>

<template>
  <header
    class="fixed left-0 right-0 top-0 z-0 h-24 w-screen flex flex-col items-center justify-between transition-[top]"
    :class="{ 'slide-down': scrolled }"
  >
    <NuxtLink to="/" class="my-3 text-2xl transition-all">
      私の
    </NuxtLink>

    <nav class="header-nav mb-3">
      <NuxtLink
        v-for="item in navList"
        :key="item.path"
        :to="item.path"
        class="mx-3 px-2"
      >
        {{ item.name }}
      </NuxtLink>
    </nav>
  </header>
</template>

<style lang="postcss" scoped>
.slide-down {
  @apply top-[-45px] shadow-md backdrop-blur-md;
}
</style>
