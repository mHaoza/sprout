<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <li :class="['leading-7', props.class]">
    <slot />
  </li>
</template>
