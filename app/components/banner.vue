<script setup lang="ts">
import dayjs from 'dayjs'
import { Dot, FolderIcon, TagIcon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

interface BannerProps {
  image?: string
  title?: string
  author?: string
  date?: string
  category?: string
  tags?: string[]
}

const props = defineProps<BannerProps>()

const appConfig = useAppConfig()
const hasBannerImage = computed(() => !!props.image)
const hasMetaInfo = computed(() => props.author || props.date)
</script>

<template>
  <div
    :class="cn(
      'banner relative h-100 flex flex-col items-center justify-center text-center',
      !props.image && 'h-auto min-h-40',
    )"
  >
    <div v-if="hasBannerImage" class="banner-bg bg-black/30 absolute z-[-1] left-0 top-0 w-full h-full filter-[brightness(.6)]">
      <img
        :src="props.image"
        loading="lazy"
        :class="cn('w-full h-full object-cover transition-opacity animate-in fade-in duration-500 ease-out')"
      >
    </div>

    <div
      :class="cn(
        'animate-in fade-in slide-in-from-top-6 duration-600 ease-out text-white',
        !hasBannerImage && 'text-foreground mt-10',
      )"
    >
      <div :class="cn('post-title text-5xl')">
        <slot name="title">
          <div>{{ props.title }}</div>
        </slot>
      </div>

      <div v-if="hasMetaInfo" class="post-meta mt-4">
        <div class="flex items-center justify-center">
          <a href="/" class="hover:underline">
            {{ props.author ?? appConfig.site.author }}
          </a>

          <template v-if="props.category">
            <Dot />
            <FolderIcon :size="14" class="mr-1" />
            {{ props.category }}
          </template>

          <template v-if="props.tags">
            <Dot />
            <template v-for="(tag, index) in props.tags" :key="index">
              <TagIcon :size="14" class="mr-1" />
              <span>{{ tag }}</span>
            </template>
          </template>

          <template v-if="props.date">
            <Dot />
            <span>{{ dayjs(props.date).format('YYYY-MM-DD') }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
