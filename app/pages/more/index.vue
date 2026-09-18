<script setup lang="ts">
useSeoMeta({
  title: '更多',
  description: '一些额外的整理与记录。',
})

const { data: posts } = await useAsyncData('more-index', () =>
  queryCollection('more').order('date', 'DESC').all(),
)

const groups = computed(() =>
  groupByYear(
    (posts.value ?? []).map((post) => ({
      title: post.title,
      date: post.date,
      to: morePath(post.path),
    })),
  ),
)
</script>

<template>
  <AppLinkList title="故事无穷无尽，物语也无穷无尽。" :groups="groups" />
</template>
