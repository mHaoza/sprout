<script setup lang="ts">
import { isVNode } from 'vue'
import { cn } from '~/lib/utils'

const route = useRoute()
const pageStore = usePageStore()

const banner = computed(() => pageStore.banner)
const hasBannerImage = computed(() => !!banner.value?.bannerImage)
</script>

<template>
  <div
    :key="route.path"
    :class="cn('banner relative h-100 flex flex-col items-center justify-center text-center')"
  >
    <div v-if="hasBannerImage" class="banner-bg bg-black/30 absolute z-[-1] left-0 top-0 w-full h-full filter-[brightness(.6)]">
      <img
        :src="banner?.bannerImage"
        loading="lazy"
        :class="cn('w-full h-full object-cover transition-opacity animate-in fade-in duration-500 ease-out')"
      >
    </div>

    <div :class="cn('animate-in fade-in slide-in-from-top-6 duration-600 ease-out text-white', !hasBannerImage && 'text-foreground')">
      <div :class="cn('post-title text-5xl')">
        <component :is="banner?.postTitle" v-if="isVNode(banner?.postTitle)" />
        <div v-else>
          {{ banner?.postTitle }}
        </div>
      </div>

      <div v-if="banner?.postMeta" class="post-meta mt-3">
        <component :is="banner?.postMeta" v-if="isVNode(banner.postMeta)" />
        <template v-else>
          {{ banner.postMeta }}
        </template>
      </div>
    </div>
  </div>
</template>
