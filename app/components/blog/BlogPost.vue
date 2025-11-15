<script setup lang="ts">
interface Props {
  post?: any
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <article :class="props.class">
    <!-- 文章内容 -->
    <div class="prose prose-lg max-w-none">
      <ContentRenderer :value="post" />
    </div>
  </article>
</template>
