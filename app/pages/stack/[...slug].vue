<script setup lang="ts">
const route = useRoute()

const slug = computed(() => {
  const param = route.params.slug
  return Array.isArray(param) ? String(param[param.length - 1]) : String(param ?? '')
})

const { data: post } = await useAsyncData(
  () => `stack-${slug.value}`,
  () => queryCollection('stack').where('path', 'LIKE', `%/${slug.value}`).first(),
  { watch: [slug] },
)

if (!post.value) {
  throw createError({ statusCode: 404, message: '页面未找到', fatal: true })
}

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
})
</script>

<template>
  <AppArticle v-if="post" :post="post">
    <PostContent :post="post" class="w-full min-w-0" />
  </AppArticle>
</template>
