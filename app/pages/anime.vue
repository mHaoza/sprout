<script setup lang="ts">
const activeTab = ref(1)

/** 今天对应的星期，仅在客户端计算，避免静态生成时被固化 */
const todayWeekday = ref<number>()

const meta = {
  title: '追番',
  description: '我的动漫追番记录',
}

useSeoMeta(meta)

onMounted(() => {
  todayWeekday.value = getWeekDayNumber(new Date())
  activeTab.value = todayWeekday.value ?? 1
  loadWatchedData()
})

const USERID = 877981

/** 获取收藏数据并格式化返回 */
async function getCollectionRawData(
  username: number,
  options?: { subjectType?: SubjectType; type?: CollectionType; offset?: number; limit?: number },
) {
  const {
    subjectType = SubjectType.Anime,
    type = CollectionType.Watching,
    offset = 0,
    limit = 30,
  } = options || {}
  const apiUrl = `https://api.bgm.tv/v0/users/${username}/collections?subject_type=${subjectType}&type=${type}&limit=${limit}&offset=${offset}`
  const { data, total } = await $fetch<{ data: UserSubjectCollection[]; total: number }>(apiUrl)
  return { data: data || [], total: total || 0 }
}

/** 递归查询获取所有收藏数据 */
async function getAllCollectionData(
  username: number,
  options?: { subjectType?: SubjectType; type?: CollectionType; offset?: number; limit?: number },
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
const { data: animeCalendarData, status } = useAsyncData(
  'animeCalendarData',
  async () => {
    const collectionData = await getAllCollectionData(USERID)

    const calendarData: {
      weekday: { en: string; cn: string; ja: string; id: number }
      items: UserSubjectCollection[]
    }[] = JSON.parse(JSON.stringify(defaultCalendarData))

    calendarData.forEach((calendarItem) => {
      calendarItem.items = collectionData.filter(
        (collection) => getWeekDayNumber(collection.subject.date) === calendarItem.weekday.id,
      )
    })

    return calendarData
  },
  { default: () => defaultCalendarData, server: false },
)

/** 当前选中星期的数据 */
const activeDay = computed(
  () =>
    animeCalendarData.value.find((item) => item.weekday.id === activeTab.value) ??
    animeCalendarData.value[0]!,
)

/** 日历数据是否仍在加载（静态生成阶段 status 保持 idle） */
const calendarLoading = computed(() => status.value === 'idle' || status.value === 'pending')

/** 已看动画 */
const watched = reactive({
  loading: false,
  page: 0,
  pageSize: 8,
  data: [] as UserSubjectCollection[],
  total: Infinity,
})

/** 已看动画总数（首次加载完成前为 Infinity，不展示） */
const watchedTotal = computed(() => (Number.isFinite(watched.total) ? watched.total : null))

/** 是否还有更多可加载 */
const hasMore = computed(() => watched.data.length > 0 && watched.data.length < watched.total)

/** 集数标签：优先展示观看进度，其次展示总集数 */
function episodeLabel(collection: UserSubjectCollection) {
  if (collection.ep_status > 0) {
    return `已看 ${collection.ep_status} 集`
  }

  return collection.subject.eps > 0 ? `全 ${collection.subject.eps} 集` : ''
}

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
  } finally {
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
  <AppPage title="追番">
    <!-- 本周更新 -->
    <section data-slide-auto class="space-y-5">
      <div class="flex items-end justify-between gap-2">
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-calendar-days" class="size-4.5" />
          <h2 class="font-bold">本周更新</h2>
        </div>
        <p v-if="!calendarLoading" class="text-subtle text-sm">
          {{ activeDay.weekday.cn }} · {{ activeDay.items.length }} 部
        </p>
      </div>

      <!-- 星期选择 -->
      <div class="border-overlay bg-surface/60 flex gap-1 rounded-md border p-1">
        <button
          v-for="day in animeCalendarData"
          :key="day.weekday.id"
          type="button"
          :title="day.weekday.cn"
          :aria-pressed="activeTab === day.weekday.id"
          class="relative flex-1 cursor-pointer rounded px-1 py-1.5 text-xs transition-colors duration-300 sm:text-sm"
          :class="
            activeTab === day.weekday.id
              ? 'bg-overlay text-text font-bold'
              : 'text-subtle hover:text-text'
          "
          @click="activeTab = day.weekday.id"
        >
          <span class="sm:hidden">{{ day.weekday.ja.charAt(0) }}</span>
          <span class="hidden sm:inline">{{ day.weekday.cn }}</span>

          <!-- 今天 -->
          <span
            v-if="day.weekday.id === todayWeekday"
            aria-hidden="true"
            class="bg-love absolute top-1 right-1 size-1.5 rounded-full"
          />
        </button>
      </div>

      <!-- 加载骨架 -->
      <div v-if="calendarLoading" class="grid grid-cols-3 gap-4 sm:grid-cols-4">
        <div v-for="i in 4" :key="i" class="animate-pulse space-y-2">
          <div class="bg-overlay aspect-[0.7] w-full rounded-md"></div>
          <div class="bg-overlay h-3.5 w-3/4 rounded"></div>
        </div>
      </div>

      <!-- 当日番剧 -->
      <div v-else-if="activeDay.items.length > 0" class="grid grid-cols-3 gap-4 sm:grid-cols-4">
        <UPopover
          v-for="collection in activeDay.items"
          :key="collection.subject.id"
          mode="hover"
          :content="{ side: 'top', sideOffset: 8 }"
        >
          <AnimeCard :collection="collection" :meta="episodeLabel(collection)" />

          <template #content>
            <AnimePopover :collection="collection" />
          </template>
        </UPopover>
      </div>

      <p
        v-else
        class="border-overlay text-muted rounded-md border border-dashed py-12 text-center text-sm"
      >
        这一天没有追番更新
      </p>
    </section>

    <!-- 已看动画 -->
    <section data-slide-auto class="space-y-5">
      <div class="flex items-end justify-between gap-2">
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-history" class="size-4.5" />
          <h2 class="font-bold">已看动画</h2>
        </div>
        <p v-if="watchedTotal" class="text-subtle text-sm">共 {{ watchedTotal }} 部</p>
      </div>

      <div
        v-if="watched.loading && watched.data.length === 0"
        class="grid grid-cols-3 gap-4 sm:grid-cols-4"
      >
        <div v-for="i in 8" :key="i" class="animate-pulse space-y-2">
          <div class="bg-overlay aspect-[0.7] w-full rounded-md"></div>
          <div class="bg-overlay h-3.5 w-3/4 rounded"></div>
        </div>
      </div>

      <div v-else-if="watched.data.length > 0" class="grid grid-cols-3 gap-4 sm:grid-cols-4">
        <UPopover
          v-for="collection in watched.data"
          :key="collection.subject.id"
          mode="hover"
          :content="{ side: 'top', sideOffset: 8 }"
        >
          <AnimeCard :collection="collection" :meta="episodeLabel(collection)" />

          <template #content>
            <AnimePopover :collection="collection" />
          </template>
        </UPopover>
      </div>

      <p
        v-else
        class="border-overlay text-muted rounded-md border border-dashed py-12 text-center text-sm"
      >
        还没有观看记录
      </p>

      <!-- 加载更多 -->
      <div v-if="watched.data.length > 0" class="flex justify-center">
        <button
          v-if="hasMore"
          type="button"
          :disabled="watched.loading"
          class="border-overlay text-subtle hover:border-muted hover:text-text flex cursor-pointer items-center gap-1 rounded-md border px-4 py-1.5 text-sm transition-colors duration-300 disabled:cursor-default disabled:opacity-60"
          @click="loadWatchedData"
        >
          <UIcon v-if="watched.loading" name="i-lucide-loader-circle" class="size-4 animate-spin" />
          {{ watched.loading ? '加载中' : '加载更多' }}
        </button>
        <p v-else class="text-muted text-sm">— 没有更多了 —</p>
      </div>
    </section>

    <!-- Bangumi -->
    <p data-slide class="text-subtle">
      详细的记录，可以访问
      <a href="https://bgm.tv/user/877981" target="_blank" rel="noopener noreferrer" class="link">
        Bangumi
      </a>
    </p>
  </AppPage>
</template>

<style scoped></style>
