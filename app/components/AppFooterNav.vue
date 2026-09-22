<script setup lang="ts">
/**
 * 页脚社交/功能导航
 * 只渲染 appConfig.links 中实际配置过的链接
 */
const appConfig = useAppConfig()

const internalLinks = [
  { to: '/links', icon: 'i-lucide-scroll-text', label: '友链' },
  { to: '/anime', icon: 'i-lucide-tv', label: '追番' },
  { to: '/about', icon: 'i-lucide-user', label: '关于' },
]

const externalLinks = computed(() => {
  const links = (appConfig.links ?? {}) as Record<string, string | undefined>

  return [
    links.github && { href: links.github, icon: 'i-lucide-github', label: 'GitHub' },
    links.x && { href: links.x, icon: 'i-lucide-twitter', label: 'X' },
    links.cv && { href: links.cv, icon: 'i-lucide-file-text', label: 'CV' },
    links.email && { href: `mailto:${links.email}`, icon: 'i-lucide-mail', label: 'Email' },
    links.rss && { href: links.rss, icon: 'i-lucide-rss', label: 'RSS' },
  ].filter(Boolean) as { href: string; icon: string; label: string }[]
})
</script>

<template>
  <div class="flex items-center gap-3">
    <SolarTermToggle />
    <ColorModeToggle />

    <NuxtLink
      v-for="item in internalLinks"
      :key="item.to"
      :to="item.to"
      :aria-label="item.label"
      class="icon-link"
    >
      <UIcon :name="item.icon" class="size-4.5" />
    </NuxtLink>

    <a
      v-for="item in externalLinks"
      :key="item.href"
      :href="item.href"
      :aria-label="item.label"
      target="_blank"
      rel="noopener noreferrer"
      class="icon-link"
    >
      <UIcon :name="item.icon" class="size-4.5" />
    </a>
  </div>
</template>
