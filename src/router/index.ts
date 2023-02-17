import { createRouter, createWebHistory } from 'vue-router'
import stores from '@/stores'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        { path: '/home', component: () => import('@/views/home/index.vue') },
        {
          path: '/article',
          component: () => import('@/views/article/index.vue')
        },
        {
          path: '/notify',
          component: () => import('@/views/notify/index.vue')
        },
        { path: '/user', component: () => import('@/views/user/index.vue') }
      ]
    }
  ]
})
// 访问权限控制
router.beforeEach((to) => {
  // 用户仓库
  const { user } = stores()
  // 不需要登录的页面，白名单
  const wihteList = ['/login']
  // 如果没有登录且不在白名单内，去登录
  if (!user.user?.token && !wihteList.includes(to.path)) return '/login'
  // 否则不做任何处理
})
export default router
