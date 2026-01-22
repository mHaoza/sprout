<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

interface TocItem {
  listItem: HTMLLIElement
  anchor: HTMLAnchorElement
  target: HTMLElement
  pathStart?: number
  pathEnd?: number
}

interface Props {
  toc: TocLink[]
  stagger?: number
}

const props = withDefaults(defineProps<Props>(), {
  stagger: 0,
})

// 扁平化 TOC 结构
const flatToc = computed(() => {
  const flatten = (items: TocLink[]): TocLink[] => {
    return items.flatMap((item) => [item, ...(item.children ? flatten(item.children) : [])])
  }
  return flatten(props.toc)
})

// 计算缩进
function getIndent(depth: number) {
  if (depth === 2) return 'ml-0'
  if (depth === 3) return 'ml-4'
  if (depth === 4) return 'ml-8'
  if (depth === 5) return 'ml-12'
  if (depth === 6) return 'ml-16'
  return 'ml-0'
}

// Refs
const tocRef = ref<HTMLUListElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)
const lastPathStart = ref<number>(0)
const lastPathEnd = ref<number>(0)
const tocItemsRef = ref<TocItem[]>([])
const isSyncScheduled = ref<boolean>(false)
const progress = ref<number>(0)

// 更新进度
function updateProgress() {
  const html = document.documentElement
  const scrollableHeight = html.scrollHeight - html.clientHeight
  if (scrollableHeight > 0) {
    const scrolled = (html.scrollTop / scrollableHeight) * 100
    progress.value = Math.round(Math.min(100, Math.max(0, scrolled)))
  } else {
    progress.value = 0
  }
}

// 更新 TOC 项目
function updateTocItems() {
  const tocElement = tocRef.value
  if (!tocElement) return

  const listItems = [...tocElement.querySelectorAll('li')]

  tocItemsRef.value = listItems
    .map((item) => {
      const anchor = item.querySelector('a')
      if (!anchor) return null
      const target = document.getElementById(anchor.getAttribute('href')?.slice(1) || '')
      if (!target) return null

      return {
        listItem: item,
        anchor,
        target,
      }
    })
    .filter((item): item is TocItem => item !== null)
}

// 绘制 SVG 路径
function drawPath() {
  const path = pathRef.value
  if (!path) return

  const pathCommands: string[] = []
  let pathIndent: number

  tocItemsRef.value.forEach((item, i) => {
    const x = item.anchor.offsetLeft - 5
    const y = item.anchor.offsetTop
    const height = item.anchor.offsetHeight

    if (i === 0) {
      pathCommands.push(`M ${x} ${y} L ${x} ${y + height}`)
      item.pathStart = 0
    } else {
      if (pathIndent! !== x) {
        pathCommands.push(`L ${pathIndent!} ${y}`)
      }
      pathCommands.push(`L ${x} ${y}`)

      path.setAttribute('d', pathCommands.join(' '))
      item.pathStart = path.getTotalLength() || 0

      pathCommands.push(`L ${x} ${y + height}`)
    }

    pathIndent = x
    path.setAttribute('d', pathCommands.join(' '))
    item.pathEnd = path.getTotalLength()
  })

  sync()
}

