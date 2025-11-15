<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h5
    :id="props.id"
    :class="cn(
      'scroll-m-20 text-lg font-semibold tracking-tight mt-4 mb-2',
      props.class,
    )"
  >
    <slot />
  </h5>
</template>
