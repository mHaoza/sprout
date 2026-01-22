<script setup lang="ts">
interface Props {
  id?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h1
    :id="props.id"
    :class="[
      `before:text-muted/50 relative mt-8 mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight before:absolute before:right-full before:mr-4 before:hidden before:text-xl before:font-normal before:content-['H1'] lg:text-5xl lg:before:block`,
      props.class,
    ]"
  >
    <slot />
  </h1>
</template>
