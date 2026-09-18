<script setup lang="ts"></script>

<template>
  <AppBlur />

  <slot />

  <AppFooter />

  <div class="fixed right-8 bottom-6 z-20 flex flex-col gap-3">
    <AppScrollTop />
  </div>

  <ThemeController />
</template>

<style scoped></style>
