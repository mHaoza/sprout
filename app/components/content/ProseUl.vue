<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <ul :class="['my-6 ml-6 list-disc [&>li]:mt-2', props.class]">
    <slot />
  </ul>
</template>
