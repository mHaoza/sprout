<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <blockquote
    :class="['border-primary bg-primary-100 mt-6 rounded-r-lg border-l-4 pl-6 italic', props.class]"
  >
    <slot />
  </blockquote>
</template>
