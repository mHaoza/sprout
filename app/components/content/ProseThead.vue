<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <thead
    :class="cn(
      'border-b bg-muted',
      props.class,
    )"
  >
    <slot />
  </thead>
</template>
