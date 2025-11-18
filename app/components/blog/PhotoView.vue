<script setup lang="ts">
import { Camera, Image as ImageIcon } from 'lucide-vue-next'
import Viewer from 'viewerjs'
import { cn } from '@/lib/utils'
import 'viewerjs/dist/viewer.css'

interface Props {
  src: string
  alt?: string
  originalsrc?: string
  width?: number | string
  height?: number | string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  originalsrc: '',
  width: undefined,
  height: undefined,
})

const imageRef = useTemplateRef('imageRef')
const isReady = ref(false)
let viewer: Viewer | null = null

// 预览时使用的图片地址（优先使用原图）
const previewSrc = computed(() => {
  return props.originalsrc || props.src
})

// 初始化 Viewer
onMounted(() => {
  if (imageRef.value) {
    imageRef.value.src = props.src
    viewer = new Viewer(imageRef.value, {
      zIndex: 9999,
      toolbar: {
        zoomIn: true,
        zoomOut: true,
        oneToOne: true,
        reset: true,
        prev: false,
        play: false,
        next: false,
        rotateLeft: true,
        rotateRight: true,
        flipHorizontal: true,
        flipVertical: true,
      },
      navbar: false,
      title: false,
      url: 'data-source', // 使用 data-source 属性作为预览图源
    })
  }
})

// 销毁 Viewer
onBeforeUnmount(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})
</script>

<template>
  <figure>
    <!-- 图片容器 -->
    <div
      class="relative block"
      :style="props.width && props.height ? { aspectRatio: `${props.width}/${props.height}` } : {}"
    >
      <img
        ref="imageRef"
        :data-source="previewSrc"
        :alt="props.alt"
        :width="props.width"
        :height="props.height"
        draggable="false"
        loading="lazy"
        :class="cn(
          'm-0 h-full w-full max-w-none cursor-pointer object-cover rounded-lg',
          isReady ? 'opacity-100' : 'opacity-0',
          props.class,
        )"
        @load="isReady = true"
      >

      <!-- 加载占位符 -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="!isReady"
          class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-muted/50"
        >
          <UiSpinner />
        </div>
      </Transition>
    </div>

    <!-- 图片说明 -->
    <figcaption
      v-if="props.alt"
      class="text-muted-foreground my-2 block text-center text-sm italic"
    >
      <Camera
        v-if="originalsrc"
        class="mr-1 inline h-4 w-4"
        weight="duotone"
      />
      <ImageIcon
        v-else
        class="mr-1 inline h-4 w-4"
        weight="duotone"
      />
      <span class="align-text-top">{{ props.alt }}</span>
    </figcaption>
  </figure>
</template>
