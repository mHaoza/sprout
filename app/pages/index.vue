<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
  title: appConfig.site.name,
  description: appConfig.site.description,
})
</script>

<template>
  <div>
    <Banner image="https://img.iice.fun/blog/2025/11/13/ba4b14885d6292ba3d064d538408727f.webp">
      <template #title>
        <div class="font-mingchao">
          {{ appConfig.site.name }}
        </div>
        <div class="mt-4 text-sm">
          {{ appConfig.site.description }}
        </div>
      </template>
    </Banner>

    <PostList />
  </div>
</template>

<style scoped></style>
