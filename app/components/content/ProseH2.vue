<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h2
    :id="props.id"
    :class="cn(
      'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-8 mb-4',
      props.class,
    )"
  >
    <slot />
  </h2>
</template>
