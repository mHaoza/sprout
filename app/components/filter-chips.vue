<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  items: string[]
  modelValue: string[]
  mode?: 'single' | 'multiple'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'multiple',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const selectedSet = computed(() => new Set(props.modelValue ?? []))

function toggle(item: string) {
  const isSelected = selectedSet.value.has(item)
  if (props.mode === 'single') {
    emit('update:modelValue', isSelected ? [] : [item])
    return
  }
  const next = new Set(selectedSet.value)
  if (isSelected) {
    next.delete(item)
  }
  else {
    next.add(item)
  }
  emit('update:modelValue', Array.from(next))
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="item in items"
      :key="item"
      type="button"
      :class="[
        'group relative overflow-hidden px-3 py-1.5 rounded-xl cursor-pointer select-none text-sm font-medium border transition-all duration-300 backdrop-blur-sm hover:scale-105',
        selectedSet.has(item)
          ? 'bg-linear-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30'
          : 'bg-white/30 text-gray-700 hover:(bg-white/50 border-white/70 text-gray-800)',
      ].join(' ')"
      @click="toggle(item)"
    >
      <span class="relative z-10">{{ item }}</span>
      <!-- 背景光效（仅选中状态） -->
      <div
        v-if="selectedSet.has(item)"
        class="absolute from-indigo-400/20 to-purple-400/20 bg-linear-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </button>
  </div>
</template>

<style scoped></style>
