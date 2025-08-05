<script setup lang="ts">
import { navList } from '~/assets/data/nav'

definePageMeta({
  layout: 'blank',
})
</script>

<template>
  <div class="grid grid-cols-[repeat(3,minmax(0,350px))] mx-5vw justify-center gap-4 pb15 pt-15">
    <a
      v-for="nav in navList"
      :key="nav.name"
      :href="nav.link"
      :title="`${nav.name} - ${nav.desc}`"
      target="_blank"
      class="transition-transform duration-300 ease-in-out hover:translate-y-[-5px]"
    >
      <div class="bg-gray-300/30">
        <img v-if="nav.icon" :src="nav.icon" alt="">
        <div class="flex items-center justify-between">
          <div class="ellipsis-text font-bold">{{ nav.name }}</div>
          <span type="success" size="small" :bordered="false" class="rounded">{{ nav.category.join('/') }}</span>
        </div>
        <div class="mt-2 ellipsis-text text-xs">{{ nav.desc }}</div>
        <div class="space-x-2">
          <span v-for="tag in nav.tags" :key="tag" type="info" size="small" :bordered="false" class="mt-2 rounded">
            {{ tag }}
          </span>
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped></style>
