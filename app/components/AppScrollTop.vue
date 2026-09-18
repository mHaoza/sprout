<script setup lang="ts">
/**
 * 回到顶部按钮，滚动超过 1/5 屏高后淡入
 */
const show = ref(false)

function onScroll() {
  show.value = window.scrollY > window.innerHeight / 5
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <button
    type="button"
    aria-label="Scroll to top"
    class="bg-surface cursor-pointer rounded-md p-2 transition-opacity duration-300"
    :class="show ? 'opacity-100' : 'pointer-events-none opacity-0'"
    @click="backToTop"
  >
    <UIcon name="i-lucide-chevrons-up" class="size-4.5" />
  </button>
</template>
