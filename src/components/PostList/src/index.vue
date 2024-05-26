<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// const route = useRoute()

// 读取src/public目录下所有md文件列表
const postData = import.meta.glob('/public/posts/**/*.md')
console.log('postData', postData)

const postList = computed(() => {
  // const category = typeof route.params.category === 'string' ? route.params.category : route.params.category[0]

  return [] // postData.posts.filter(post => !category || post.filePath.includes(`/${category}/`))
})
</script>

<template>
  <ul>
    <li
      v-for="post in postList"
      :key="post.filePath"
      class="[&:nth-child(n+2)]:mt-2 cursor-pointer"
      @click="$router.push(post.filePath.replace('content', ''))"
    >
      <div>{{ post.data.title }}</div>
      <div class="max-w-full">{{ post.data.description }}</div>
      <div>
        <span>{{ post.data.date }}</span>
        <span>{{ post.data.category }}</span>
        <span>{{ post.data.tags.join(' ') }}</span>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
