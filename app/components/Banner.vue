<script setup lang="ts">
import dayjs from 'dayjs'

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
    :class="[
      'banner relative flex h-100 flex-col items-center justify-center text-center',
      !props.image && 'h-auto min-h-40',
    ]"
  >
    <div
      v-if="hasBannerImage"
      class="banner-bg absolute top-0 left-0 z-[-1] h-full w-full bg-gray-900/30 filter-[brightness(.6)]"
    >
      <img
        :src="props.image"
        loading="lazy"
        class="animate-in fade-in h-full w-full object-cover transition-opacity duration-500 ease-out"
      />
    </div>

    <div
      :class="[
        'animate-in fade-in slide-in-from-top-6 duration-600 ease-out will-change-[transform,opacity]',
        hasBannerImage ? 'text-white' : 'mt-10',
      ]"
    >
      <div class="post-title text-5xl">
        <slot name="title">
          <div>{{ props.title }}</div>
        </slot>
      </div>

      <div v-if="hasMetaInfo" class="post-meta mt-4">
        <div class="flex flex-wrap items-center justify-center">
          <a href="/" class="hover:underline">
            {{ props.author ?? appConfig.site.author }}
          </a>

          <template v-if="props.category">
            <UIcon name="i-lucide-dot" class="mx-1 opacity-50" />
            <div class="flex items-center">
              <UIcon name="i-lucide-folder" class="mr-1.5 size-4" />
              <span>{{ props.category }}</span>
            </div>
          </template>

          <template v-if="props.tags?.length">
            <UIcon name="i-lucide-dot" class="mx-1 opacity-50" />
            <div class="flex items-center gap-3">
              <div v-for="(tag, index) in props.tags" :key="index" class="flex items-center">
                <UIcon name="i-lucide-tag" class="mr-1 size-4" />
                <span>{{ tag }}</span>
              </div>
            </div>
          </template>

          <template v-if="props.date">
            <UIcon name="i-lucide-dot" class="mx-1 opacity-50" />
            <span>{{ dayjs(props.date).format('YYYY-MM-DD') }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
