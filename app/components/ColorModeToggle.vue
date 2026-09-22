<script setup lang="ts">
/**
 * 黑白模式切换
 *
 * 图标沿用 zero 的约定：浅色显示太阳（缓慢自转，见 --animate-sun-spin），深色显示月亮。
 * 用户偏好要到挂载后才读得到（服务端没有 localStorage / 系统设置），
 * 所以图标等挂载后再渲染，避免 hydration 时两侧不一致。
 */
const colorMode = useColorModeStore()

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <button
    type="button"
    :aria-label="colorMode.isDark ? '切换到浅色模式' : '切换到深色模式'"
    class="icon-link"
    @click="colorMode.toggle()"
  >
    <UIcon
      v-if="mounted"
      :name="colorMode.isDark ? 'i-lucide-moon-star' : 'i-lucide-sun'"
      class="size-4.5"
      :class="colorMode.isDark ? '' : 'animate-sun-spin'"
    />
  </button>
</template>
