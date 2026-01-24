<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  originalsrc?: string
  width?: number | string
  height?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  originalsrc: '',
  width: undefined,
  height: undefined,
})

const isReady = ref(false)

// 预览时使用的图片地址（优先使用原图）
const previewSrc = computed(() => {
  return props.originalsrc || props.src
})
</script>

<template>
  <figure>
    <div
      class="relative block min-h-16 min-w-16"
      :style="props.width && props.height ? { aspectRatio: `${props.width}/${props.height}` } : {}"
    >
      <img
        :data-source="previewSrc"
        :src="props.src"
        :alt="props.alt"
        :width="props.width"
        :height="props.height"
        draggable="false"
        loading="lazy"
        :class="[
          'm-0 h-full w-full max-w-none cursor-pointer rounded-lg object-cover',
          isReady ? 'opacity-100' : 'opacity-0',
        ]"
        @load="isReady = true"
      />

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
          class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/20"
        >
          <UIcon name="i-lucide-loader-2" class="h-8 w-8 animate-spin" />
        </div>
      </Transition>
    </div>

    <figcaption v-if="props.alt" class="my-2 flex items-center justify-center text-sm italic">
      <UIcon name="i-lucide-image" class="mr-1 h-4 w-4" />
      <span class="align-text-top">{{ props.alt }}</span>
    </figcaption>
  </figure>
</template>
