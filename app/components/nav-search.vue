<script setup lang="ts">
import type { NavItem } from '~/assets/data/nav'

import { useMagicKeys } from '@vueuse/core'
import { Folder, Tag } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { navList } from '~/assets/data/nav'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'

const open = ref(false)

const groupList = computed(() => {
  const categoryList = new Set(navList.map(i => i.category))

  return Array.from(categoryList).map((category) => {
    return {
      category,
      items: navList.filter(i => i.category === category),
    }
  })
})

const { Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'k' && (e.ctrlKey)) {
      e.preventDefault()
      e.stopPropagation()
    }
  },
})

watch([Ctrl_K], (v) => {
  if (v[0] || v[1])
    handleOpenChange()
})

function handleOpenChange() {
  open.value = !open.value
}

function navItemValue(item: NavItem) {
  return [
    item.name,
    item.desc,
    item.link,
    item.tags.join(','),
    item.category,
  ].join('|')
}

function go(item: NavItem) {
  window.open(item.link)
}

defineExpose({ open: () => open.value = true })
</script>

<template>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="搜索站点、描述、标签(Ctrl+K 打开/关闭;Ctrl+数字快速打开)" />
    <CommandList>
      <CommandEmpty class="text-gray-500">
        未匹配到任何结果
      </CommandEmpty>

      <CommandGroup v-for="group in groupList" :key="group.category" :heading="group.category">
        <CommandItem v-for="item in group.items" :key="item.link" :value="navItemValue(item)" @click="go(item)">
          <div>
            <div>
              <span>{{ item.name }}</span>
              -
              <span class="text-sm text-muted-foreground">{{ item.desc }}</span>
            </div>
            <div class="flex items-center text-xs text-muted-foreground">
              <Folder class="mr-1 h-3 w-3" />
              <span>{{ item.category }}</span>
              <span class="mx-1">•</span>
              <Tag class="mr-1 h-3 w-3" />
              {{ item.tags.join(' ') }}
            </div>
          </div>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
