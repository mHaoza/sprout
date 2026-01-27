<script setup lang="ts">
import { navList } from '~/assets/data/nav'

const navSearch = useTemplateRef('navSearch')

const meta = {
  title: '站点收藏',
  description: '我的站点收藏',
}

useSeoMeta(meta)
</script>

<template>
  <div>
    <Banner
      :title="meta.title"
      image="https://img.iice.fun/blog/2025/11/12/8684c11604f1fef29480ed31cedd5935.webp"
      date="2025-11-11"
    />

    <div class="mx-auto mt-6 max-w-4xl px-4">
      <p class="flex cursor-pointer items-center text-sm" @click="navSearch?.open()">
        <UIcon name="i-lucide-search" class="mr-1 h-4 w-4" />
        搜索站点、描述、标签(Ctrl+K 打开/关闭搜索面板)
      </p>

      <div v-for="item in navList" :key="item.link" class="my-2">
        <a
          :href="item.link"
          class="hover:border-primary block rounded-md border border-transparent px-2 py-1 transition-colors"
        >
          <div>
            <span>{{ item.name }}</span>
            -
            <span class="text-sm">{{ item.desc }}</span>
          </div>
          <div class="flex items-center text-xs">
            <UIcon name="i-lucide-folder" class="mr-1 h-3 w-3" />
            <span>{{ item.category }}</span>
            <span class="mx-1">•</span>
            <template v-for="(tag, index) in item.tags" :key="index">
              <UIcon name="i-lucide-tag" class="mr-1 h-3 w-3" />
              <span class="mr-2">{{ tag }}</span>
            </template>
          </div>
        </a>
      </div>

      <NavSearch ref="navSearch" />
    </div>
  </div>
</template>
