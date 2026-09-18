<script setup lang="ts">
interface Props {
  href?: string
  target?: string
  class?: string
}

const props = defineProps<Props>()

/** 外链自动补 rel */
const rel = computed(() => (props.href?.startsWith('http') ? 'noopener noreferrer' : undefined))
</script>

<template>
  <a :href="props.href" :target="props.target" :rel="rel" :class="['link', props.class]">
    <slot />
  </a>
</template>
