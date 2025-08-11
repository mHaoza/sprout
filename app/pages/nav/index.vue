<script setup lang="ts">
import type { NavItem } from '~/assets/data/nav/types'
import { computed, onMounted, ref, watch } from 'vue'
import { navList } from '~/assets/data/nav'
import FilterSidebar from './modules/filter-sidebar.vue'
import NavGrid from './modules/nav-grid.vue'
import NavSearch from './modules/nav-search.vue'

definePageMeta({ layout: 'blank' })

const allCategories = Array.from(new Set(navList.map(i => i.category?.[0] ?? '其它')))
const selectedCategory = ref<string[]>(allCategories.length ? [allCategories[0]!] : [])

const allTags = computed(() => {
  const scope = navList.filter(i => selectedCategory.value.length === 0
    ? true
    : i.category?.includes(selectedCategory.value[0]!))
  return Array.from(new Set(scope.flatMap(i => i.tags)))
})
const selectedTags = ref<string[]>([])

// 分类切换时清空已选择的标签，避免保留历史选择
watch(selectedCategory, () => {
  selectedTags.value = []
})

const filteredList = computed<NavItem[]>(() => {
  return navList.filter((i) => {
    const catOK = selectedCategory.value.length === 0
      ? true
      : i.category?.includes(selectedCategory.value[0]!)
    const tagsOK = selectedTags.value.length === 0
      ? true
      : i.tags.some(t => selectedTags.value.includes(t))
    return catOK && tagsOK
  })
})

onMounted(() => {
  // 保证默认选中第一个分类
  if (!selectedCategory.value.length && allCategories.length)
    selectedCategory.value = [allCategories[0]!]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50/30">
    <NavSearch />

    <!-- 侧边筛选栏 + 主内容区域 -->
    <div class="min-h-screen flex">
      <!-- 筛选侧边栏组件 -->
      <FilterSidebar
        :nav-list="navList"
        :selected-category="selectedCategory"
        :selected-tags="selectedTags"
        :all-categories="allCategories"
        :all-tags="allTags"
        :filtered-list="filteredList"
        @update:selected-category="selectedCategory = $event"
        @update:selected-tags="selectedTags = $event"
      />

      <!-- 导航网格组件 -->
      <NavGrid
        :filtered-list="filteredList"
        :selected-category="selectedCategory"
        :selected-tags="selectedTags"
      />
    </div>
  </div>
</template>
