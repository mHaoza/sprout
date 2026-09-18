<script setup lang="ts">
export interface LinkListGroup {
  year: number
  list: { title: string; date?: string; to: string }[]
}

const props = defineProps<{
  title: string
  groups: LinkListGroup[]
}>()
</script>

<template>
  <AppPage :title="props.title">
    <ul data-slide-auto class="w-full space-y-2 max-md:space-y-4" style="--enter-delay: 60ms">
      <template v-for="group in props.groups" :key="group.year">
        <li class="my-5 text-right text-2xl font-extrabold first:mt-0">
          {{ group.year || '未分类' }}
        </li>

        <li
          v-for="article in group.list"
          :key="article.to"
          class="flex items-start justify-start gap-6 max-sm:flex-row-reverse max-sm:justify-between max-sm:gap-0"
        >
          <AppDateTime
            :date-string="article.date"
            date-format="MMM DD"
            class="text-subtle inline-block w-16 shrink-0 pt-0.5 text-sm"
          />
          <NuxtLink
            :to="article.to"
            class="link link-hover text-text truncate max-sm:whitespace-normal"
          >
            {{ article.title }}
          </NuxtLink>
        </li>
      </template>
    </ul>
  </AppPage>
</template>
