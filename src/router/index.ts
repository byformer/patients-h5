import { createRouter, createWebHistory } from 'vue-router'
import stores from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/user',
          component: () => import('@/views/user/index.vue'),
          meta: { title: '我的' }
        }
      ]
    },
    {
      path: '/user/patient',
      component: () => import('@/views/user/patientPage.vue'),
      meta: { title: '档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/consult/consultFast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/consult/consultDep.vue'),
      meta: { title: '选择科室' }
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/consult/consultIllress.vue'),
      meta: { title: '病情描述' }
    },
    {
      path: '/consult/pay',
      component: () => import('@/views/consult/consultPay.vue'),
      meta: { title: '问诊支付' }
    },
    {
      path: '/room',
      component: () => import('@/views/room/index.vue'),
      meta: { title: '问诊室' },
      beforeEnter(to) {
        // 进入路由直接做一个支付结果的判断
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    {
      path: '/user/consult',
      component: () => import('@/views/user/consultPage.vue'),
      meta: { title: '问诊记录' }
    },
    {
      path: '/user/consult/:id',
      component: () => import('@/views/user/consultDetail.vue'),
      meta: { title: '问诊详情' }
    }
  ]
})
// 访问权限控制
router.beforeEach((to) => {
  // 修改标题
  document.title = `优医问诊-${to.meta.title}`
  // 用户仓库
  const { user } = stores()
  // 不需要登录的页面，白名单
  const wihteList = ['/login']
  // 如果没有登录且不在白名单内，去登录
  if (!user.user?.token && !wihteList.includes(to.path)) return '/login'
  // 否则不做任何处理
})
export default router
