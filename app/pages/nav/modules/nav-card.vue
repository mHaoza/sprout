<script setup lang="ts">
import type { NavItem } from '~/assets/data/nav/types'

interface Props {
  nav: NavItem
}

const props = defineProps<Props>()

// 处理卡片点击，在新标签页打开链接
function handleCardClick() {
  window.open(props.nav.link, '_blank', 'noopener,noreferrer')
}

// 获取网站图标 URL（如果没有 icon，使用 Google 的 favicon 服务）
function getIconUrl(nav: NavItem): string | undefined {
  if (nav.icon)
    return nav.icon

  try {
    const url = new URL(nav.link)
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`
  }
  catch {
    return undefined
  }
}

// 处理图片加载错误
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
  }
}

// 限制显示的标签数量
const displayTags = computed(() => props.nav.tags.slice(0, 2))
</script>

<template>
  <article
    class="group relative cursor-pointer overflow-hidden border border-gray-200/60 rounded-lg bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-[var(--theme-primary-color)]/30 hover:shadow-md"
    @click="handleCardClick"
  >
    <!-- 主要内容区域 -->
    <div class="relative h-full flex flex-col p-3">
      <!-- 头部：图标、标题和分类 -->
      <div class="mb-2 flex items-center gap-2.5">
        <!-- 网站图标 -->
        <div class="h-8 w-8 flex shrink-0 items-center justify-center overflow-hidden rounded-md from-gray-100 to-gray-200 bg-gradient-to-br">
          <img
            v-if="getIconUrl(nav)"
            :src="getIconUrl(nav)"
            :alt="`${nav.name} 图标`"
            class="h-5 w-5 object-contain"
            @error="handleImageError"
          >
          <div v-else class="h-5 w-5 flex items-center justify-center text-gray-400">
            <i class="i-heroicons-globe-alt text-sm" />
          </div>
        </div>

        <!-- 标题和分类 -->
        <div class="min-w-0 flex flex-1 items-center justify-between">
          <h3 class="line-clamp-1 text-sm text-gray-800 font-medium transition-colors duration-200 group-hover:text-[var(--theme-primary-color)]">
            {{ nav.name }}
          </h3>
          <span class="ml-2 inline-flex shrink-0 items-center gap-1 rounded bg-[var(--theme-background-tone)] px-1.5 py-0.5 text-xs text-[var(--theme-primary-color)] font-medium">
            <i class="i-heroicons-folder text-xs" />
            {{ nav.category[0] || '其它' }}
          </span>
        </div>
      </div>

      <!-- 描述 -->
      <div class="mb-2 flex-1">
        <p class="line-clamp-2 text-xs text-gray-600 leading-relaxed">
          {{ nav.desc }}
        </p>
      </div>

      <!-- 底部：标签（固定在底部） -->
      <div class="mt-auto flex items-center justify-between">
        <!-- 标签组 -->
        <div class="min-w-0 flex flex-1 flex-wrap gap-1">
          <span
            v-for="tag in displayTags"
            :key="tag"
            class="inline-flex items-center gap-0.5 rounded bg-gray-100/70 px-1.5 py-0.5 text-xs text-gray-500 font-normal"
          >
            <i class="i-heroicons-tag text-[10px] opacity-60" />
            {{ tag }}
          </span>
          <span
            v-if="nav.tags.length > 2"
            class="inline-flex items-center gap-0.5 rounded bg-gray-100/50 px-1.5 py-0.5 text-xs text-gray-400 font-normal"
          >
            <i class="i-heroicons-ellipsis-horizontal text-[10px]" />
            +{{ nav.tags.length - 2 }}
          </span>
        </div>

        <!-- 外链指示器 -->
        <div class="ml-2 shrink-0 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
          <i class="i-heroicons-arrow-top-right-on-square text-xs text-[var(--theme-primary-color)]" />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* 限制文本行数的工具类 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>
