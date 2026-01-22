<script setup lang="ts">
import PhotoView from '@/components/blog/PhotoView.vue'

interface Props {
  src?: string
  alt?: string
  originalsrc?: string
  width?: number | string
  height?: number | string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <ClientOnly>
    <PhotoView
      :src="props.src || ''"
      :alt="props.alt"
      :originalsrc="props.originalsrc"
      :width="props.width"
      :height="props.height"
    />
  </ClientOnly>
</template>
