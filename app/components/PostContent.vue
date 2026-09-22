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
    <div
      ref="articleRef"
      class="prose prose-rosepine prose-strong:text-love prose-strong:font-extrabold prose-img:rounded-md w-full max-w-none min-w-px"
    >
      <!--
        逐块错峰入场：
        ContentRenderer 的根元素是 MDCRenderer，它会把「额外 attrs」落到真正的根标签上
        （见 MDCRenderer.vue 的 `h(component, { ..., ...this.$attrs })`），
        所以这里必须把 data-slide-auto 传给 ContentRenderer 而不是外层那个 div：
        外层 div 只有这一个孩子，挂上去等于整篇正文一起滑入，出不来逐块效果。
      -->
      <ContentRenderer :value="post" data-slide-auto data-slide-start="0" />
    </div>
  </article>
</template>
