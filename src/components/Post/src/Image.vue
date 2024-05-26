<!-- CustomImage.vue -->
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: false,
  },
})
console.log(props)
</script>

<template>
  <div class="custom-image-wrapper">
    111111111111111111111111111111111111111
  </div>
</template>

<style>
.custom-image-wrapper {
  text-align: center;
  margin: 20px 0;
}
.custom-image {
  max-width: 100%;
  height: auto;
}
.caption {
  font-size: 0.9em;
  color: #555;
}
</style>
