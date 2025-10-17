<script setup lang="ts">
import type { NavItem } from '~/assets/data/nav/types'

interface Props {
  navList: NavItem[]
  selectedCategory: string[]
  selectedTags: string[]
  allCategories: string[]
  allTags: string[]
  filteredList: NavItem[]
}

interface Emits {
  'update:selectedCategory': [value: string[]]
  'update:selectedTags': [value: string[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function selectCategory(category: string) {
  emit('update:selectedCategory', [category])
}

function toggleTag(tag: string) {
  const currentTags = [...props.selectedTags]
  const index = currentTags.indexOf(tag)
  if (index > -1) {
    currentTags.splice(index, 1)
  }
  else {
    currentTags.push(tag)
  }
  emit('update:selectedTags', currentTags)
}

function clearTags() {
  emit('update:selectedTags', [])
}
</script>

<template>
  <div class="w-72 flex-shrink-0 border-r border-gray-200/60">
    <div class="p-6">
      <h2 class="mb-6 text-lg text-gray-800 font-semibold">
        筛选导航
      </h2>

      <!-- 分类筛选 -->
      <div class="mb-8">
        <h3 class="mb-3 flex items-center gap-2 text-sm text-gray-700 font-medium">
          <span class="h-4 w-1 rounded-full bg-[var(--theme-primary-color)]" />
          分类选择
        </h3>
        <div class="space-y-2">
          <button
            v-for="category in allCategories"
            :key="category"
            class="w-full flex items-center gap-2 border rounded-lg px-3 py-2 text-left text-sm transition-all duration-200"
            :class="[
              selectedCategory.includes(category)
                ? 'bg-[var(--theme-background-tone)] text-[var(--theme-primary-color)] border-[var(--theme-primary-color)]/30 shadow-sm'
                : 'text-gray-600 border-transparent hover:bg-[var(--theme-background-tone)]',
            ]"
            @click="selectCategory(category)"
          >
            <i class="i-heroicons-folder text-base opacity-70" />
            <span class="flex-1">{{ category }}</span>
            <span class="text-xs opacity-60">
              {{ navList.filter(n => n.category?.includes(category)).length }}
            </span>
          </button>
        </div>
      </div>

      <!-- 标签筛选 -->
      <div class="mb-6">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <span class="h-4 w-1 rounded-full bg-[var(--theme-accent-color)]" />
            标签筛选
          </h3>
          <button
            v-if="selectedTags.length > 0"
            class="text-xs text-gray-500 transition-colors hover:text-[var(--theme-accent-color)]"
            @click="clearTags"
          >
            清空
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in allTags.slice(0, 20)"
            :key="tag"
            class="flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs transition-all duration-200"
            :class="[
              selectedTags.includes(tag)
                ? 'bg-[var(--theme-background-tone)] text-[var(--theme-accent-color)] border-[var(--theme-accent-color)]/30 shadow-sm'
                : 'bg-gray-100/60 text-gray-600 border-transparent hover:bg-[var(--theme-highlight-hue)]',
            ]"
            @click="toggleTag(tag)"
          >
            <i class="i-heroicons-tag text-xs opacity-70" />
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- 结果统计 -->
      <div class="border-t border-gray-100 pt-4">
        <div class="text-sm text-gray-600">
          <span class="text-[var(--theme-text-shade)] font-medium">{{ filteredList.length }}</span> 个站点
          <span class="text-gray-400">/ {{ navList.length }} 总计</span>
        </div>
      </div>
    </div>
  </div>
</template>
