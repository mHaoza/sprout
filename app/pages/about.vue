<script setup lang="ts">
const pageStore = usePageStore()

const meta = {
  title: '关于',
  description: '关于我的个人介绍',
}

onMounted(() => {
  pageStore.setPageMeta({
    banner: {
      postTitle: meta.title,
      postMeta: 'haoza · 2025-11-11',
      bannerImage: 'https://img.iice.fun/blog/2025/11/12/0a2de5843667391847c8b0800cc8059b.webp',
    },
    description: meta.description,
  })
})

useSeoMeta(meta)
</script>

<template>
  <div class="">
    about
  </div>
</template>

<style scoped></style>
