<script setup lang="ts">
interface Props {
  href?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <a
    :href="props.href"
    :class="['text-primary-500 font-medium underline-offset-4 hover:underline', props.class]"
  >
    <slot />
  </a>
</template>
