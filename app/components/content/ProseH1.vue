<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h1
    :id="props.id"
    :class="cn(
      'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-8 mb-4',
      props.class,
    )"
  >
    <slot />
  </h1>
</template>
