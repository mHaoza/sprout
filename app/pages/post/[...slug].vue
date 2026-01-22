<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const appConfig = useAppConfig()

const slugPath = Array.isArray(slug) ? slug.join('/') : slug
const postName = slugPath.split('/').pop()

const { data: post } = await useAsyncData(`post-${slugPath}`, async () => {
  return queryCollection('articles').where('path', 'LIKE', `%${postName}%`).first()
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

    <div class="mx-auto max-w-4xl px-4 py-8">
      <div class="flex gap-8">
        <BlogPost :post="post" class="min-w-0 flex-1" />

        <div v-if="toc.length > 0" class="relative hidden w-0 xl:block">
          <div class="sticky top-24 ml-8 w-72">
            <BlogTOC :toc="toc" :stagger="0" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
