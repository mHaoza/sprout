<script setup lang="ts">
import { computed } from 'vue'
import type { Footprint } from '../_data/footprints'

const props = defineProps<{
  footprint: Footprint
  position: { x: number; y: number; visible: boolean }
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const rootStyle = computed(() => {
  return {
    transform: `translate(${props.position?.x ?? 0}px, ${props.position?.y ?? 0}px)`,
    display: props.position?.visible ? 'block' : 'none',
  }
})
</script>

<template>
  <div
    class="pointer-events-auto absolute top-0 left-0 z-20 will-change-transform"
    :style="rootStyle"
  >
    <div
      class="billboard-content group flex w-72 flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-slate-200 shadow-2xl backdrop-blur-xl transition-colors hover:border-sky-500/50"
    >
      <div
        class="absolute inset-0 bg-linear-to-br from-sky-500/10 to-rose-500/10 opacity-0 transition-opacity group-hover:opacity-100"
      />

      <div class="relative z-10 flex items-start justify-between text-white">
        <div>
          <h3
            class="bg-linear-to-r from-sky-400 to-emerald-400 bg-clip-text text-lg leading-tight font-bold text-transparent"
          >
            {{ footprint.title }}
          </h3>
          <p class="mt-1 flex items-center gap-1 font-mono text-xs text-slate-400">
            <UIcon name="i-lucide-calendar" class="h-3 w-3" />
            {{ footprint.date }}
          </p>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          size="xs"
          class="p-1! text-white hover:bg-white/10"
          @click.stop="emit('close')"
        />
      </div>

      <div
        v-if="footprint.image"
        class="relative mt-1 h-32 w-full shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 transition-all group-hover:ring-sky-500/30"
      >
        <img
          :src="footprint.image"
          :alt="footprint.title"
          class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent"
        />
      </div>

      <p
        class="relative z-10 mt-1 line-clamp-3 font-serif text-sm leading-relaxed tracking-tight text-slate-300"
      >
        {{ footprint.description }}
      </p>

      <!-- Cyberpunk decorative elements -->
      <div
        class="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-transparent via-sky-500 to-transparent opacity-50"
      />
      <div
        class="absolute top-2 right-2 h-1 w-1 animate-ping rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)]"
      />
    </div>
  </div>
</template>

<style scoped>
/* Only billboard content applies the centering offset and the transition states */
.billboard-content {
  transform: translate(-50%, calc(-100% - 20px)) scale(1);
  transform-origin: bottom center;
}
</style>
