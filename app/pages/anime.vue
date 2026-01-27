<script setup lang="ts">
const activeTab = ref(getWeekDayNumber(new Date()))

const meta = {
  title: '追番',
  description: '我的动漫追番记录',
}

onMounted(() => {
  loadWatchedData()
})

useSeoMeta(meta)

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
  <div>
    <Banner
      :title="meta.title"
      image="https://img.iice.fun/blog/2025/11/13/edf8e82c7c90de3ebbe2fb52b02eb18c.webp"
      date="2025-11-11"
    />

    <div class="mx-auto max-w-4xl p-4">
      <h2 class="mt-12 mb-2 text-xl font-bold">追番</h2>

      <UTabs
        v-model="activeTab"
        :items="
          animeCalendarData.map((item) => ({
            label: item.weekday.cn,
            value: item.weekday.id,
            slot: `tab-${item.weekday.id}`,
          }))
        "
        :ui="{
          list: 'bg-white/60 backdrop-blur-sm border border-gray-200',
          trigger: 'data-active:bg-primary-300/20',
        }"
        class="w-full rounded-lg p-2 shadow-sm backdrop-blur-sm"
      >
        <template
          v-for="item in animeCalendarData"
          :key="item.weekday.en"
          #[`tab-${item.weekday.id}`]
        >
          <div class="px-2 py-3">
            <UEmpty
              v-if="!['error', 'success'].includes(status)"
              variant="naked"
              icon="i-lucide-calendar-x"
              title="加载中..."
            />
            <div v-else-if="item.items.length > 0" class="grid w-full grid-cols-6 gap-4">
              <UPopover
                v-for="collection in item.items"
                :key="collection.subject.id"
                mode="hover"
                :popper="{ placement: 'right-start', offset: [8, 0] }"
                class="group"
              >
                <template #default>
                  <a
                    :href="`https://bgm.tv/subject/${collection.subject.id}`"
                    target="_blank"
                    class="relative block aspect-[0.7] cursor-pointer overflow-hidden rounded-lg shadow-sm transition-transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    <img
                      :src="collection.subject.images.small"
                      class="pointer-events-none h-full w-full object-cover"
                      :alt="collection.subject.name_cn"
                    />
                    <div
                      class="absolute right-0 bottom-0 left-0 truncate bg-linear-to-t from-gray-900/80 via-gray-900/50 to-transparent p-2 pt-8 text-center text-sm text-white"
                    >
                      {{ collection.subject.name_cn }}
                    </div>
                  </a>
                </template>
                <template #content>
                  <AnimePopover :collection="collection" />
                </template>
              </UPopover>
            </div>
            <UEmpty
              v-else
              variant="naked"
              icon="i-lucide-calendar-x"
              title="暂无追番更新"
              description="本日无追番"
            />
          </div>
        </template>
      </UTabs>

      <h2 class="mt-12 mb-2 text-xl font-bold">已看动画</h2>

      <div class="grid grid-cols-4 gap-4">
        <a
          v-for="collection in watched.data"
          :key="collection.subject.id"
          :href="`https://bgm.tv/subject/${collection.subject.id}`"
          :title="collection.subject.name_cn"
          target="_blank"
          class="group relative cursor-pointer overflow-hidden border border-gray-200 shadow-sm"
        >
          <div class="pointer-events-none aspect-[0.7] overflow-hidden">
            <img
              :src="collection.subject.images.medium"
              class="h-full w-full transition-transform group-hover:scale-110"
              :alt="collection.subject.name_cn"
            />
          </div>
          <div class="truncate p-2 text-center">
            {{ collection.subject.name_cn }}
          </div>
        </a>
      </div>

      <!-- 加载更多 -->
      <UButton
        v-if="watched.data.length > 0 && watched.data.length < watched.total"
        variant="outline"
        :loading="watched.loading"
        class="mx-auto mt-4 flex cursor-pointer items-center rounded-none border bg-transparent"
        @click="loadWatchedData"
      >
        加载更多
      </UButton>
      <div v-else-if="!watched.loading" class="py-12 text-center">没有更多了~</div>

      <!-- Bangumi 链接 -->
      <div class="mt-8 flex">
        <p>
          详细的记录，可以访问
          <a
            href="https://bgm.tv/user/877981"
            target="_blank"
            class="text-primary-300 hover:underline"
          >
            Bangumi
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
