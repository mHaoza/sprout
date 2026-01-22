<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <thead :class="['bg-muted border-b', props.class]">
    <slot />
  </thead>
</template>
