<script setup lang="ts">
export interface TocEntry {
  id: string
  title: string
  depth: number
}

const props = defineProps<{
  toc: TocEntry[]
}>()

interface TocItemRef {
  listItem: HTMLLIElement
  anchor: HTMLAnchorElement
  target: HTMLElement
  pathStart?: number
  pathEnd?: number
}

const navRef = ref<HTMLElement | null>(null)
const tocRef = ref<HTMLUListElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)

const progress = ref(0)

let items: TocItemRef[] = []
let lastPathStart = 0
let lastPathEnd = 0
let syncScheduled = false

function getIndent(depth: number) {
  if (depth === 3) return 'ml-4'
  if (depth === 4) return 'ml-8'
  return 'ml-0'
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value =
    scrollable > 0 ? Math.round(Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))) : 0
}

function collectItems() {
  const tocElement = tocRef.value
  if (!tocElement) return

  items = [...tocElement.querySelectorAll('li')]
    .map((listItem) => {
      const anchor = listItem.querySelector('a')
      if (!anchor) return null

      const id = anchor.getAttribute('href')?.slice(1) ?? ''
      const target = document.getElementById(id)
      if (!target) return null

      return { listItem, anchor, target } satisfies TocItemRef
    })
    .filter((item): item is TocItemRef => item !== null)
}

function drawPath() {
  const path = pathRef.value
  if (!path || items.length === 0) return

  const commands: string[] = []
  let pathIndent: number | undefined

  items.forEach((item, index) => {
    const x = item.anchor.offsetLeft - 5
    const y = item.anchor.offsetTop
    const height = item.anchor.offsetHeight

    if (index === 0) {
      commands.push(`M ${x} ${y} L ${x} ${y + height}`)
      item.pathStart = 0
    } else {
      if (pathIndent !== x) {
        commands.push(`L ${pathIndent} ${y}`)
      }
      commands.push(`L ${x} ${y}`)

      path.setAttribute('d', commands.join(' '))
      item.pathStart = path.getTotalLength() || 0
      commands.push(`L ${x} ${y + height}`)
    }

    pathIndent = x
    path.setAttribute('d', commands.join(' '))
    item.pathEnd = path.getTotalLength()
  })

  sync()
}

function sync() {
  if (syncScheduled) return
  syncScheduled = true

  requestAnimationFrame(() => {
    const path = pathRef.value
    const nav = navRef.value
    if (!path || !nav) {
      syncScheduled = false
      return
    }

    const windowHeight = window.innerHeight
    let pathStart = Number.MAX_VALUE
    let pathEnd = 0
    let visibleItems = 0
    let activeItem: TocItemRef | undefined

    items.forEach((item, index) => {
      const targetBounds = item.target.getBoundingClientRect()
      const nextTarget = items[index + 1]?.target ?? null
      const contentBottom = nextTarget
        ? nextTarget.getBoundingClientRect().top
        : document.documentElement.scrollHeight

      const margin = 50
      if (contentBottom > margin && targetBounds.top < windowHeight - margin) {
        pathStart = Math.min(item.pathStart ?? 0, pathStart)
        pathEnd = Math.max(item.pathEnd ?? 0, pathEnd)
        visibleItems += 1
        item.listItem.classList.add('visible')

        if (targetBounds.top <= margin) {
          activeItem = item
        }
      } else {
        item.listItem.classList.remove('visible')
      }
    })

    if (activeItem) {
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
      if (pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
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

    lastPathStart = pathStart
    lastPathEnd = pathEnd
    syncScheduled = false
  })
}

function onScroll() {
  updateProgress()
  sync()
}

let resizeTimer: ReturnType<typeof setTimeout> | undefined

function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    collectItems()
    drawPath()
  }, 100)
}

let scrollRaf = 0
function onScrollThrottled() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0
    onScroll()
  })
}

onMounted(async () => {
  await nextTick()
  updateProgress()
  collectItems()
  drawPath()

  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScrollThrottled, { passive: true })
})

onBeforeUnmount(() => {
  clearTimeout(resizeTimer)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScrollThrottled)
})
</script>

<template>
  <aside data-slide data-slide-start="2" class="group hidden w-0 xl:block">
    <nav
      ref="navRef"
      class="scrollbar-hide sticky top-25 max-h-[80vh] w-72 translate-x-6 overflow-auto overscroll-contain"
    >
      <div class="text-subtle flex items-center gap-3 px-2">
        <UIcon name="i-lucide-list" class="size-4.5" />
        <span class="text-sm">{{ progress }}%</span>
      </div>

      <ul ref="tocRef" class="toc p-2 pr-4 text-sm">
        <li v-for="item in props.toc" :key="item.id">
          <a
            :href="`#${item.id}`"
            :class="[
              'text-muted decoration-muted/40 hover:text-text hover:decoration-muted flex h-7 items-center underline underline-offset-2 duration-300',
              getIndent(item.depth),
            ]"
          >
            {{ item.title }}
          </a>
        </li>
      </ul>

      <svg class="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <path
          ref="pathRef"
          stroke="var(--color-muted)"
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
