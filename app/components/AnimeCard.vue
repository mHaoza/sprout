<script setup lang="ts">
/**
 * 番剧封面卡片，用于「本周更新」与「已看动画」两个网格
 */
const props = defineProps<{
  collection: UserSubjectCollection
  /** 标题下方的补充信息（集数等） */
  meta?: string
}>()

const title = computed(() => props.collection.subject.name_cn || props.collection.subject.name)

const poster = computed(
  () => props.collection.subject.images.medium || props.collection.subject.images.common,
)

const href = computed(() => `https://bgm.tv/subject/${props.collection.subject.id}`)
</script>

<template>
  <a
    :href="href"
    :title="title"
    target="_blank"
    rel="noopener noreferrer"
    class="group block focus-visible:outline-none"
  >
    <div
      class="border-overlay bg-surface group-hover:border-muted group-focus-visible:border-muted overflow-hidden rounded-md border transition-colors duration-300"
    >
      <img
        :src="poster"
        :alt="title"
        loading="lazy"
        draggable="false"
        class="aspect-[0.7] w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>

    <p class="text-text mt-2 truncate text-sm transition-colors group-hover:underline">
      {{ title }}
    </p>
    <p v-if="meta" class="text-subtle mt-0.5 truncate text-xs">{{ meta }}</p>
  </a>
</template>
