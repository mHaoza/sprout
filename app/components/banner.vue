<script setup lang="ts">
import { cn } from '~/lib/utils'

const appConfig = useAppConfig()
const route = useRoute()

const postMeta = computed(() => route.meta?.postMeta as any)
const imageUrl = computed(() => route.meta?.bannerImage as string | undefined)

const infoList = computed(() => {
  if (route.name === 'Home') {
    return
  }
  return [postMeta.value?.author, postMeta.value?.date].filter(Boolean)
})
</script>

<template>
  <div v-if="postMeta || route.name === 'Home'" :key="route.path" :class="cn('banner relative h-100 flex flex-col items-center justify-center text-center')">
    <div v-if="imageUrl" class="banner-bg bg-black absolute z-[-1] left-0 top-0 w-full h-full filter-[brightness(.6)]">
      <img
        :src="imageUrl"
        loading="lazy"
        :class="cn('w-full h-full object-cover transition-opacity animate-in fade-in duration-500 ease-out')"
      >
    </div>

    <div class="animate-in fade-in slide-in-from-top-6 duration-600 ease-out">
      <div :class="cn('banner-title text-white text-5xl')">
        <template v-if="route.name === 'Home'">
          <div class="font-mingchao">
            {{ appConfig.site.name }}
          </div>
          <div class=" mt-8 text-sm">
            {{ appConfig.site.description }}
          </div>
        </template>
        <template v-else>
          <div>
            {{ postMeta?.title }}
          </div>
        </template>
      </div>

      <div v-if="infoList?.length" class="post-meta mt-3 text-white">
        {{ infoList.join(' · ') }}
      </div>
    </div>
  </div>
</template>
