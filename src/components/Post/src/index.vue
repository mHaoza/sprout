<script setup lang="ts">
import { useFetch } from '@vueuse/core'
import { useRoute } from 'vue-router'
import markdownIt from 'markdown-it'
import frontMatter from 'front-matter'
import { ref } from 'vue'

const route = useRoute()
const prefix = 'https://raw.githubusercontent.com/mHaoza/sprout/main/packages/posts/content/'

const url = `${prefix}${route.params.category}/${(route.params.postPath as string[]).join('/')}`

const { onFetchResponse } = useFetch<string>(url)

const md = markdownIt()

const mdData = ref({ params: {} as any, html: '' })

onFetchResponse(async (resData) => {
  const mdText = await resData.text()

  if (!mdText) {
    mdData.value = { params: {}, html: '' }
  }

  const frontMatterResult = frontMatter<any>(mdText)

  const html = md.render(frontMatterResult.body)
  mdData.value = {
    params: frontMatterResult.attributes,
    html,
  }
})
</script>

<template>
  <div class="post">
    <h1 class=" text-3xl">{{ mdData.params.title }}</h1>
    <div class="rich-content" v-html="mdData.html" />
  </div>
</template>

<style scoped></style>
