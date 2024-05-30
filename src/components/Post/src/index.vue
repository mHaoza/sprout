<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '@vueuse/core'
import { allPosts } from '@/utils/post'
import { parseMarkdown, replaceImageLinks } from '@/utils/markdown'

const route = useRoute()
const post = ref({ params: {} as any, html: '' })

const postData = computed(() => {
  const { postName, postDir } = route.params as { postName: string, postDir: string }
  return allPosts.find(
    item => item.fileName.endsWith(`${postName}.md`) && item.filePath.startsWith(`/posts/${postDir}`),
  )
})

const postPath = computed(() => {
  return `${postData.value?.filePath}/${postData.value?.fileName}`
})

const { onFetchResponse } = useFetch<string>(postPath)

onFetchResponse(async (resData) => {
  const mdText = await resData.text()

  post.value = parseMarkdown(replaceImageLinks(mdText, `${postData.value?.filePath}/`))
})
</script>

<template>
  <div class="post">
    <h1 class="text-3xl">{{ post.params.title }}</h1>
    <div class="rich-content" v-html="post.html" />
  </div>
</template>

<style scoped></style>
