<script setup lang="ts">
interface Props {
  id?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h4
    :id="props.id"
    :class="[
      `before:text-muted/50 relative mt-4 mb-2 scroll-m-20 text-xl font-semibold tracking-tight before:absolute before:right-full before:mr-3 before:hidden before:text-sm before:font-normal before:content-['H4'] lg:before:block`,
      props.class,
    ]"
  >
    <slot />
  </h4>
</template>
