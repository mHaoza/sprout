<script setup lang="ts">
const props = defineProps<{
  post: {
    title: string
    date?: string
    body?: unknown
  }
}>()

const toc = computed(() => {
  const links = (props.post.body as { toc?: { links?: never[] } } | undefined)?.toc?.links
  return flattenToc(links as never)
})

const readingTime = computed(() => estimateReadingTime(props.post.body))
</script>

<template>
  <AppPage>
    <article class="space-y-12">
      <header>
        <h1 class="text-3xl font-extrabold">{{ props.post.title }}</h1>
        <div class="text-subtle mt-1 flex items-center text-sm">
          <AppDateTime :date-string="props.post.date" />
          <UIcon name="i-lucide-dot" class="size-6 shrink-0" />
          <span>{{ readingTime }}</span>
        </div>
      </header>

      <div class="flex flex-row-reverse">
        <AppToc v-if="toc.length > 0" :toc="toc" />

        <slot />
      </div>
    </article>
  </AppPage>
</template>
