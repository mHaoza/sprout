<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="not-prose my-6 w-full overflow-auto rounded-lg border">
    <table :class="['w-full border-collapse border', props.class]">
      <slot />
    </table>
  </div>
</template>
