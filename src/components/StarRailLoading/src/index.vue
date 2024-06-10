<script setup lang="ts">
import loadingImg from '@/assets/images/loading.png'
</script>

<template>
  <div class="star-rail-loading">
    <div class="background">
      <img :src="loadingImg" alt="Loading...">
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.star-rail-loading {
  --loading-width: 30rem;
  --loading-height: 2.5rem;
  @apply overflow-hidden mx-auto py-2;
  width: var(--loading-width);
  height: calc(var(--loading-height) + 1rem);
}

.background {
  @apply inset-0 overflow-hidden;
  will-change: width;
  animation: loading 4s cubic-bezier(0.28, 0.11, 0.32, 1) infinite forwards;
}

.background img {
  @apply m-0 shadow-none;
  min-width: var(--loading-width);
  min-height: calc(var(--loading-height));
}

@keyframes loading {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
