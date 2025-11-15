<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <ol
    :class="cn(
      'my-6 ml-6 list-decimal [&>li]:mt-2',
      props.class,
    )"
  >
    <slot />
  </ol>
</template>
