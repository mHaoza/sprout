<script setup lang="ts">
/**
 * 日期展示，统一使用 en-US 短格式，如 `Mar 08, 2026`
 */
const props = withDefaults(
  defineProps<{
    dateString?: string
    dateFormat?: 'MMM DD, YYYY' | 'MMM DD'
    class?: string
  }>(),
  {
    dateString: '',
    dateFormat: 'MMM DD, YYYY',
  },
)

const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
  'MMM DD, YYYY': { month: 'short', day: '2-digit', year: 'numeric' },
  'MMM DD': { month: 'short', day: '2-digit' },
}

const formatted = computed(() => {
  if (!props.dateString) return null

  const date = new Date(props.dateString)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('en-US', formatOptions[props.dateFormat]).format(date)
})
</script>

<template>
  <time v-if="formatted" :datetime="props.dateString" :class="props.class">
    {{ formatted }}
  </time>
</template>
