<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error.statusCode === 404)

const message = computed(() =>
  is404.value
    ? {
        title: '页面走丢了',
        description: '你访问的页面似乎不存在，或许它去了另一个次元...',
      }
    : {
        title: '出错了',
        description: props.error.message || '服务器遇到了一些问题',
      },
)

function goHome() {
  clearError({ redirect: '/' })
}

// 让错误页也走全局标题模板，最终展示为 `<错误标题> @ mHaoza`
useHead(() => ({ title: message.value.title }))
</script>

<template>
  <UApp>
    <NuxtLayout>
      <main class="page flex flex-col items-center justify-center space-y-4 text-center">
        <div class="text-8xl font-bold italic opacity-20 md:text-9xl">
          {{ props.error.statusCode }}
        </div>

        <h1 class="text-2xl font-extrabold italic">{{ message.title }}</h1>

        <p class="text-subtle">{{ message.description }}</p>

        <UButton class="mt-4" variant="ghost" color="neutral" @click="goHome"> 返回首页 </UButton>
      </main>
    </NuxtLayout>
  </UApp>
</template>
