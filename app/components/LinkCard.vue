<script setup lang="ts">
/**
 * 友链卡片：头像 + 名称 + 描述
 *
 * 头像来自对方站点，可能因防盗链或对方改版而加载失败，
 * 因此未填写或加载失败时回退为名称首字，避免出现破图。
 */
const props = defineProps<{
  name: string
  url: string
  description?: string
  avatar?: string
}>()

const avatarFailed = ref(false)
const avatarEl = ref<HTMLImageElement | null>(null)

const initial = computed(() => props.name.trim().charAt(0) || '?')

onMounted(() => {
  // SSG 直出的 <img> 会在 hydration 完成前就开始加载，
  // 若在那之前就失败，error 事件已经错过，这里补一次校验：
  // complete 为 true 但 naturalWidth 为 0，即加载失败。
  if (avatarEl.value?.complete && avatarEl.value.naturalWidth === 0) {
    avatarFailed.value = true
  }
})
</script>

<template>
  <a
    :href="props.url"
    :aria-label="props.name"
    target="_blank"
    rel="noopener noreferrer"
    class="group border-overlay bg-surface hover:border-muted focus-visible:border-muted flex h-full items-start gap-3.5 rounded-md border p-4 transition-colors duration-300 focus-visible:outline-none"
  >
    <span class="border-overlay relative size-11 shrink-0 overflow-hidden rounded-full border">
      <img
        v-if="props.avatar && !avatarFailed"
        ref="avatarEl"
        :src="props.avatar"
        :alt="`${props.name} 的头像`"
        loading="lazy"
        decoding="async"
        draggable="false"
        class="m-0! size-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none"
        @error="avatarFailed = true"
      />
      <span
        v-else
        class="bg-overlay text-subtle flex size-full items-center justify-center font-bold"
      >
        {{ initial }}
      </span>
    </span>

    <span class="min-w-0 flex-1">
      <span class="text-text block truncate font-bold group-hover:underline">{{ props.name }}</span>
      <span v-if="props.description" class="text-subtle mt-0.5 line-clamp-2 block text-sm">
        {{ props.description }}
      </span>
    </span>
  </a>
</template>
