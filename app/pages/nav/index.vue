<script setup lang="ts">
import { navList } from '~/assets/data/nav'

const navSearch = useTemplateRef('navSearch')
</script>

<template>
  <div>
    <div class="flex cursor-pointer items-center text-gray-500" @click="navSearch?.openPalette()">
      <span class="i-mdi-search mr-2 inline-block" />
      搜索站点、描述、标签(Ctrl+K 打开/关闭搜索面板)
    </div>

    <div v-for="item in navList" :key="item.link" class="my-2">
      <a :href="item.link" class="hover:text-[--theme-primary-color]">
        <span>{{ item.name }}</span>
        -
        <span>{{ item.desc }}</span>
      </a>
    </div>

    <NavSearch ref="navSearch" />
  </div>
</template>
