<script setup lang="ts">
const appConfig = useAppConfig()
const pageStore = usePageStore()

onMounted(() => {
  pageStore.setPageMeta({
    banner: {
      postTitle: h('div', { class: 'font-mingchao' }, appConfig.site.name),
      subtitle: appConfig.site.description,
      bannerImage: 'http://127.0.0.1:9000/blog/2025/11/13/ba4b14885d6292ba3d064d538408727f.webp',
    },
    description: appConfig.site.description,
  })
})

useSeoMeta({
  title: appConfig.site.name,
  description: appConfig.site.description,
})
</script>

<template>
  <div class="home">
    home
  </div>
</template>

<style scoped>
</style>
