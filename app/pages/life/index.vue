<script setup lang="ts">
useSeoMeta({
  title: '生活',
  description: '生活里的碎片、情绪与记录。',
})

const { data: posts } = await useAsyncData('life-index', () =>
  queryCollection('life').order('date', 'DESC').all(),
)

const groups = computed(() =>
  groupByYear(
    (posts.value ?? []).map((post) => ({
      title: post.title,
      date: post.date,
      to: contentPath('life', post.path),
    })),
  ),
)
</script>

<template>
  <AppLinkList title="所谓成长，就是不断发现过去的自己是个傻瓜的过程。" :groups="groups" />
</template>
