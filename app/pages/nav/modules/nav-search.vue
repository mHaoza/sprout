<script setup lang="ts">
import type { NavItem } from '~/assets/data/nav/types'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { navList } from '~/assets/data/nav'

const state = reactive({
  open: false,
  query: '',
  highlightedIndex: 0,
  numCols: 1,
})

const inputRef = ref<HTMLInputElement | null>(null)

function openPalette() {
  state.open = true
  state.query = ''
  state.highlightedIndex = 0
  nextTick(() => inputRef.value?.focus())
}
function closePalette() {
  state.open = false
}

// onGlobalKeydown 放到 results 定义之后，避免使用未定义变量

function normalize(text: string) {
  return (text ?? '').toLowerCase()
}

function containsSubsequence(needle: string, haystack: string) {
  if (!needle)
    return true
  let j = 0
  for (let i = 0; i < haystack.length && j < needle.length; i++) {
    if (haystack[i] === needle[j])
      j++
  }
  return j === needle.length
}

function tokenMatch(token: string, text: string) {
  // token 同时支持包含匹配与子序列匹配
  return text.includes(token) || containsSubsequence(token, text)
}

const results = computed<NavItem[]>(() => {
  const raw = normalize(state.query)
  const tokens = raw.split(/\s+/).filter(Boolean)
  if (tokens.length === 0)
    return navList.slice(0, 30)
  const list = navList
    .map((i) => {
      const target = normalize([
        i.name,
        i.desc,
        i.link,
        i.tags.join(','),
        i.category.join(','),
      ].join(' | '))
      const ok = tokens.every(t => tokenMatch(t, target))
      // 简单评分：匹配 token 数量 + 是否命中名称
      const nameTarget = normalize(i.name)
      const score = ok
        ? tokens.reduce((s, t) => s + (tokenMatch(t, nameTarget) ? 2 : 1), 0)
        : -1
      return { item: i, score, target }
    })
    .filter(x => x.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map(x => x.item)
  return list
})

// 结果集变化时重置高亮索引，避免越界（移出 computed 副作用）
watch(results, (list) => {
  if (state.highlightedIndex >= list.length)
    state.highlightedIndex = 0
})

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (!state.open)
      openPalette()
    else closePalette()
    return
  }
  if (!state.open)
    return
  // Ctrl + number quick open
  if ((e.ctrlKey || e.metaKey) && /^[1-9]$/.test(e.key)) {
    e.preventDefault()
    const idx = Number(e.key) - 1
    const item = results.value[idx]
    if (item)
      window.open(item.link, '_blank')
    return
  }
  // Esc to close
  if (e.key === 'Escape') {
    e.preventDefault()
    closePalette()
    return
  }
  // Arrow navigation in grid
  const last = Math.max(results.value.length - 1, 0)
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    state.highlightedIndex = Math.min(state.highlightedIndex + 1, last)
    return
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    state.highlightedIndex = Math.max(state.highlightedIndex - 1, 0)
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    state.highlightedIndex = Math.min(state.highlightedIndex + state.numCols, last)
    return
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    state.highlightedIndex = Math.max(state.highlightedIndex - state.numCols, 0)
    return
  }
  if (e.key === 'Enter') {
    e.preventDefault()
    const current = results.value[state.highlightedIndex]
    if (current)
      window.open(current.link, '_blank')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})

function onClickItem(i: number) {
  const item = results.value[i]
  if (item)
    window.open(item.link, '_blank')
}

watch(() => state.open, (v) => {
  if (v)
    nextTick(() => inputRef.value?.focus())
})

const gridRef = ref<HTMLDivElement | null>(null)
function computeNumCols() {
  const el = gridRef.value
  if (!el) {
    state.numCols = 1
    return
  }
  const style = window.getComputedStyle(el)
  const cols = style.gridTemplateColumns
  const count = cols ? cols.split(' ').filter(Boolean).length : 1
  state.numCols = Math.max(count, 1)
}
onMounted(() => {
  computeNumCols()
  window.addEventListener('resize', computeNumCols)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', computeNumCols)
})
watch(results, () => nextTick(computeNumCols))

// 样式直接写到模板中，去除拼接变量
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="state.open" class="fixed inset-0 z-100 i-flex-center bg-black/20 backdrop-blur-sm" @click.self="closePalette">
        <div class="max-w-[92vw] w-200 overflow-hidden border border-white/60 rd-2xl bg-white/80 shadow-xl backdrop-blur-xl">
          <div class="border-b border-[var(--theme-primary-color)]/20 bg-white/70 px-4 py-3">
            <div class="relative">
              <i class="i-heroicons-magnifying-glass absolute left-3 top-1/2 text-icon text-[var(--theme-primary-color)]/80 -translate-y-1/2" />
              <input
                ref="inputRef"
                v-model="state.query"
                class="w-full rd-md bg-white/80 py-2 pl-9 pr-3 text-gray-900 transition-all duration-200 placeholder:text-gray-500 focus:(outline-none ring-2 ring-offset-0 ring-[var(--theme-primary-color)])"
                placeholder="搜索站点、描述、标签（Ctrl+K 打开/关闭；Ctrl+数字快速打开）"
                type="text"
              >
            </div>
          </div>

          <div ref="gridRef" class="grid grid-cols-1 max-h-90 gap-2 overflow-auto p-2 md:grid-cols-3 sm:grid-cols-2">
            <div
              v-for="(nav, idx) in results"
              :key="nav.link + idx"
              :class="[
                'relative rd-lg px-3 py-2 cursor-pointer flex flex-col gap-1 border border-white/50 transition-all duration-150 bg-white/60 hover:bg-white/80 hover:shadow-sm',
                idx === state.highlightedIndex ? 'ring-1 ring-[var(--theme-primary-color)] ring-offset-0' : '',
              ].join(' ')"
              @mouseenter="state.highlightedIndex = idx"
              @click="onClickItem(idx)"
            >
              <div v-if="idx < 9" class="absolute right-2 top-2 rd-md bg-[var(--theme-primary-color)]/80 px-1.5 py-0.5 text-xs text-white">
                {{ idx + 1 }}
              </div>
              <div class="text-gray-900 font-semibold">
                {{ nav.name }}
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-600">
                <span class="inline-flex items-center gap-1">
                  <i class="i-heroicons-folder-open text-[12px] text-[var(--theme-primary-color)]/90" />
                  <span class="text-gray-700">{{ nav.category.join(' / ') }}</span>
                </span>
                <span class="opacity-30">·</span>
                <span class="inline-flex items-center gap-1">
                  <i class="i-heroicons-tag text-[12px] text-[var(--theme-accent-color)]/90" />
                  <span class="text-gray-700">{{ nav.tags.slice(0, 3).join(' / ') }}</span>
                </span>
              </div>
              <div class="text-xs text-gray-600">
                {{ nav.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
