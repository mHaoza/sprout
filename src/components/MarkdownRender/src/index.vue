<script setup lang="ts">
import { createVNode, nextTick, ref, render, watch } from 'vue'
import MarkdownImage from './MarkdownImage.vue'
import { parseMarkdown, replaceImageLinks } from './markdown'
import type { PostInfo } from '@/types'

const props = defineProps<{ mdText: string, filePath?: string }>()

const mdData = ref<ReturnType<typeof parseMarkdown<PostInfo>>>({ html: '', params: {} })

watch(() => props.mdText, () => {
  mdData.value = parseMarkdown(replaceImageLinks(props.mdText, props.filePath ? `${props.filePath}/` : ''))

  nextTick(() => {
    const eleList = document.querySelectorAll('.custom-image')
    eleList.forEach((ele) => {
      const imgUrl = ele.getAttribute('data-src')
      const imgAlt = ele.getAttribute('data-alt')

      const vnode = createVNode(MarkdownImage, { src: imgUrl, alt: imgAlt })
      render(vnode, ele)
    })
  })
}, { immediate: true })
</script>

<template>
  <div class="markdown-render">
    <h1 class="text-3xl">{{ mdData.params.title }}</h1>
    <div class="md-content" v-html="mdData.html" />
  </div>
</template>

<style scoped></style>