// 同步滚动状态
function sync() {
  if (isSyncScheduled.value) return
  isSyncScheduled.value = true

  requestAnimationFrame(() => {
    const path = pathRef.value
    const nav = navRef.value
    if (!path || !nav) return

    const windowHeight = window.innerHeight
    let pathStart = Number.MAX_VALUE
    let pathEnd = 0
    let visibleItems = 0
    let activeItem: TocItem | undefined

    tocItemsRef.value.forEach((item, index) => {
      const targetBounds = item.target.getBoundingClientRect()

      let nextTarget: HTMLElement | null = null
      if (index < tocItemsRef.value.length - 1) {
        nextTarget = tocItemsRef.value[index + 1]?.target || null
      }

      const contentBottom = nextTarget
        ? nextTarget.getBoundingClientRect().top
        : document.documentElement.scrollHeight

      const margin = 100
      if (contentBottom > margin && targetBounds.top < windowHeight - margin) {
        pathStart = Math.min(item.pathStart || 0, pathStart)
        pathEnd = Math.max(item.pathEnd || 0, pathEnd)
        visibleItems += 1
        item.listItem.classList.add('visible')
      } else {
        item.listItem.classList.remove('visible')
      }
    })

    // 找到当前激活的项：最后一个已经滚过屏幕顶部的标题
    // 阈值设为 150px，即标题离顶部 150px 以内就算激活
    const activationThreshold = 150
    for (let i = tocItemsRef.value.length - 1; i >= 0; i--) {
      const item = tocItemsRef.value[i]
      if (!item) continue

      const targetBounds = item.target.getBoundingClientRect()

      // 找最后一个在激活阈值以上的标题
      if (targetBounds.top <= activationThreshold) {
        activeItem = item
        break
      }
    }

    // 如果没有找到 active 项（页面在顶部），默认激活第一个标题
    if (!activeItem && tocItemsRef.value.length > 0) {
      activeItem = tocItemsRef.value[0]
    }

    // 移除之前的 active 状态
    tocItemsRef.value.forEach((item) => {
      item.listItem.classList.remove('active')
    })

    // 添加当前 active 状态
    if (activeItem) {
      activeItem.listItem.classList.add('active')

      // 更新地址栏 hash
      // 如果在页面顶部（scrollTop < 50），清空 hash；否则更新为当前活跃标题
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop < 50) {
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }
      } else {
        const activeId = activeItem.anchor.getAttribute('href')
        if (activeId && window.location.hash !== activeId) {
          window.history.replaceState(null, '', activeId)
        }
      }

      const navBounds = nav.getBoundingClientRect()
      const activeItemBounds = activeItem.listItem.getBoundingClientRect()

      if (activeItemBounds.top < navBounds.top || activeItemBounds.bottom > navBounds.bottom) {
        nav.scrollTo({
          top:
            activeItem.listItem.offsetTop -
            nav.clientHeight / 2 +
            activeItem.listItem.clientHeight / 2,
          behavior: 'smooth',
        })
      }
    }

    if (visibleItems > 0 && pathStart < pathEnd) {
      if (pathStart !== lastPathStart.value || pathEnd !== lastPathEnd.value) {
        const pathLength = path.getTotalLength()
        path.setAttribute('stroke-dashoffset', '1')
        path.setAttribute(
          'stroke-dasharray',
          `1, ${pathStart}, ${pathEnd - pathStart}, ${pathLength}`,
        )
        path.setAttribute('opacity', '1')
      }
    } else {
      path.setAttribute('opacity', '0')
    }

    lastPathStart.value = pathStart
    lastPathEnd.value = pathEnd

    isSyncScheduled.value = false
  })
}

// 处理滚动
function handleScroll() {
  updateProgress()
  sync()
}

// 处理点击
function handleClick(e: Event, id: string) {
  e.preventDefault()
  const target = document.getElementById(id)
  if (target) {
    // 平滑滚动到目标
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // 更新 URL hash
    window.history.pushState(null, '', `#${id}`)

    sync()
  }
}

const debouncedDrawPath = useDebounceFn(drawPath, 100)
const throttledScroll = useThrottleFn(handleScroll, 50) // 减少节流时间，提高响应性

onMounted(async () => {
  await nextTick()
  updateProgress()
  updateTocItems()

  await nextTick()
  drawPath()

  await nextTick()
  sync()

  useEventListener(window, 'resize', debouncedDrawPath)
  useEventListener(document, 'scroll', throttledScroll, { passive: true })

  // 如果 URL 中已有 hash，滚动到对应位置
  if (window.location.hash) {
    const id = window.location.hash.slice(1)
    const target = document.getElementById(decodeURIComponent(id))
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      sync()
    }
  }
})
</script>

<template>
  <aside :style="{ '--enter-stagger': stagger }" class="group">
    <nav
      ref="navRef"
      class="max-h-[80vh] w-72 overflow-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div class="flex items-center gap-3 px-2">
        <UIcon name="i-lucide-list" class="h-4 w-4" />
        <span class="text-sm">{{ progress }}%</span>
      </div>
      <ul ref="tocRef" class="toc p-2 pr-4 text-sm">
        <li v-for="item in flatToc" :key="item.id" class="group">
          <a
            :href="`#${item.id}`"
            :class="[
              'decoration-muted/40 hover:decoration-muted flex h-7 items-center underline underline-offset-4',
              'group-[.active]:decoration-primary group-[.active]:font-semibold group-[.active]:decoration-2',
              getIndent(item.depth),
            ]"
            @click="handleClick($event, item.id)"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
      <svg class="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <path
          ref="pathRef"
          stroke="var(--color-primary-500)"
          stroke-width="3"
          fill="transparent"
          stroke-dasharray="0, 0, 0, 1000"
          stroke-linecap="round"
          stroke-linejoin="round"
          transform="translate(-0.5, -0.5)"
          class="transition-all duration-300 ease-in-out"
        />
      </svg>
    </nav>
  </aside>
</template>
