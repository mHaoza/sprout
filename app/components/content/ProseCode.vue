<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  code?: string
  language?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  language: '',
})
</script>

<template>
  <code
    :class="cn(
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground',
      props.class,
    )"
  >
    <slot />
  </code>
</template>
