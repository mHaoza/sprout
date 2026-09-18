<script setup lang="ts">
useSeoMeta({
  title: '文章',
  description: '技术文章与思考的归档。',
})

const { data: posts } = await useAsyncData('articles-index', () =>
  queryCollection('articles').order('date', 'DESC').all(),
)

const groups = computed(() =>
  groupByYear(
    (posts.value ?? []).map((post) => ({
      title: post.title,
      date: post.date,
      to: articlePath(post.path),
    })),
  ),
)
</script>

<template>
  <AppLinkList title="所谓天才，就是才能的积累" :groups="groups" />
</template>
