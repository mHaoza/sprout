<script setup lang="ts">
import { RouterView } from 'vue-router'

import Header from '@/components/Header'
import ThemeController from '@/components/ThemeController'
</script>

<template>
  <Header />
  <main class="mx-auto md:max-w-screen-lg px-4 py-12 mt-40 tracking-wide">
    <RouterView />
  </main>
  <ThemeController />
</template>

<style>
#app {
  overflow: auto;
}
</style>
