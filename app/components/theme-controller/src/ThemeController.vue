<script setup lang="ts">
import { themeList } from './theme-list'

type Theme = (typeof themeList)[number]

const themeStore = useThemeStore()
const { anchorEl, panelVisible, selectedTheme, autoTheme, currentTheme } = storeToRefs(themeStore)

themeStore.init()

const panelEl = useTemplateRef<HTMLElement>('panelEl')

/** 悬停时用于顶部预览的主题 */
const hovered = ref<Theme | null>(null)

/** 二十四节气，每季 6 个，顺序与 themeList 保持一致 */
const seasons = [
  { label: '春', items: themeList.slice(0, 6) },
  { label: '夏', items: themeList.slice(6, 12) },
  { label: '秋', items: themeList.slice(12, 18) },
  { label: '冬', items: themeList.slice(18, 24) },
]

const preview = computed(() => hovered.value ?? currentTheme.value ?? themeList[0]!)
const isAuto = computed(() => !selectedTheme.value)

/* ------------------------------------------------------------------
 * 定位：贴着触发按钮，并让面板与按钮右边缘对齐
 * 打开时直接量取按钮矩形（视口坐标，配合 position: fixed），
 * 滚动/缩放时重新量取，避免用到过期的位置。
 * 注意用 includeScrollbar: false —— fixed 元素的包含块是布局视口，
 * 不含滚动条，用含滚动条的 window.innerWidth 会横向偏一个滚动条宽度。
 * ------------------------------------------------------------------ */
const { height: viewportHeight, width: viewportWidth } = useWindowSize({ includeScrollbar: false })

const PANEL_WIDTH = 256
const GAP = 10

const anchorRect = ref<{ top: number; right: number; bottom: number } | null>(null)
const panelHeight = ref(PANEL_WIDTH)

function measureAnchor() {
  const el = anchorEl.value
  if (!el) {
    anchorRect.value = null
    return
  }

  const { top, right, bottom } = el.getBoundingClientRect()
  anchorRect.value = { top, right, bottom }
}

// 预览文案换行会改变高度，实测以决定向上还是向下弹出
useResizeObserver(panelEl, () => {
  if (panelEl.value) {
    panelHeight.value = panelEl.value.offsetHeight
  }
})

/** 优先放在按钮上方，上方空间不足再放到下方 */
const placeAbove = computed(() => {
  const rect = anchorRect.value
  if (!rect) {
    return true
  }

  const spaceAbove = rect.top - GAP
  const spaceBelow = viewportHeight.value - rect.bottom - GAP
  return spaceAbove >= panelHeight.value || spaceAbove > spaceBelow
})

const panelStyle = computed(() => {
  const rect = anchorRect.value
  const vw = viewportWidth.value
  const vh = viewportHeight.value

  // 极少数情况下（按钮已被移除）兜底到右下角
  if (!rect) {
    return { right: `${GAP * 2}px`, bottom: `${GAP * 2}px` }
  }

  const maxRight = Math.max(GAP, vw - PANEL_WIDTH - GAP)
  const right = `${Math.min(Math.max(vw - rect.right, GAP), maxRight)}px`

  // 收敛到视口内，避免触发按钮滚出视口后面板跟着跑出屏幕
  const desired = placeAbove.value ? vh - rect.top + GAP : rect.bottom + GAP
  const headroom = Math.max(GAP, vh - panelHeight.value - GAP)
  const offset = `${Math.min(Math.max(desired, GAP), headroom)}px`

  return placeAbove.value ? { right, bottom: offset } : { right, top: offset }
})

onClickOutside(panelEl, () => themeStore.closePanel(), { ignore: [anchorEl] })

onKeyStroke('Escape', () => {
  if (panelVisible.value) {
    themeStore.closePanel()
  }
})

useEventListener(
  'scroll',
  () => {
    if (panelVisible.value) {
      measureAnchor()
    }
  },
  { capture: true, passive: true },
)

