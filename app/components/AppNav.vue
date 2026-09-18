<script setup lang="ts">
/**
 * 返回上一层的粘性链接
 *
 * 父级地址直接由当前路径推导：父级路径 + 该段首字母大写作为展示名。
 * 例如 `/articles/001-xxx` → `{ href: '/articles', name: 'Articles' }`。
 */
const route = useRoute()

const parent = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const parentSegments = segments.slice(0, -1)
  if (parentSegments.length === 0) {
    return { href: '/', name: 'Index' }
  }

  const key = parentSegments[parentSegments.length - 1]!

  return {
    href: `/${parentSegments.join('/')}`,
    name: key.charAt(0).toUpperCase() + key.slice(1),
  }
})
</script>

<template>
  <NuxtLink
    v-if="parent"
    :to="parent.href"
    class="sticky top-25 m-0 flex h-0 w-auto -translate-x-36 items-center gap-1 italic max-lg:relative max-lg:top-0 max-lg:mb-8 max-lg:h-auto max-lg:translate-x-0"
  >
    <UIcon name="i-lucide-corner-up-left" class="size-4.5" />
    <span class="text-lg font-bold">{{ parent.name }}</span>
  </NuxtLink>
</template>
