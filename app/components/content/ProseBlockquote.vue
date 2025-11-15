<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <blockquote
    :class="cn(
      'mt-6 border-l-4 border-primary pl-6 italic',
      props.class,
    )"
  >
    <slot />
  </blockquote>
</template>
