<script setup lang="ts">
export interface HomeSectionItem {
  title: string
  date?: string
  to: string
}

const props = defineProps<{
  title: string
  to: string
  icon: string
  list: HomeSectionItem[]
  /** View All 是否新窗口打开（外链时使用） */
  newTab?: boolean
}>()

const isEmpty = computed(() => props.list.length === 0)
</script>

<template>
  <section v-if="!isEmpty" class="space-y-3">
    <div class="flex justify-between">
      <div class="flex items-center gap-1">
        <UIcon :name="props.icon" class="size-4.5" />
        <h2 class="font-bold">{{ props.title }}</h2>
      </div>
      <NuxtLink
        class="link text-sm"
        :to="props.to"
        :target="props.newTab ? '_blank' : undefined"
        :rel="props.newTab ? 'noreferrer' : undefined"
      >
        View All
      </NuxtLink>
    </div>

    <ul class="space-y-2 max-md:space-y-4">
      <li v-for="item in props.list" :key="item.to" class="flex items-start justify-between">
        <NuxtLink :to="item.to" class="link link-hover text-text truncate max-sm:whitespace-normal">
          {{ item.title }}
        </NuxtLink>
        <AppDateTime :date-string="item.date" class="text-subtle shrink-0 pt-0.5 text-sm" />
      </li>
    </ul>
  </section>
</template>
