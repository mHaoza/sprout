<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <hr :class="['my-8 border-t', props.class]" />
</template>
