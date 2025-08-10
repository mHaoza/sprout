<script setup lang="ts">
import type { NavItem } from '~/assets/data/nav/types'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { navList } from '~/assets/data/nav'

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

const keyword = ref('')

// 分类切换时清空已选择的标签，避免保留历史选择
watch(selectedCategory, () => {
  selectedTags.value = []
})

const filteredList = computed<NavItem[]>(() => {
  const kw = keyword.value.trim().toLowerCase()
  return navList.filter((i) => {
    const catOK = selectedCategory.value.length === 0
      ? true
      : i.category?.includes(selectedCategory.value[0]!)
    const tagsOK = selectedTags.value.length === 0
      ? true
      : i.tags.some(t => selectedTags.value.includes(t))
    const textOK = kw.length === 0
      ? true
      : [i.name, i.desc, i.link, i.tags.join(','), i.category.join(',')]
          .some(v => v?.toLowerCase().includes(kw))
    return catOK && tagsOK && textOK
  })
})

const hovered = reactive({
  item: null as null | NavItem,
  x: 0,
  y: 0,
})

function onEnter(item: NavItem) {
  hovered.item = item
}
function onMove(e: MouseEvent) {
  hovered.x = e.clientX + 16
  hovered.y = e.clientY + 12
}
function onLeave() {
  hovered.item = null
}

function toggle(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
  else {
    selectedTags.value.push(tag)
  }
}

onMounted(() => {
  // 保证默认选中第一个分类
  if (!selectedCategory.value.length && allCategories.length)
    selectedCategory.value = [allCategories[0]!]
})
</script>

<template>
  <div class="min-h-screen" @mousemove="onMove">
    <NavSearch />

    <!-- 侧边筛选栏 + 主内容区域 -->
    <div class="min-h-screen flex">
      <!-- 左侧筛选面板 -->
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
                @click="selectedCategory = [category]"
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
                class="text-xs text-gray-500"
                @click="selectedTags = []"
              >
                清空
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in allTags.slice(0, 20)"
                :key="tag"
                class="flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs transition-all duration-200 hover:scale-105"
                :class="[
                  selectedTags.includes(tag)
                    ? 'bg-[var(--theme-background-tone)] text-[var(--theme-accent-color)] border-[var(--theme-accent-color)]/30 shadow-sm'
                    : 'bg-gray-100/60 text-gray-600 border-transparent hover:bg-[var(--theme-highlight-hue)]',
                ]"
                @click="toggle(tag)"
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

      <!-- 右侧内容区域 -->
      <div class="flex-1 p-6">
        <!-- 当前筛选状态显示 -->
        <div class="mb-4 flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">当前:</span>
            <span class="rounded bg-[var(--theme-background-tone)] px-2 py-1 text-xs text-[var(--theme-primary-color)]">
              {{ selectedCategory[0] || '全部分类' }}
            </span>
            <span v-if="selectedTags.length > 0" class="text-xs text-gray-400">+</span>
            <span
              v-for="tag in selectedTags.slice(0, 3)"
              :key="tag"
              class="flex items-center gap-1 rounded bg-[var(--theme-background-tone)] px-2 py-1 text-xs text-[var(--theme-accent-color)]"
            >
              <i class="i-heroicons-tag text-xs opacity-70" />
              {{ tag }}
            </span>
            <span v-if="selectedTags.length > 3" class="text-xs text-gray-400">
              +{{ selectedTags.length - 3 }}个标签
            </span>
          </div>
        </div>

        <!-- 站点网格 -->
        <div class="grid grid-cols-4 gap-4 lg:grid-cols-5 xl:grid-cols-6">
          <a
            v-for="nav in filteredList"
            :key="`${nav.name}-${nav.link}`"
            :href="nav.link"
            target="_blank"
            class="group block border border-gray-200/60 rounded-lg p-4 transition-all duration-300 hover:scale-102 hover:border-[var(--theme-primary-color)] hover:bg-[var(--theme-background-tone)] hover:shadow-lg hover:-translate-y-1"

            @mouseenter="onEnter(nav)"
            @mouseleave="onLeave"
          >
            <!-- 站点图标 -->
            <div class="mx-auto mb-3 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-100/60 text-sm text-gray-600 font-semibold transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--theme-background-tone)] group-hover:text-[var(--theme-primary-color)]">
              {{ nav.name.charAt(0) }}
            </div>

            <!-- 站点名称 -->
            <h3 class="line-clamp-2 mb-1 text-center text-sm text-gray-800 font-medium transition-colors duration-300 group-hover:text-[var(--theme-primary-color)]">
              {{ nav.name }}
            </h3>

            <!-- 分类信息 -->
            <p class="text-center text-xs text-gray-500 transition-colors duration-300 group-hover:text-[var(--theme-accent-color)]">
              {{ nav.category[0] }}
            </p>
          </a>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredList.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
          <div class="mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-gray-100">
            <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="mb-2 text-lg font-medium">
            没有找到匹配的站点
          </p>
          <p class="text-sm">
            请调整筛选条件或使用搜索功能
          </p>
        </div>
      </div>
    </div>

    <!-- 简洁的Hover卡片 -->
    <transition name="hover-card">
      <div
        v-if="hovered.item"
        class="fixed z-50 max-w-xs overflow-hidden border border-gray-200/60 rounded-lg bg-white/80 shadow-lg backdrop-blur-sm"

        :style="{ left: `${hovered.x}px`, top: `${hovered.y}px` }"
      >
        <div class="p-4">
          <div class="mb-3 flex items-start gap-3">
            <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-[var(--theme-background-tone)] text-[var(--theme-primary-color)] font-semibold">
              {{ hovered.item?.name.charAt(0) }}
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="truncate text-gray-900 font-semibold">
                {{ hovered.item?.name }}
              </h4>
              <p class="text-xs text-[var(--theme-accent-color)]">
                {{ hovered.item?.category.join(' / ') }}
              </p>
            </div>
          </div>
          <p class="mb-3 text-sm text-gray-700 leading-relaxed">
            {{ hovered.item?.desc }}
          </p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in hovered.item?.tags.slice(0, 4)"
              :key="tag"
              class="flex items-center gap-1 rounded bg-[var(--theme-highlight-hue)] px-2 py-1 text-xs text-[var(--theme-accent-color)]"
            >
              <i class="i-heroicons-tag text-xs opacity-70" />
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.hover-card-enter-active,
.hover-card-leave-active {
  transition: all 0.15s ease-out;
}
.hover-card-enter-from,
.hover-card-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
