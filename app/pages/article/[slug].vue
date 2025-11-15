<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: post } = await useAsyncData(`article-${slug}`, () => {
  return queryCollection('article').path(`/blog/article/${slug}`).first()
})

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '文章未找到',
  })
}

// 获取 TOC 数据
const toc = computed(() => {
  return post.value?.body?.toc?.links || []
})

// 设置页面元数据
useHead({
  title: post.value?.title || '文章',
  meta: [
    {
      name: 'description',
      content: post.value?.description || '',
    },
  ],
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex gap-8">
      <BlogPost :post="post" class="flex-1 min-w-0" />

      <div v-if="toc.length > 0" class="hidden xl:block w-0 relative">
        <div class="sticky top-24 w-72 ml-8">
          <BlogTOC :toc="toc" :stagger="0" />
        </div>
      </div>
    </div>
  </div>
</template>
