<script setup lang="ts">
interface Props {
  code?: string
  language?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  language: '',
})
</script>

<template>
  <code class="relative rounded bg-neutral-300/50 px-[0.3rem] py-[0.2rem] font-mono text-sm">
    <slot />
  </code>
</template>
