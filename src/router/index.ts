import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DriverLayout from '@/layouts/DriverLayout.vue'
import TodaysRouteView from '@/views/TodaysRouteView.vue'
import RecipientLayout from '@/layouts/RecipientLayout.vue'
import RecipientView from '@/views/RecipientView.vue'
import CreateDelivery from '@/views/CreateDelivery.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'delivery/new',
          name: 'create-delivery',
          component: CreateDelivery,
        },
      ],
    },
    {
      path: '/driver',
      component: DriverLayout,
      children: [
        {
          path: 'route',
          component: TodaysRouteView,
        },
      ],
    },
    {
      path: '/recipient',
      component: RecipientLayout,
      children: [
        {
          path: 'billing',
          component: RecipientView,
        },
      ],
    },
  ],
})

export default router
