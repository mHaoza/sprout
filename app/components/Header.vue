<script setup lang="ts">
const { y } = useScroll(document)

const navList = [
  { path: '/', name: '首页' },
  { path: '/anime', name: '追番' },
  { path: '/projects', name: '项目' },
  { path: '/links', name: '友链' },
  { path: '/about', name: '关于' },
]

const scrolled = computed(() => y.value > 100)

const appConfig = useAppConfig()
</script>

<template>
  <header
    class="header sticky top-0 right-0 left-0 z-99 flex h-24 w-full flex-col items-center justify-between transition-[top]"
    :class="{ '-top-11.25 shadow-md': scrolled }"
  >
    <NuxtLink to="/" class="font-mingchao my-3 text-3xl">
      {{ appConfig.site.name }}
    </NuxtLink>

    <nav class="header-nav mb-3">
      <NuxtLink v-for="item in navList" :key="item.path" :to="item.path" class="aa mx-3 px-2">
        {{ item.name }}
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--background-base);
  background-image: var(--texture);
}
</style>
