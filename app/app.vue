<script setup>
import { zh_cn } from '@nuxt/ui/locale'
</script>

<template>
  <UApp :locale="zh_cn">
    <NuxtLayout>
      <NuxtPage />
      <ThemeController />
    </NuxtLayout>
  </UApp>
</template>