watch([viewportWidth, viewportHeight], () => {
  if (panelVisible.value) {
    measureAnchor()
  }
})

watch(
  panelVisible,
  (visible) => {
    if (visible) {
      measureAnchor()
    } else {
      hovered.value = null
    }
  },
  { flush: 'sync' },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="theme-panel">
      <div
        v-if="panelVisible"
        ref="panelEl"
        role="radiogroup"
        aria-label="节气主题"
        class="border-overlay bg-surface fixed z-50 w-64 max-w-[calc(100vw-20px)] rounded-md border p-3"
        :class="placeAbove ? 'origin-bottom-right' : 'origin-top-right'"
        :style="panelStyle"
        @mouseleave="hovered = null"
      >
        <!-- 预览：名称 / 描述 / 物候 -->
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="flex items-baseline gap-1.5">
              <span class="text-text text-sm font-bold">{{ preview.name }}</span>
              <span class="text-subtle text-xs">{{ preview.description }}</span>
            </p>
            <p class="text-muted mt-1 text-xs leading-relaxed">{{ preview.poetry }}</p>
          </div>

          <button
            type="button"
            aria-label="关闭"
            class="text-muted hover:text-text -mt-0.5 -mr-0.5 shrink-0 cursor-pointer p-0.5 transition-colors duration-300"
            @click="themeStore.closePanel()"
          >
            <UIcon name="i-lucide-x" class="size-3.5" />
          </button>
        </div>

        <!-- 二十四节气色卡 -->
        <div
          class="border-overlay mt-2.5 grid grid-cols-[0.9rem_repeat(6,1fr)] items-center gap-x-1 gap-y-2 border-t pt-3"
        >
          <template v-for="season in seasons" :key="season.label">
            <span class="text-muted text-[11px] leading-none">{{ season.label }}</span>

            <button
              v-for="theme in season.items"
              :key="theme.name"
              type="button"
              role="radio"
              :aria-checked="selectedTheme === theme.name"
              :aria-label="theme.name"
              :title="theme.name"
              class="relative size-6 cursor-pointer justify-self-center rounded-full transition-transform duration-200 hover:scale-115 focus-visible:outline-none"
              @click="themeStore.selectTheme(theme)"
              @mouseenter="hovered = theme"
              @focus="hovered = theme"
            >
              <span
                class="border-overlay absolute inset-0 rounded-full border"
                :class="`bg-${theme.colors.primary}-500`"
              ></span>
              <span
                class="border-surface absolute right-0 bottom-0 size-2 rounded-full border"
                :class="`bg-${theme.colors.secondary}-500`"
              ></span>

              <!-- 当前节气 -->
              <span
                v-if="theme.name === autoTheme.name"
                class="bg-text absolute -top-1 left-1/2 size-1 -translate-x-1/2 rounded-full"
              ></span>

              <!-- 已选中 -->
              <span
                v-if="selectedTheme === theme.name"
                class="ring-text/50 absolute -inset-1 rounded-full ring-1"
              ></span>
            </button>
          </template>
        </div>

        <!-- 跟随节气 -->
        <p
          v-if="isAuto"
          class="border-overlay text-muted mt-3 flex items-center justify-center gap-1.5 rounded-md border border-dashed py-1.5 text-xs"
        >
          <UIcon name="i-lucide-sparkles" class="size-3.5" />
          正在跟随节气 · {{ autoTheme.name }}
        </p>

        <button
          v-else
          type="button"
          class="border-overlay text-subtle hover:border-muted hover:text-text mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed py-1.5 text-xs transition-colors duration-300"
          @click="themeStore.resetTheme()"
        >
          <UIcon name="i-lucide-rotate-ccw" class="size-3.5" />
          恢复跟随节气 · {{ autoTheme.name }}
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.theme-panel-enter-active,
.theme-panel-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.theme-panel-enter-from,
.theme-panel-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
