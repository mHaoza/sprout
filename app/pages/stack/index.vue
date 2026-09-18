<script setup lang="ts">
useSeoMeta({
  title: '技术栈',
  description: '我日常在用的工具链、框架与开发环境。',
})

const { data: posts } = await useAsyncData('stack-index', () =>
  queryCollection('stack').order('date', 'DESC').all(),
)

const groups = computed(() =>
  groupByYear(
    (posts.value ?? []).map((post) => ({
      title: post.title,
      date: post.date,
      to: contentPath('stack', post.path),
    })),
  ),
)
</script>

<template>
  <AppLinkList title="只要拥有成为真物的意志，伪物就能够比真物更像真物。" :groups="groups" />
</template>
