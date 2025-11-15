<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <tr
    :class="cn(
      'border-b transition-colors hover:bg-muted/50',
      props.class,
    )"
  >
    <slot />
  </tr>
</template>
