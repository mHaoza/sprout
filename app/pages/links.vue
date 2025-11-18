<script setup lang="ts">
const pageStore = usePageStore()

const meta = {
  title: '友链',
  description: '我的友情链接',
}

onMounted(() => {
  pageStore.setPageMeta({
    banner: {
      postTitle: meta.title,
      bannerImage: 'http://127.0.0.1:9000/blog/2025/11/12/8684c11604f1fef29480ed31cedd5935.webp',
      postMeta: 'haoza · 2025-11-11',
    },
    description: meta.description,
  })
})

useSeoMeta(meta)
</script>

<template>
  <div>links page</div>
</template>
