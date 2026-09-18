<script setup lang="ts">
useSeoMeta({
  title: '友链',
  description: '一些我喜欢的、仍然在更新的角落。',
})

// 从 content 读取友链数据
const { data: linksData } = await useAsyncData('links', () => queryCollection('links').first())

const links = computed(() => linksData.value?.links || [])
</script>

<template>
  <AppPage title="相遇并非偶然，而是必然。">
    <div class="w-full space-y-8">
      <p data-slide class="text-subtle leading-relaxed">
        一份持续变化的清单。这里收藏着我最喜欢的互联网角落，每一条链接都通往一个仍然鲜活、值得探索的地方。
      </p>

      <ul v-if="links.length > 0" data-slide-auto class="grid w-full gap-3 sm:grid-cols-2">
        <li v-for="link in links" :key="link.url">
          <LinkCard
            :name="link.name"
            :url="link.url"
            :description="link.description"
            :avatar="link.avatar"
          />
        </li>
      </ul>

      <div
        v-else
        class="border-overlay text-muted rounded-md border border-dashed py-12 text-center text-sm"
      >
        暂无友链，以后会有的~
      </div>
    </div>
  </AppPage>
</template>
