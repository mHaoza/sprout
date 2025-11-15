<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <p
    :class="cn(
      'leading-7 not-first:mt-6',
      props.class,
    )"
  >
    <slot />
  </p>
</template>
