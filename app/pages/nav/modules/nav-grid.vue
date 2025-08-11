<script setup lang="ts">
import type { NavItem } from '~/assets/data/nav/types'
import NavCard from './nav-card.vue'

interface Props {
  filteredList: NavItem[]
  selectedCategory: string[]
  selectedTags: string[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex-1 p-6">
    <!-- 当前筛选状态显示 -->
    <div class="mb-6 flex items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">当前筛选:</span>
        <span class="rounded-lg bg-[var(--theme-background-tone)] px-3 py-1.5 text-sm text-[var(--theme-primary-color)] font-medium shadow-sm">
          {{ props.selectedCategory[0] || '全部分类' }}
        </span>
        <span v-if="props.selectedTags.length > 0" class="text-xs text-gray-400">+</span>
        <span
          v-for="tag in props.selectedTags.slice(0, 3)"
          :key="tag"
          class="flex items-center gap-1 rounded-lg bg-[var(--theme-background-tone)] px-2 py-1 text-xs text-[var(--theme-accent-color)] font-medium shadow-sm"
        >
          <i class="i-heroicons-tag text-xs opacity-70" />
          {{ tag }}
        </span>
        <span v-if="props.selectedTags.length > 3" class="text-xs text-gray-400 font-medium">
          +{{ props.selectedTags.length - 3 }}个标签
        </span>
      </div>
    </div>

    <!-- 站点网格 - 紧凑响应式布局 -->
    <div class="grid auto-rows-fr grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 xl:grid-cols-6">
      <NavCard
        v-for="nav in props.filteredList"
        :key="`${nav.name}-${nav.link}`"
        :nav="nav"
        class="min-h-[110px]"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="props.filteredList.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
      <div class="mb-6 h-20 w-20 flex items-center justify-center rounded-full from-gray-100 to-gray-200 bg-gradient-to-br">
        <svg class="h-10 w-10" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
      <p class="mb-2 text-xl text-gray-500 font-semibold">
        没有找到匹配的站点
      </p>
      <p class="text-sm text-gray-400">
        请调整筛选条件或使用搜索功能
      </p>
    </div>
  </div>
</template>
