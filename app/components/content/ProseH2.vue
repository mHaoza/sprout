<script setup lang="ts">
interface Props {
  id?: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h2
    :id="props.id"
    :class="[
      `border-b-muted before:text-muted/50 relative mt-8 mb-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight before:absolute before:right-full before:mr-4 before:hidden before:text-lg before:font-normal before:content-['H2'] first:mt-0 lg:before:block`,
      props.class,
    ]"
  >
    <slot />
  </h2>
</template>
