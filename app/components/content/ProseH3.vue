<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h3
    :id="props.id"
    :class="cn(
      'scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-3',
      props.class,
    )"
  >
    <slot />
  </h3>
</template>
