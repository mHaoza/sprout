<script setup lang="ts">
import { ref, watch } from 'vue'
import { navList } from '~/assets/data/nav'

const open = ref(false)

// 转换为 UCommandPalette 所需的格式
const groups = computed(() => {
  const categoryList = new Set(navList.map((i) => i.category))

  return Array.from(categoryList).map((category) => {
    const categoryItems = navList.filter((i) => i.category === category)

    return {
      id: category,
      label: category,
      items: categoryItems.map((item) => ({
        id: item.link,
        label: item.name,
        suffix: item.desc,
        icon: 'i-lucide-link',
        // 保留原有搜索权重逻辑
        keywords: [item.name, item.desc, item.link, ...item.tags, item.category].join(' '),
        category: item.category,
        tags: item.tags,
        onSelect: () => window.open(item.link),
      })),
    }
  })
})

const { Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'k' && e.ctrlKey) {
      e.preventDefault()
      e.stopPropagation()
    }
  },
})

watch([Ctrl_K], (v) => {
  if (v[0] || v[1]) {
    handleOpenChange()
  }
})

function handleOpenChange() {
  open.value = !open.value
}

defineExpose({ open: () => (open.value = true) })
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-transparent',
      content: 'w-2xl max-w-none',
    }"
  >
    <template #content>
      <UCommandPalette
        :groups="groups"
        placeholder="搜索站点、描述、标签(Ctrl+K)"
        :close="true"
        class="max-h-96"
        :fuse="{
          fuseOptions: {
            keys: ['label', 'suffix', 'keywords', 'category', 'tags'],
            threshold: 0.3,
          },
        }"
      >
        <template #item="{ item }">
          <div class="flex w-full flex-col">
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ item.label }}</span>
              <span class="text-sm">{{ item.suffix }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-folder" class="h-3 w-3" />
                <span>{{ item.category }}</span>
              </div>
              <span>•</span>
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-tag" class="h-3 w-3" />
                <span>{{ item.tags?.join(' ') }}</span>
              </div>
            </div>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>
