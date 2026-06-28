import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/trade', name: 'trade', component: () => import('@/views/TradeView.vue') },
    { path: '/lost-found', name: 'lost-found', component: () => import('@/views/LostFoundView.vue') },
    { path: '/group-buy', name: 'group-buy', component: () => import('@/views/GroupBuyView.vue') },
    { path: '/errand', name: 'errand', component: () => import('@/views/ErrandView.vue') },
    { path: '/publish', name: 'publish', component: () => import('@/views/PublishView.vue') },
    { path: '/message', name: 'message', component: () => import('@/views/MessageView.vue') },
    { path: '/user', name: 'user', component: () => import('@/views/UserCenterView.vue') },
  ],
})

export default router
