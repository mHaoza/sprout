<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <hr
    :class="cn(
      'my-8 border-t',
      props.class,
    )"
  >
</template>
