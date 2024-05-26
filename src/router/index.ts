import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: `/:category(life|skill)?`,
      name: 'post-list',
      component: () => import('@/components/PostList'),
    },
    {
      path: `/:category(life|skill)/:postPath+`,
      name: 'post',
      component: () => import('@/components/Post'),
    },
    {
      path: '/anime',
      name: 'anime',
      component: () => import('@/views/anime/index.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/about/index.vue'),
    },
  ],
})

export default router
