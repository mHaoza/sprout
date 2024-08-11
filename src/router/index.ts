import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
    },
    {
      path: '/post/:postName',
      name: 'post',
      component: () => import('@/views/post/index.vue'),
    },
    {
      path: '/anime',
      name: 'anime',
      component: () => import('@/views/anime/index.vue'),
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('@/views/demo/index.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/about/index.vue'),
    },
  ],
})

router.beforeEach(() => {
  window.scrollTo(0, 0)
})

export default router
