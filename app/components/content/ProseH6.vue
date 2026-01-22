<script setup lang="ts">
interface Props {
  id?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h6
    :id="props.id"
    :class="[
      `before:text-muted/50 relative mt-4 mb-2 scroll-m-20 font-semibold tracking-tight before:absolute before:right-full before:mr-3 before:hidden before:text-xs before:font-normal before:content-['H6'] lg:before:block`,
      props.class,
    ]"
  >
    <slot />
  </h6>
</template>
