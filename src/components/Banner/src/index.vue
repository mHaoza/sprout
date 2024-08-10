<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

setTimeout(() => {
  console.log('name', route.name)
}, 1000)
const router = useRouter()
router.afterEach((to, from) => {
  console.log('from', from.name, 'to', to.name)
})
</script>

<template>
  <div class="banner relative flex flex-col justify-center items-center w-screen mt-24 h-[42vh] text-white">
    <img src="@/assets/images/banner/banner_0.jpg" draggable="false" class="absolute z-[-1] h-full w-full object-cover">
    <div class="name text-5xl">mHaoza</div>
    <div class="sub text-sm mt-4">是一个无聊的...</div>
  </div>
</template>

<style scoped></style>
