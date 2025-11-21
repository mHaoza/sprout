<script setup lang="ts">
const pageStore = usePageStore()

const meta = {
  title: '项目',
  description: '我的个人项目展示',
}

onMounted(() => {
  pageStore.setPageMeta({
    banner: {
      postTitle: meta.title,
      bannerImage: 'http://img.iice.fun/blog/2025/11/13/22bba19e4ea5bb58162a93e439682efb.webp',
      postMeta: 'haoza · 2025-11-11',
    },
    description: meta.description,
  })
})

useSeoMeta(meta)
</script>

<template>
  <div>
    project
  </div>
</template>
