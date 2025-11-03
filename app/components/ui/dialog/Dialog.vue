<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'
import { DialogRoot, useForwardPropsEmits, VisuallyHidden } from 'reka-ui'
import DialogContent from './DialogContent.vue'
import DialogTitle from './DialogTitle.vue'

const props = defineProps<DialogRootProps & {
  title?: string
  hideOverlay?: boolean
  hideCloseButton?: boolean
}>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogRoot
    data-slot="dialog"
    v-bind="forwarded"
  >
    <DialogContent :hide-close-button="props.hideCloseButton" :hide-overlay="props.hideOverlay">
      <!-- title -->
      <VisuallyHidden v-if="!props.title && !$slots.title">
        <DialogTitle />
      </VisuallyHidden>
      <slot v-else name="title">
        <DialogTitle> {{ props.title }}</DialogTitle>
      </slot>

      <slot />
    </DialogContent>
  </DialogRoot>
</template>
