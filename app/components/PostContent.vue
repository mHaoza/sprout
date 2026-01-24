<script setup lang="ts">
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

interface Props {
  post?: any
  class?: string
}

const props = defineProps<Props>()

const articleRef = ref<HTMLElement | null>(null)
let viewer: Viewer | null = null
let observer: MutationObserver | null = null

onMounted(() => {
  if (articleRef.value) {
    viewer = new Viewer(articleRef.value, {
      zIndex: 9999,
      url: 'data-source',
      toolbar: {
        zoomIn: true,
        zoomOut: true,
        oneToOne: true,
        reset: true,
        prev: true,
        play: true,
        next: true,
        rotateLeft: true,
        rotateRight: true,
        flipHorizontal: true,
        flipVertical: true,
      },
      navbar: true,
      title: true,
    })

    observer = new MutationObserver(() => {
      if (viewer) {
        viewer.update()
      }
    })
    observer.observe(articleRef.value, {
      childList: true,
      subtree: true,
    })
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})

watch(
  () => props.post,
  async () => {
    await nextTick()
    if (viewer) {
      viewer.update()
    }
  },
  { deep: true },
)
</script>

<template>
  <article :class="props.class">
    <!-- 文章内容 -->
    <div ref="articleRef" class="prose max-w-none">
      <ContentRenderer :value="post" />
    </div>
  </article>
</template>
