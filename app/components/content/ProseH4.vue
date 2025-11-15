<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h4
    :id="props.id"
    :class="cn(
      'scroll-m-20 text-xl font-semibold tracking-tight mt-4 mb-2',
      props.class,
    )"
  >
    <slot />
  </h4>
</template>
