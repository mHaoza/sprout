<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '@vueuse/core'
import { allPosts } from '@/utils/post'
import { parseMarkdown } from '@/utils/markdown'

const route = useRoute()
const post = ref({ params: {} as any, html: '' })

const postPath = computed(() => {
  const { postName, postDir } = route.params as { postName: string, postDir: string }
  const post = allPosts.find(item => item.fileName.endsWith((`${postName}.md`)) && item.filePath.startsWith(`/posts/${postDir}`))

  return `${post?.filePath}`
})

const { onFetchResponse } = useFetch<string>(postPath)

onFetchResponse(async (resData) => {
  const mdText = await resData.text()
  post.value = parseMarkdown(mdText)
})
</script>

<template>
  <div class="post">
    <h1 class=" text-3xl">{{ post.params.title }}</h1>
    <div class="rich-content" v-html="post.html" />
  </div>
</template>

<style scoped></style>
