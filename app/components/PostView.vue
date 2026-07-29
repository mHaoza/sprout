<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const props = withDefaults(defineProps<{ collection?: string }>(), {
  collection: 'articles',
})

const slug = route.params.slug as string
const slugPath = Array.isArray(slug) ? slug.join('/') : slug
const postName = slugPath.split('/').pop()

const { data: post } = await useAsyncData(`post-${props.collection}-${slugPath}`, async () => {
  return queryCollection(props.collection as any)
    .where('path', 'LIKE', `%${postName}%`)
    .first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章未找到' })
}

setTimeout(() => {
  console.log(11, post.value?.body?.toc?.links)
}, 1000)
// 设置 SEO meta
useSeoMeta({ title: post.value?.title || '文章' })
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
        <PostContent :post="post" class="min-w-0 flex-1" />

        <div class="relative hidden w-0 xl:block">
          <div class="sticky top-24 ml-8 w-72">
            <UContentToc
              highlight
              highlight-color="primary"
              highlight-variant="circuit"
              :links="post?.body?.toc?.links"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
