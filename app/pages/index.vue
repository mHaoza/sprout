<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
  // title: appConfig.site.name,
  description: appConfig.site.description,
})

/** 最新文章（articles 集合） */
const { data: latestArticles } = await useAsyncData('home-articles', async () => {
  const posts = await queryCollection('articles').order('date', 'DESC').all()
  return posts.slice(0, 5)
})

/** 技术栈（stack 集合） */
const { data: latestStack } = await useAsyncData('home-stack', async () => {
  const posts = await queryCollection('stack').order('date', 'DESC').all()
  return posts.slice(0, 5)
})

/** 生活（life 集合） */
const { data: latestLife } = await useAsyncData('home-life', async () => {
  const posts = await queryCollection('life').order('date', 'DESC').all()
  return posts.slice(0, 5)
})

/** 更多（more 集合，当前内容为空，区块会自动隐藏） */
const { data: latestMore } = await useAsyncData('home-more', async () => {
  const posts = await queryCollection('more').order('date', 'DESC').all()
  return posts.slice(0, 5)
})

/** 集合 → 首页区块列表项的通用映射 */
function toItems(posts: typeof latestArticles.value, collection: string) {
  return (
    posts?.map((post) => ({
      title: post.title,
      date: post.date,
      to: contentPath(collection, post.path),
    })) ?? []
  )
}

const articleItems = computed(() => toItems(latestArticles.value, 'articles'))
const stackItems = computed(() => toItems(latestStack.value, 'stack'))
const lifeItems = computed(() => toItems(latestLife.value, 'life'))
const moreItems = computed(() => toItems(latestMore.value, 'more'))
</script>

<template>
  <AppPage :show-nav="false">
    <HomeAbout />

    <!-- data-slide-start="2" 接着 HomeAbout 的 2 个子元素继续错峰 -->
    <div data-slide-auto data-slide-start="2" class="space-y-12">
      <HomeSection title="文章" to="/articles" icon="i-lucide-feather" :list="articleItems" />
      <HomeSection title="技术栈" to="/stack" icon="i-lucide-layers" :list="stackItems" />
      <HomeSection title="生活" to="/life" icon="i-lucide-flower-2" :list="lifeItems" />
      <HomeSection title="更多" to="/more" icon="i-lucide-ellipsis" :list="moreItems" />
    </div>
  </AppPage>
</template>

<style scoped></style>
