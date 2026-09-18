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

/** 更多（more 集合） */
const { data: latestMore } = await useAsyncData('home-more', async () => {
  const posts = await queryCollection('more').order('date', 'DESC').all()
  return posts.slice(0, 5)
})

const articleItems = computed(
  () =>
    latestArticles.value?.map((post) => ({
      title: post.title,
      date: post.date,
      to: articlePath(post.path),
    })) ?? [],
)

const moreItems = computed(
  () =>
    latestMore.value?.map((post) => ({
      title: post.title,
      date: post.date,
      to: morePath(post.path),
    })) ?? [],
)
</script>

<template>
  <AppPage :show-nav="false">
    <HomeAbout />

    <div class="space-y-12">
      <HomeSection title="文章" to="/articles" icon="i-lucide-feather" :list="articleItems" />
      <HomeSection title="更多" to="/more" icon="i-lucide-flower-2" :list="moreItems" />
    </div>
  </AppPage>
</template>

<style scoped></style>
