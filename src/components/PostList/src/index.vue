<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { Bookmark, Calendar, Tag } from 'lucide-vue-next'
import { allPosts } from '@/utils/post'
import { parseMarkdown } from '@/utils/markdown'
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

const mask = reactive({
  height: 0,
  top: 0,
})
function calcMask(target?: HTMLElement) {
  if (!target) {
    return
  }
  const { clientHeight, offsetTop } = target

  const paddingTop = 0 ?? 4 * 16
  const realTop = offsetTop + paddingTop
  if (mask.height === clientHeight && mask.top === realTop) {
    return
  }
  mask.height = clientHeight
  mask.top = realTop
}

const itemRef = ref<HTMLLIElement[]>()

onMounted(() => {
  watch(
    () => route.path,
    () => nextTick(() => calcMask(itemRef.value?.[0])),
    { immediate: true },
  )
})
</script>

<template>
  <div
    class="mask pointer-events-none absolute left-0 top-0 w-full transform rounded transition-all duration-300 ease-in-out"
    :style="{
      height: `${mask.height}px`,
      transform: `translateY(${mask.top}px)`,
    }"
  />
  <ul>
    <li
      v-for="post in postList"
      :key="post.filePath"
      ref="itemRef"
      class="[&:nth-child(n+2)]:mt-2 cursor-pointer p-4"
      @click="$router.push(getPostPath(post))"
      @mouseenter="calcMask($event.target as HTMLElement)"
    >
      <div class="text-xl mb-2 italic">{{ post.data.title }}</div>
      <div class="max-w-full" v-html="parseMarkdown(post.data.description || '').html" />
      <div class="mt-2 flex justify-start">
        <Calendar class="w-5 mr-1" />
        <span>{{ dayjs(post.data.date).format('YYYY-MM-DD') }}</span>
        <Bookmark class="ml-4 mr-1 w-5" />
        <span>{{ post.data.category }}</span>
        <Tag class="ml-4 mr-1 w-5" />
        <span v-for="tag in post.data.tags" :key="tag" class="mr-2">{{ tag }}</span>
      </div>
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
.mask {
  @apply shadow-inner;
  will-change: height;
  background-color: rgba(0, 0, 0, 0.04);
}
.mask:before {
  content: '';
  position: absolute;
  top: 50%;
  left: -0.16rem;
  width: 0.32rem;
  height: 70%;
  border-radius: 0.1rem;
  background-color: var(--theme-color);
  transform: translateY(-50%);
}
</style>
