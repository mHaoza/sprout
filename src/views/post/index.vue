<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '@vueuse/core'
import { allPosts } from '@/utils/post'
import MarkdownRender from '@/components/MarkdownRender'

const route = useRoute()

const postData = computed(() => {
  const { postName } = route.params as { postName: string }
  return allPosts.find(item => item.fileName.endsWith(`${postName}.md`))
})

const mdText = ref('')
const postPath = computed(() => {
  return `${postData.value?.filePath}/${postData.value?.fileName}`
})

const { onFetchResponse } = useFetch<string>(postPath)

onFetchResponse(async (resData) => {
  mdText.value = await resData.text()
})
</script>

<template>
  <div class="post">
    <MarkdownRender :md-text="mdText" :file-path="postData?.filePath ?? ''" />
  </div>
</template>

<style scoped></style>
