<script setup lang="ts">
/**
 * 页面骨架：统一处理返回导航、标题与入场动画容器
 */
withDefaults(
  defineProps<{
    title?: string
    showNav?: boolean
  }>(),
  {
    title: '',
    showNav: true,
  },
)
</script>

<template>
  <main class="page slide-container">
    <AppNav v-if="showNav" />

    <header v-if="title">
      <h1 class="text-3xl font-extrabold italic">{{ title }}</h1>
    </header>

    <slot />
  </main>
</template>
