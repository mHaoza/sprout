<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, watch } from 'vue'

interface BangumiDetail {
  id: number
  name: string
  name_cn: string
  eps: number
  summary: string
  tags: { name: string }[]
  score: number
  rating: { total: number; score: number }
  total_episodes: number
  collection: { doing: number; on_hold: number; dropped: number; wish: number; collect: number }
  images: { large: string; medium: string; small: string }
  date?: string // 首播日期
}

const props = defineProps<{
  collection: UserSubjectCollection
}>()

const loading = ref(false)
const detail = ref<BangumiDetail | null>(null)
const airedCount = ref<number | null>(null)

watch(
  () => props.collection.subject.id,
  async (id) => {
    if (!id) return
    loading.value = true
    detail.value = null
    airedCount.value = null
    try {
      // Bangumi v0 API
      detail.value = await $fetch(`https://api.bgm.tv/v0/subjects/${id}`)
      // 获取每一集的数据
      $fetch<{ data: any[] }>(`https://api.bgm.tv/v0/episodes`, {
        method: 'GET',
        params: { subject_id: id },
      }).then((episodes) => {
        const today = dayjs().valueOf()
        airedCount.value = Array.isArray(episodes.data)
          ? episodes.data.filter(
              (ep) => ep.type === 0 && ep.airdate && dayjs(ep.airdate).valueOf() <= today,
            ).length
          : null
      })
    } catch (e) {
      detail.value = null
      airedCount.value = null
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="min-h-64 w-xs p-4">
    <div v-if="loading" class="py-24 text-center text-gray-400">加载中...</div>
    <div v-else-if="detail">
      <div class="mb-2 flex gap-3">
        <div class="flex-1">
          <div class="mb-1 text-base font-bold">{{ detail.name_cn || detail.name }}</div>
          <div class="mb-1 text-xs text-gray-500">
            共 {{ detail.total_episodes || detail.eps }} 集
            <span v-if="airedCount !== null" class="text-primary-500 ml-2">
              已放送 {{ airedCount }} 集
            </span>
            <span v-if="props.collection.ep_status > 0" class="text-primary-500 ml-2">
              已看 {{ props.collection.ep_status }} 集
            </span>
          </div>
          <div v-if="detail.date" class="mb-1 flex items-center gap-1 text-xs text-gray-500">
            <UIcon name="i-lucide-calendar" class="h-3 w-3" />
            首播：{{ dayjs(detail.date).format('YYYY-MM-DD') }}
          </div>
          <div class="mb-1 text-xs text-gray-500">
            评分：{{ detail.rating?.score || detail.score || '暂无' }}
          </div>
        </div>
      </div>
      <div :title="detail.summary" class="mb-2 line-clamp-3 text-xs text-gray-700">
        {{ detail.summary }}
      </div>
      <div class="mb-2 flex flex-wrap gap-1">
        <span
          v-for="tag in detail.tags.slice(0, 6)"
          :key="tag.name"
          class="rounded bg-gray-100 px-2 py-0.5 text-xs"
        >
          {{ tag.name }}</span
        >
      </div>
      <div class="mt-3 flex gap-2">
        <UButton
          variant="link"
          size="sm"
          :to="`https://ani.gamer.com.tw/search.php?keyword=` + encodeURIComponent(detail.name)"
          target="_blank"
          class="flex items-center gap-1"
        >
          動畫瘋
          <UIcon name="i-lucide-external-link" />
        </UButton>
        <UButton
          variant="link"
          size="sm"
          :to="`https://dm.xifanacg.com/search.html?wd=` + encodeURIComponent(detail.name_cn)"
          target="_blank"
          class="flex items-center gap-1"
        >
          稀饭动漫
          <UIcon name="i-lucide-external-link" />
        </UButton>
        <UButton
          variant="link"
          size="sm"
          :to="
            `https://www.agedm.io/search?query=` + encodeURIComponent(detail.name || detail.name_cn)
          "
          target="_blank"
          class="flex items-center gap-1"
        >
          AGE动漫
          <UIcon name="i-lucide-external-link" />
        </UButton>
      </div>
    </div>
    <div v-else class="py-8 text-center text-gray-400">暂无数据</div>
  </div>
</template>
