<script setup lang="ts">
import type { UserSubjectCollection } from '../../../shared/types/bangumi'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/tabs'
import { cn } from '~/lib/utils'
import { CollectionType, SubjectType } from '../../../shared/types/bangumi'

const pageStore = usePageStore()
const activeTab = ref(getWeekDayNumber(new Date()))

const meta = {
  title: '追番',
  description: '我的动漫追番记录',
}
onMounted(() => {
  pageStore.setPageMeta({
    banner: {
      postTitle: meta.title,
      bannerImage: 'http://127.0.0.1:9000/blog/2025/11/13/edf8e82c7c90de3ebbe2fb52b02eb18c.webp',
      postMeta: 'haoza · 2025-11-11',
    },
    description: meta.description,
  })
  loadWatchedData()
})

useSeoMeta(meta)

const USERID = 877981

/** 获取收藏数据并格式化返回 */
async function getCollectionRawData(
  username: number,
  options?: { subjectType?: SubjectType, type?: CollectionType, offset?: number, limit?: number },
) {
  const { subjectType = SubjectType.Anime, type = CollectionType.Watching, offset = 0, limit = 30 } = options || {}
  const apiUrl = `https://api.bgm.tv/v0/users/${username}/collections?subject_type=${subjectType}&type=${type}&limit=${limit}&offset=${offset}`
  const { data, total } = await $fetch<{ data: UserSubjectCollection[], total: number }>(apiUrl)
  return { data: data || [], total: total || 0 }
}

/** 递归查询获取所有收藏数据 */
async function getAllCollectionData(
  username: number,
  options?: { subjectType?: SubjectType, type?: CollectionType, offset?: number, limit?: number },
) {
  const { data } = await getCollectionRawData(username, options)

  if (data.length === options?.limit) {
    const nextData: UserSubjectCollection[] = await getAllCollectionData(username, {
      ...options,
      offset: options?.offset ?? 0 + (options?.limit ?? 30),
    })
    return data.concat(nextData)
  }

  return data
}

/** 追番 日历 */
const defaultCalendarData = [
  { weekday: { en: 'Mon', cn: '星期一', ja: '月耀日', id: 1 }, items: [] },
  { weekday: { en: 'Tue', cn: '星期二', ja: '火耀日', id: 2 }, items: [] },
  { weekday: { en: 'Wed', cn: '星期三', ja: '水耀日', id: 3 }, items: [] },
  { weekday: { en: 'Thu', cn: '星期四', ja: '木耀日', id: 4 }, items: [] },
  { weekday: { en: 'Fri', cn: '星期五', ja: '金耀日', id: 5 }, items: [] },
  { weekday: { en: 'Sat', cn: '星期六', ja: '土耀日', id: 6 }, items: [] },
  { weekday: { en: 'Sun', cn: '星期日', ja: '日耀日', id: 7 }, items: [] },
]
const { data: animeCalendarData } = useAsyncData('animeCalendarData', async () => {
  const collectionData = await getAllCollectionData(USERID)

  const calendarData: { weekday: { en: string, cn: string, ja: string, id: number }, items: UserSubjectCollection[] }[] = defaultCalendarData

  calendarData.forEach((calendarItem) => {
    calendarItem.items = collectionData.filter(collection => getWeekDayNumber(collection.subject.date) === calendarItem.weekday.id)
  })

  return calendarData
}, { default: () => defaultCalendarData, server: false })

/** 已看动画 */
const watched = reactive({
  loading: false,
  page: 0,
  pageSize: 8,
  data: [] as UserSubjectCollection[],
  total: Infinity,
})

async function loadWatchedData() {
  watched.loading = true
  try {
    const { data, total } = await getCollectionRawData(USERID, {
      subjectType: SubjectType.Anime,
      type: CollectionType.Watched,
      offset: watched.page * watched.pageSize,
      limit: watched.pageSize,
    })
    watched.data = [...watched.data, ...data]
    watched.total = total
    watched.page++
  }
  finally {
    watched.loading = false
  }
}

/** 获取星期几(数字) */
function getWeekDayNumber(date: Date | string) {
  const weekday = new Date(date).getDay()
  const weekdayNumber = weekday === 0 ? 7 : weekday
  return Number.isNaN(weekdayNumber) ? undefined : weekdayNumber
}
</script>

