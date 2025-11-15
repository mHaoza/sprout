<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  href?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <a
    :href="props.href"
    :class="cn(
      'font-medium text-primary underline underline-offset-4 hover:text-primary/80',
      props.class,
    )"
  >
    <slot />
  </a>
</template>
