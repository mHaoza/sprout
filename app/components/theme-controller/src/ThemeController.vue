<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { themeList } from './theme-list'
import { useThemeStore } from '~/stores/theme'

const panelVisible = ref(false)
const themeStore = useThemeStore()

themeStore.init()
</script>

<template>
  <UModal
    v-model="panelVisible"
    :ui="{
      overlay: 'bg-transparent',
      content: 'w-[90vw] max-w-6xl *:bg-bg-base',
    }"
  >
    <div
      :class="[
        'fixed bottom-[10vw] left-[calc(97vw-4rem)] z-50',
        'h-16 w-16',
        'cursor-pointer overflow-hidden rounded-full',
        'border-primary-200 border',
        'opacity-0 transition-all duration-300 ease-in-out',
        'hover:shadow-primary-50 hover:scale-110 hover:opacity-100 hover:shadow-lg',
      ]"
    >
      <img
        src="/imgs/比丢00.webp"
        class="hidden h-full w-full object-cover transition-transform duration-300 hover:scale-105 md:block"
      />
    </div>

    <template #content>
      <UCard :ui="{ body: 'p-0' }">
        <template #header>
          <h3 class="text-xl font-bold">主题选择</h3>
        </template>

        <div class="grid max-h-[80dvh] grid-cols-6 gap-4 overflow-y-auto pb-6">
          <div
            v-for="theme in themeList"
            :key="theme.name"
            class="group relative aspect-square cursor-pointer overflow-hidden rounded-md border border-gray-200 transition-colors select-none"
            :class="theme.name === themeStore.currentTheme?.name ? 'border-primary-500' : ''"
            @click="themeStore.selectTheme(theme)"
          >
            <img
              :src="theme.poetryPicture"
              :alt="theme.name"
              draggable="false"
              class="pointer-events-none absolute right-0 -bottom-1.25 origin-bottom-right scale-140"
            />

            <div
              class="bg-opacity-60 absolute top-2 left-2 rounded-full border px-2 py-1 text-xs shadow-sm backdrop-blur-sm"
            >
              {{ theme.name }}
            </div>

            <div class="absolute top-3 right-3 flex gap-1 rounded-md">
              <div
                class="size-3 rounded-full border border-gray-200"
                :class="`bg-${theme.colors.primary}-500`"
              />
              <div
                class="size-3 rounded-full border border-gray-200"
                :class="`bg-${theme.colors.secondary}-500`"
              />
            </div>

            <div
              class="from-bg-base absolute bottom-0 bg-linear-to-t from-50% to-transparent p-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              :class="`text-${theme.colors.primary}-500`"
            >
              <h3 class="mb-1 text-sm font-bold">
                {{ theme.name }}
              </h3>
              <p class="mb-2 text-xs opacity-90">
                {{ theme.description }}
              </p>
              <p class="hidden text-xs leading-relaxed opacity-75 sm:block">
                {{ theme.poetry }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