<template>
  <div class="mx-auto max-w-4xl p-4">
    <h2 class="text-xl font-bold mt-12 mb-2">
      追番
    </h2>
    <Tabs
      v-model="activeTab"
      :class="cn('w-full p-2 bg-card/80 backdrop-blur-sm shadow-sm rounded-lg')"
    >
      <TabsList
        :class="cn(
          'mb-2 flex items-center justify-start gap-2',
          'border-b border-border bg-transparent',
          'px-2 pb-2 h-auto w-full rounded-none',
        )"
      >
        <TabsTrigger
          v-for="(item) in animeCalendarData"
          :key="item.weekday.en"
          :value="item.weekday.id"
          :class="cn(
            'flex-none rounded-lg border-none px-4 py-2 font-medium',
            'text-foreground bg-background',
            'hover:bg-accent hover:text-accent-foreground',
            'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
            'data-[state=active]:shadow-md',
            'transition-all duration-200 ease-in-out',
            'hover:scale-105',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          )"
        >
          {{ item.weekday.cn }}
        </TabsTrigger>
      </TabsList>
      <div class="px-2 py-3">
        <TabsContent
          v-for="(item) in animeCalendarData"
          :key="item.weekday.en"
          :value="item.weekday.id"
        >
          <div v-if="item.items.length > 0" class="grid grid-cols-6 w-full gap-4">
            <a
              v-for="collection in item.items"
              :key="collection.subject.id"
              :href="`https://bgm.tv/subject/${collection.subject.id}`"
              :title="collection.subject.name_cn"
              target="_blank"
              :class="cn(
                'group relative cursor-pointer overflow-hidden',
                'aspect-[0.7] rounded-lg border border-border/50 shadow-sm transition-transform',
                'hover:scale-[1.02] hover:shadow-lg',
              )"
            >
              <img
                :src="collection.subject.images.small"
                class="pointer-events-none w-full h-full object-cover"
                :alt="collection.subject.name_cn"
              >
              <div
                :class="cn(
                  'absolute bottom-0 left-0 right-0 truncate',
                  'bg-linear-to-t from-black/80 via-black/50 to-transparent',
                  'p-2 pt-8 text-sm text-white text-center',
                )"
              >
                {{ collection.subject.name_cn }}
              </div>
            </a>
          </div>
          <div v-else class="py-12 text-center text-muted-foreground">
            <p class="text-base">
              暂无追番更新
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>

    <h2 class="text-xl font-bold mt-12 mb-2">
      已看动画
    </h2>

    <div class="grid grid-cols-4 gap-4">
      <a
        v-for="collection in watched.data"
        :key="collection.subject.id"
        :href="`https://bgm.tv/subject/${collection.subject.id}`"
        :title="collection.subject.name_cn"
        target="_blank"
        :class="cn(
          'group relative cursor-pointer overflow-hidden',
          'border border-border/50 shadow-sm',
        )"
      >
        <div class="aspect-[0.7] pointer-events-none overflow-hidden">
          <img
            :src="collection.subject.images.medium"
            class="w-full h-full transition-transform group-hover:scale-110"
            :alt="collection.subject.name_cn"
          >
        </div>
        <div :class="cn('truncate p-2 text-center')">
          {{ collection.subject.name_cn }}
        </div>
      </a>
    </div>

    <!-- 加载更多 -->
    <Button
      v-if="watched.data.length > 0 && watched.data.length < watched.total"
      :class="cn(
        'flex items-center',
        'mt-4 mx-auto text-foreground rounded-none cursor-pointer border-2',
        'bg-transparent hover:bg-transparent hover:border-primary',
      )"
      @click="loadWatchedData"
    >
      加载更多
      <Spinner v-if="watched.loading" />
    </Button>
    <div v-else-if="!watched.loading" class="py-12 text-center text-muted-foreground">
      没有更多了~
    </div>

    <!-- Bangumi 链接 -->
    <div class="flex mt-8">
      <p>
        详细的记录，可以访问
        <a
          href="https://bgm.tv/user/877981"
          target="_blank"
          class="text-primary hover:underline"
        >
          Bangumi
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
