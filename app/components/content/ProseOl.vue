<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <ol :class="['my-6 ml-6 list-decimal [&>li]:mt-2', props.class]">
    <slot />
  </ol>
</template>
