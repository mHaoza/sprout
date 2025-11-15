<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="my-6 w-full overflow-y-auto">
    <table
      :class="cn(
        'w-full border-collapse border',
        props.class,
      )"
    >
      <slot />
    </table>
  </div>
</template>
