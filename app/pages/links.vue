<script setup lang="ts">
const meta = {
  title: '友链',
  description: '我的小伙伴们 ✨',
}

useSeoMeta(meta)

// 从 content 读取友链数据
const { data: linksData } = await useAsyncData('links', () => queryCollection('links').first())

const links = computed(() => linksData.value?.links || [])
</script>

<template>
  <div class="min-h-screen">
    <Banner
      :title="meta.title"
      image="https://img.iice.fun/blog/2025/11/12/8684c11604f1fef29480ed31cedd5935.webp"
      date="2026-01-12"
    />

    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          欢迎来交换友链呀！💕
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="link in links"
          :key="link.url"
          class="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="flex items-start space-x-4">
            <UTooltip :text="link.name">
              <UAvatar
                :src="link.avatar"
                :alt="link.name"
                size="3xl"
                class="group-hover:ring-primary/20 shrink-0 ring-2 ring-transparent transition-all"
              />
            </UTooltip>

            <div class="min-w-0 flex-1">
              <div class="mb-2 flex items-center justify-between">
                <h3
                  class="group-hover:text-primary truncate text-lg font-semibold text-gray-900 transition-colors dark:text-white"
                >
                  {{ link.name }}
                </h3>
                <UTooltip text="访问网站">
                  <UButton
                    :to="link.url"
                    target="_blank"
                    icon="i-lucide-external-link"
                    color="primary"
                    variant="ghost"
                    size="xs"
                    square
                    class="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </UTooltip>
              </div>

              <p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                {{ link.description }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
