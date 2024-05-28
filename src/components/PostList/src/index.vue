<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { allPosts } from '@/utils/post'
import type { PostFileData } from '@/types'

const route = useRoute()

const postList = computed(() => {
  return allPosts.filter((post) => {
    return post.filePath.startsWith(`/posts${route.path}`)
  })
})

function getPostPath(post: PostFileData) {
  if (post.filePath.startsWith('/posts/life')) {
    return `life/${post.fileName.replace('.md', '')}`
  }

  if (post.filePath.startsWith('/posts/skill')) {
    return `skill/${post.fileName.replace('.md', '')}`
  }

  return '/404'
}
</script>

<template>
  <ul>
    <li
      v-for="post in postList"
      :key="post.filePath"
      class="[&:nth-child(n+2)]:mt-2 cursor-pointer"
      @click="$router.push(getPostPath(post))"
    >
      <div>{{ post.data.title }}</div>
      <div class="max-w-full">{{ post.data.description }}</div>
      <div>
        <span>{{ post.data.date }}</span>
        <span>{{ post.data.category }}</span>
        <span>{{ post.data.tags?.join(' ') }}</span>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
