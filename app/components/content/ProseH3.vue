<script setup lang="ts">
interface Props {
  id?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h3
    :id="props.id"
    :class="[
      `before:text-muted/50 relative mt-6 mb-3 scroll-m-20 text-2xl font-semibold tracking-tight before:absolute before:right-full before:mr-3 before:hidden before:text-base before:font-normal before:content-['H3'] lg:before:block`,
      props.class,
    ]"
  >
    <slot />
  </h3>
</template>
