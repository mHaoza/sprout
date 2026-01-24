<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error.statusCode === 404)

const errorMessage = computed(() => {
  if (is404.value) {
    return {
      title: '页面走丢了',
      description: '你访问的页面似乎不存在，或许它去了另一个次元...',
      emoji: '🌸',
    }
  }
  return {
    title: '出错了',
    description: props.error.message || '服务器遇到了一些问题',
    emoji: '💔',
  }
})

const handleGoHome = () => {
  clearError({ redirect: '/' })
}

const handleGoBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    handleGoHome()
  }
}
</script>

<template>
  <UApp>
    <NuxtLayout>
      <div class="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-20">
        <div
          class="animate-in fade-in slide-in-from-top-6 text-center duration-600 ease-out will-change-[transform,opacity]"
        >
          <div class="mb-6 text-8xl font-bold opacity-20 md:text-9xl">
            {{ error.statusCode }}
          </div>

          <div class="mb-6 text-6xl">
            {{ errorMessage.emoji }}
          </div>

          <h1 class="font-mingchao mb-4 text-4xl font-bold md:text-5xl">
            {{ errorMessage.title }}
          </h1>

          <p class="mb-8 text-lg text-gray-600 md:text-xl dark:text-gray-400">
            {{ errorMessage.description }}
          </p>

          <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <UButton
              size="xl"
              color="primary"
              variant="solid"
              icon="i-heroicons-home"
              @click="handleGoHome"
            >
              返回首页
            </UButton>

            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              icon="i-heroicons-arrow-left"
              @click="handleGoBack"
            >
              返回上一页
            </UButton>
          </div>
        </div>
      </div>

      <ThemeController />
    </NuxtLayout>
  </UApp>
</template>
