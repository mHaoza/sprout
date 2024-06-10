<script setup lang="ts">
import { useImage } from '@vueuse/core'

import StarRailLoading from '@/components/StarRailLoading'

const props = defineProps<{ src: string, alt?: string }>()

const { isLoading } = useImage({ src: props.src })
</script>

<template>
  <div class="markdown-image relative">
    <StarRailLoading v-if="isLoading" />
    <img v-else class="mx-auto" :src="props.src" :alt="props.alt">
    <span v-if="props.alt" className="mb-8 block text-center italic">◭ {{ props.alt }}</span>
  </div>
</template>

<style lang="postcss" scoped></style>
