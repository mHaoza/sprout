<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue'
import { createFetch } from '@vueuse/core'
import type { AnimeCollectionsResponse, UserSubjectCollection } from './types'

const animeList = ref<UserSubjectCollection[]>([])

const useRequest = createFetch({ baseUrl: 'https://api.bgm.tv' })

const params = reactive({
  subject_type: 2, // 2: anime
  collection_type: 3, // 1: 想看  2: 看过  3: 在看  4: 搁置  5: 抛弃
  limit: 20, // 每页条数
  offset: 0, // 偏移数
})
let total = Number.POSITIVE_INFINITY

const url = computed(() => {
  const name = '877981'
  const paramsStr = new URLSearchParams(Object.entries(params).map(item => [item[0], item[1].toString()]))
  return `v0/users/${name}/collections?${paramsStr}`
})
const { isFetching, execute, onFetchResponse } = useRequest(url)

onFetchResponse(async (res) => {
  const data = (await res.json()) as AnimeCollectionsResponse
  animeList.value.push(...data.data)
  total = data.total
})

window.addEventListener('scroll', handleScroll)
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  if (!isFetching.value && total > params.limit * (params.offset + 1) && scrollTop + clientHeight > scrollHeight - 100) {
    params.offset += 1
    execute()
  }
}
</script>

<template>
  <div class="anime">
    <ul class="grid grid-cols-5 gap-8 max-w-[900px] mx-auto">
      <li v-for="anime in animeList" :key="anime.subject_id" class="anime-item relative overflow-hidden shadow-xl rounded transition-transform cursor-pointer">
        <a :href="`https://bangumi.tv/subject/${anime.subject.id}`" target="_blank">
          <img :src="anime.subject.images.medium" alt="" class="anime-img w-full h-full transition-transform">
          <div class="anime-name absolute bottom-0 p-1 w-full bg-gray-800/50 text-white overflow-hidden max-h-8 transition-[max-height]">
            {{ anime.subject.name_cn }}
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.anime-item:hover {
  @apply shadow-transparent/30;
  transform: rotateX(10deg) rotateY(10deg);
  .anime-name {
    @apply max-h-20 whitespace-normal;
  }
}
</style>
