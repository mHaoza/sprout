<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <td
    :class="cn(
      'border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right',
      props.class,
    )"
  >
    <slot />
  </td>
</template>
