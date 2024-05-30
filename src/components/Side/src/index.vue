<script setup lang="ts">
import { Code, Home, PersonStanding, Tent, Tv } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Clara from '@/assets/images/role/Clara.png'

const route = useRoute()

const linkList = [
  { name: '首页', path: '/', icon: Home },
  { name: '生活', path: '/life', icon: Tent },
  { name: '技术', path: '/skill', icon: Code },
  { name: '追番', path: '/anime', icon: Tv },
  { name: '自述', path: '/about', icon: PersonStanding },
]

const themeList = [{ type: 'Clara', name: '猩红兔子', color: '#8C0212', backgroundColor: '#FCFAF2', image: Clara }]
onMounted(() => {
  const theme = themeList[0]
  document.documentElement.style.setProperty('--theme-color', theme.color)
  document.documentElement.style.setProperty('--theme-translucent-color', theme.backgroundColor)
  document.documentElement.style.setProperty('--background-image', `url('${theme.image}')`)
  document.getElementsByTagName('body')[0].className = theme.type
})
</script>

<template>
  <div class="side sticky top-0 h-screen min-w-96">
    <div class="flex justify-end w-full h-3/5">
      <nav class="flex flex-col justify-end items-center w-12">
        <router-link
          v-for="item in linkList"
          :key="item.name"
          :to="item.path"
          :data-name="item.name"
          class="flex items-center text-nowrap p-2"
          :class="{ active: item.path !== '/' && route.path.startsWith(item.path) || item.path === route.path }"
        >
          <component :is="item.icon" />
        </router-link>
      </nav>
      <div class="flex-1 flex flex-col justify-end w-2/3 pl-3 pb-3">
        <div class="text-6xl tracking-wider font-['TsangerZhoukeZhengdabangshu']">啊这</div>
        <div class="pt-2 pb-8 pl-1 text-xl tracking-wider">关于我转生成为切图仔这件事</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./index.css');
</style>
