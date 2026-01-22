<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <p :class="['leading-7 not-first:mt-6', props.class]">
    <slot />
  </p>
</template>
