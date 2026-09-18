<script setup lang="ts">
/**
 * 返回上一层的粘性链接
 *
 * 父级路由的展示名与目标地址可以在这里集中配置
 */
const route = useRoute()

const PARENT_OVERRIDES: Record<string, { href: string; name: string }> = {
  post: { href: '/articles', name: 'Articles' },
  more: { href: '/more', name: 'More' },
}

const parent = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const parentSegments = segments.slice(0, -1)
  if (parentSegments.length === 0) {
    return { href: '/', name: 'Index' }
  }

  const key = parentSegments[parentSegments.length - 1]!
  const override = PARENT_OVERRIDES[key]
  if (override) return override

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
