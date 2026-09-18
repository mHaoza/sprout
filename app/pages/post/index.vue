<script setup lang="ts">
// /post 没有独立列表页，统一跳转到文章归档
await navigateTo('/articles', { redirect: { statusCode: 301 } })
</script>

<template>
  <div />
</template>
