<script setup lang="ts">
import dayjs from 'dayjs'

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

/** 外部观看渠道 */
const channels = computed(() => {
  if (!detail.value) {
    return []
  }

  const { name, name_cn } = detail.value

  return [
    { label: '動畫瘋', query: name, href: 'https://ani.gamer.com.tw/search.php?keyword=' },
    { label: 'AGE动漫', query: name, href: 'https://www.agedm.io/search?query=' },
    { label: 'AGE 中文', query: name_cn || name, href: 'https://www.agedm.io/search?query=' },
  ]
    .filter((channel) => channel.query)
    .map((channel) => ({
      label: channel.label,
      href: channel.href + encodeURIComponent(channel.query),
    }))
})

/** 集数信息：总集数 · 已放送 · 已看 */
const episodeInfo = computed(() => {
  if (!detail.value) {
    return ''
  }

  const parts: string[] = []
  const total = detail.value.total_episodes || detail.value.eps

  if (total) {
    parts.push(`全 ${total} 集`)
  }
  if (airedCount.value !== null) {
    parts.push(`已放送 ${airedCount.value} 集`)
  }
  if (props.collection.ep_status > 0) {
    parts.push(`已看 ${props.collection.ep_status} 集`)
  }

  return parts.join(' · ')
})

const score = computed(() => detail.value?.rating?.score || detail.value?.score || 0)

watch(
  () => props.collection.subject.id,
  async (id) => {
    if (!id) {
      return
    }

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
      })
        .then((episodes) => {
          const today = dayjs().valueOf()
          airedCount.value = Array.isArray(episodes.data)
            ? episodes.data.filter(
                (ep) => ep.type === 0 && ep.airdate && dayjs(ep.airdate).valueOf() <= today,
              ).length
            : null
        })
        .catch(() => {
          // 剧集接口偶发失败时只是少一行「已放送」，不影响主体信息
          airedCount.value = null
        })
    } catch {
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
  <div class="w-72 p-4">
    <!-- 加载骨架 -->
    <div v-if="loading" class="animate-pulse space-y-3">
      <div class="flex gap-3">
        <div class="bg-overlay h-24 w-16 shrink-0 rounded-md"></div>
        <div class="flex-1 space-y-2 py-1">
          <div class="bg-overlay h-4 w-full rounded"></div>
          <div class="bg-overlay h-4 w-2/3 rounded"></div>
          <div class="bg-overlay h-3 w-1/2 rounded"></div>
        </div>
      </div>
      <div class="space-y-2">
        <div class="bg-overlay h-3 w-full rounded"></div>
        <div class="bg-overlay h-3 w-5/6 rounded"></div>
      </div>
    </div>

    <template v-else-if="detail">
      <div class="flex gap-3">
        <img
          :src="detail.images.medium || detail.images.small"
          :alt="detail.name_cn || detail.name"
          draggable="false"
          class="border-overlay h-24 w-16 shrink-0 rounded-md border object-cover"
        />

        <div class="min-w-0 flex-1">
          <h3 class="text-text text-sm leading-snug font-bold">
            {{ detail.name_cn || detail.name }}
          </h3>
          <p v-if="detail.name_cn" class="text-muted mt-0.5 truncate text-xs">{{ detail.name }}</p>

          <div class="text-subtle mt-1.5 space-y-0.5 text-xs">
            <p v-if="episodeInfo">{{ episodeInfo }}</p>
            <p v-if="detail.date" class="flex items-center gap-1">
              <UIcon name="i-lucide-calendar" class="size-3 shrink-0" />
              {{ dayjs(detail.date).format('YYYY-MM-DD') }}
            </p>
            <p class="flex items-center gap-1">
              <UIcon name="i-lucide-star" class="text-gold size-3 shrink-0" />
              {{ score || '暂无评分' }}
            </p>
          </div>
        </div>
      </div>

      <p v-if="detail.summary" class="text-subtle mt-3 line-clamp-4 text-xs leading-relaxed">
        {{ detail.summary }}
      </p>

      <div v-if="detail.tags?.length" class="mt-3 flex flex-wrap gap-1">
        <span
          v-for="tag in detail.tags.slice(0, 6)"
          :key="tag.name"
          class="bg-overlay text-subtle rounded-full px-2 py-0.5 text-xs"
        >
          {{ tag.name }}
        </span>
      </div>

      <div class="border-overlay mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t pt-2">
        <a
          v-for="channel in channels"
          :key="channel.label"
          :href="channel.href"
          target="_blank"
          rel="noopener noreferrer"
          class="text-subtle hover:text-text flex items-center gap-1 text-xs transition-colors"
        >
          {{ channel.label }}
          <UIcon name="i-lucide-external-link" class="size-3" />
        </a>
      </div>
    </template>

    <p v-else class="text-muted py-6 text-center text-xs">暂无数据</p>
  </div>
</template>
