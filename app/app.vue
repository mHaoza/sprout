<script setup>
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  mobile: 768,
  desktop: Infinity,
})

// 如果是移动端，就去找u总
setTimeout(() => {
  if (breakpoints.smaller('mobile').value) {
    window.location.href = 'https://www.yynn.fun'
  }
}, 200)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ThemeController />
</template>
