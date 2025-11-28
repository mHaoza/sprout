<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const appConfig = useAppConfig()

const slugPath = Array.isArray(slug) ? slug.join('/') : slug
const postName = slugPath.split('/').pop()

const { data: post } = await useAsyncData(`post-${slugPath}`, async () => {
  return queryCollection('article').where('path', 'LIKE', `%${postName}%`).first()
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

// 设置 SEO meta
useSeoMeta({
  title: post.value?.title || '文章',
})
</script>

<template>
  <div>
    <Banner
      :title="post?.title || '文章'"
      :category="post?.category"
      :tags="post?.tags"
      :image="post?.image"
      :author="post?.author ?? appConfig.site.author"
      :date="post?.date"
    />

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
  </div>
</template>
