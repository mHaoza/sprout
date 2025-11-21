<script setup lang="ts">
import { Folder, Search, Tag } from 'lucide-vue-next'
import { navList } from '~/assets/data/nav'

const navSearch = useTemplateRef('navSearch')
const pageStore = usePageStore()

const meta = {
  title: '站点收藏',
  description: '我的站点收藏',
}

onMounted(() => {
  pageStore.setPageMeta({
    banner: {
      postTitle: meta.title,
      postMeta: 'haoza · 2025-11-11',
      bannerImage: 'https://img.iice.fun/blog/2025/11/12/8684c11604f1fef29480ed31cedd5935.webp',
    },
    description: meta.description,
  })
})
useSeoMeta(meta)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 mt-6">
    <p class="flex items-center text-sm text-muted-foreground cursor-pointer" @click="navSearch?.open()">
      <Search class="mr-1 h-4 w-4" />
      搜索站点、描述、标签(Ctrl+K 打开/关闭搜索面板)
    </p>

    <div v-for="item in navList" :key="item.link" class="my-2">
      <a :href="item.link" class="block border rounded-md py-1 px-2 border-transparent hover:border-blue-500 transition-colors">
        <div>
          <span>{{ item.name }}</span>
          -
          <span class="text-sm text-muted-foreground">{{ item.desc }}</span>
        </div>
        <div class="flex items-center text-xs text-muted-foreground">
          <Folder class="mr-1 h-3 w-3" />
          <span>{{ item.category }}</span>
          <span class="mx-1">•</span>
          <template v-for="(tag, index) in item.tags" :key="index">
            <Tag class="mr-1 h-3 w-3" />
            <span class="mr-2">{{ tag }}</span>
          </template>
        </div>
      </a>
    </div>

    <NavSearch ref="navSearch" />
  </div>
</template>
