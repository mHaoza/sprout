<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <li
    :class="cn(
      'leading-7',
      props.class,
    )"
  >
    <slot />
  </li>
</template>
