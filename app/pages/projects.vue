<script setup lang="ts">
const meta = {
  title: '项目',
  description: '我的个人项目展示',
}

useSeoMeta(meta)

interface Project {
  title: string
  description: string
  repository: string
  homepage?: string
  tags: string[]
  stars?: number
  language?: string
  color?: string
}

// 从 content 读取项目数据
const { data: projectsData } = await useAsyncData('projects', () =>
  queryCollection('projects').first(),
)

const projects = computed(() => projectsData.value?.projects || [])

const languageColors: Record<string, string> = {
  Vue: '#42b883',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
}
</script>

<template>
  <div class="min-h-screen">
    <Banner
      :title="meta.title"
      image="https://img.iice.fun/blog/2025/11/13/22bba19e4ea5bb58162a93e439682efb.webp"
      date="2026-01-12"
    />

    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- 项目介绍 -->
      <div class="mb-12 text-center">
        <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">我的开源项目</h2>
        <p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          这里是我的一些个人项目，欢迎查看和交流 ✨
        </p>
      </div>

      <!-- 项目卡片网格 -->
      <UPageGrid>
        <UCard
          v-for="(project, index) in projects"
          :key="index"
          class="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <!-- 项目头部 -->
          <div class="mb-4 flex items-start justify-between">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ project.title }}
              </h3>
              <div
                v-if="project.language"
                class="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
              >
                <span
                  class="inline-block h-3 w-3 rounded-full"
                  :style="{ backgroundColor: languageColors[project.language] || '#gray' }"
                />
                {{ project.language }}
              </div>
            </div>
          </div>

          <!-- 项目描述 -->
          <p
            :title="project.description"
            class="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400"
          >
            {{ project.description }}
          </p>

          <!-- 项目标签 -->
          <div class="mb-4 flex flex-wrap gap-2">
            <UBadge
              v-for="(tag, tagIndex) in project.tags"
              :key="tagIndex"
              color="primary"
              variant="subtle"
              size="sm"
            >
              {{ tag }}
            </UBadge>
          </div>

          <!-- 项目链接 -->
          <div class="flex gap-3">
            <UButton
              :to="project.repository"
              target="_blank"
              icon="i-lucide-github"
              color="neutral"
              variant="outline"
              size="sm"
            >
              GitHub
            </UButton>
            <UButton
              v-if="project.homepage"
              :to="project.homepage"
              target="_blank"
              icon="i-lucide-external-link"
              color="primary"
              variant="soft"
              size="sm"
            >
              访问网站
            </UButton>
          </div>
        </UCard>
      </UPageGrid>

      <!-- 更多项目提示 -->
      <div class="mt-12 text-center">
        <p class="mb-4 text-gray-600 dark:text-gray-400">想查看更多项目？</p>
        <UButton
          to="https://github.com/mHaoza"
          target="_blank"
          icon="i-lucide-github"
          color="primary"
          size="lg"
        >
          访问我的 GitHub
        </UButton>
      </div>
    </div>
  </div>
</template>
