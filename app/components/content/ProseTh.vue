<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <th
    :class="[
      'bg-muted border px-4 py-2 text-left font-bold [&:has([align=center])]:text-center [&:has([align=right])]:text-right',
      props.class,
    ]"
  >
    <slot />
  </th>
</template>
