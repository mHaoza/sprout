<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import Side from '@/components/Side'

import themeList from '@/utils/theme'

onMounted(() => {
  const theme = themeList[0]
  document.documentElement.style.setProperty('--theme-color', theme.color)
  document.documentElement.style.setProperty('--theme-background-color', theme.backgroundColor)
  document.documentElement.style.setProperty('--background-image', `url('${theme.image}')`)
  document.getElementsByTagName('body')[0].className = theme.type
})
</script>

<template>
  <Side />

  <div class="page">
    <RouterView />
  </div>
</template>

<style scoped></style>
