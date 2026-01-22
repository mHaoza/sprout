<script setup lang="ts">
const meta = {
  title: '关于',
  description: '关于我的个人介绍',
}

useSeoMeta(meta)
</script>

<template>
  <div>
    <Banner
      :title="meta.title"
      image="https://img.iice.fun/blog/2025/11/12/0a2de5843667391847c8b0800cc8059b.webp"
      author="haoza"
      date="2025-11-11"
    />

    <div class="">about</div>
  </div>
</template>

<style scoped></style>
