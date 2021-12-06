import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/member',
    name: 'LoginLayout',
    component: () => import('@/layouts/LoginLayout.vue'),
    children: [
      {
        path: 'login-v1',
        name: 'LoginV1',
        component: () => import('@/views/login/login-v1.vue'),
      },
      // 直接跳转到/，然后由/做判断应该继续怎么跳转
      {
        path: '',
        redirect: '/',
      },
    ],
  },
  {
    path: '/guest',
    name: 'BlankLayout',
    component: () => import('@/layouts/BlankLayout.vue'),
  },
  {
    path: '/',
    name: 'BasicLayout',
    component: () => import('@/layouts/BasicLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },
  {
    path: '/:subApp*',
    name: 'SubApp',
    component: () => import('@/layouts/BasicLayout.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
