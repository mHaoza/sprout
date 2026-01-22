<script setup lang="ts">
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <td
    :class="[
      'border px-4 py-2 text-left [&:has([align=center])]:text-center [&:has([align=right])]:text-right',
      props.class,
    ]"
  >
    <slot />
  </td>
</template>
