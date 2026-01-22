<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <tr :class="['hover:bg-muted/50 border-b transition-colors', props.class]">
    <slot />
  </tr>
</template>
