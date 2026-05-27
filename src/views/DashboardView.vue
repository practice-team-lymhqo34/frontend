<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ordersApi } from '@/api/orders'
import { notificationsApi, type Notification } from '@/api/notifications'
import type { Order } from '@/types/order'
import StatCard from '@/components/dashboard/StatCard.vue'
import LatestUpdates from '@/components/dashboard/LatestUpdates.vue'
import UsersByCity from '@/components/dashboard/UsersByCity.vue'
import ActiveDeliveries from '@/components/dashboard/ActiveDeliveries.vue'
import { Loader2 } from 'lucide-vue-next'

const authStore = useAuthStore()
const isLoading = ref(true)
const orders = ref<Order[]>([])
const notifications = ref<Notification[]>([])

const fetchData = async () => {
  isLoading.value = true
  try {
    const [ordersRes, notificationsRes] = await Promise.all([
      ordersApi.getOrders(),
      notificationsApi.getNotifications(),
    ])
    orders.value = ordersRes
    notifications.value = notificationsRes
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)

const managerStats = computed(() => {
  const total = orders.value.length
  const inTransit = orders.value.filter((o) => o.status === 'in_progress').length
  const delivered = orders.value.filter((o) => o.status === 'completed').length
  const pending = orders.value.filter((o) => o.status === 'pending').length

  return [
    { title: 'Total Shipments', value: total.toString(), trend: 0 },
    { title: 'In Transit', value: inTransit.toString(), trend: 0 },
    { title: 'Delivered', value: delivered.toString(), trend: 0 },
    { title: 'Pending', value: pending.toString(), trend: 0 },
  ]
})

const clientStats = computed(() => {
  const active = orders.value.filter(
    (o) => o.status === 'in_progress' || o.status === 'pending',
  ).length
  const received = orders.value.filter((o) => o.status === 'completed').length

  return [
    { title: 'Active Shipments', value: active.toString(), trend: 0 },
    { title: 'Total Received', value: received.toString(), trend: 0 },
    {
      title: 'Notifications',
      value: notifications.value.filter((n) => !n.is_read).length.toString(),
      trend: 0,
    },
    {
      title: 'Total Weight',
      value: orders.value.reduce((acc, o) => acc + o.weight, 0).toFixed(1) + 'kg',
      trend: 0,
    },
  ]
})

const activeDeliveries = computed(() =>
  orders.value
    .filter((o) => o.status === 'in_progress' || o.status === 'pending')
    .map((o) => ({
      id: o.id.toString(),
      title: o.title,
      status: o.status,
      estimatedArrival: 'Calculating...',
    })),
)

const latestUpdates = computed(() =>
  notifications.value.slice(0, 5).map((n) => ({
    time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: n.message,
  })),
)

const cities = [
  { name: 'Kyiv', percent: '32.5%', count: '120k' },
  { name: 'Chernivtsi', percent: '25.4%', count: '105k' },
  { name: 'Lviv', percent: '14.5%', count: '48k' },
  { name: 'Ternopil', percent: '13.2%', count: '45k' },
]
</script>

<template>
  <div class="p-8 bg-bg-surface min-h-screen">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-text-primary">Dashboard</h1>
      <div v-if="!isLoading" class="text-sm text-text-placeholder">
        Welcome back,
        <span class="text-text-primary font-medium">{{ authStore.user?.full_name }}</span> ({{
          authStore.userRole
        }})
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <Loader2 class="w-10 h-10 text-primary animate-spin mb-4" />
      <p class="text-text-secondary">Loading your dashboard...</p>
    </div>

    <template v-else>
      <!-- Manager View -->
      <template v-if="authStore.isManager">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard v-for="stat in managerStats" :key="stat.title" v-bind="stat" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="lg:col-span-2 space-y-6">
            <LatestUpdates :updates="latestUpdates" title="System Activity" />
            <div class="bg-bg-canvas border border-border-default rounded-lg p-6">
              <h2 class="text-xl font-bold text-text-primary mb-4">Quick Actions</h2>
              <div class="grid grid-cols-2 gap-4">
                <router-link
                  to="/route-assignment"
                  class="flex flex-col items-center p-4 border border-border-default rounded hover:border-primary transition-all"
                >
                  <span class="text-sm font-bold text-text-primary">Assign Routes</span>
                  <span class="text-xs text-text-secondary text-center mt-1"
                    >Assign drivers to pending orders</span
                  >
                </router-link>
                <router-link
                  to="/shipments"
                  class="flex flex-col items-center p-4 border border-border-default rounded hover:border-primary transition-all"
                >
                  <span class="text-sm font-bold text-text-primary">Monitor Shipments</span>
                  <span class="text-xs text-text-secondary text-center mt-1"
                    >Check current delivery statuses</span
                  >
                </router-link>
              </div>
            </div>
          </div>
          <div class="space-y-6">
            <UsersByCity :cities="cities" />
          </div>
        </div>
      </template>

      <!-- Client (Recipient) View -->
      <template v-else-if="authStore.isClient">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard v-for="stat in clientStats" :key="stat.title" v-bind="stat" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="lg:col-span-2 space-y-6">
            <ActiveDeliveries v-if="activeDeliveries.length > 0" :deliveries="activeDeliveries" />
            <div
              v-else
              class="bg-bg-canvas border border-border-default rounded-lg p-10 text-center"
            >
              <h3 class="text-lg font-bold text-text-primary mb-2">No active shipments</h3>
              <p class="text-text-secondary mb-6">
                Create a new delivery request to start tracking.
              </p>
              <router-link
                to="/recipient/delivery/new"
                class="px-6 py-2 bg-primary text-white rounded font-bold"
              >
                New Delivery
              </router-link>
            </div>
            <LatestUpdates :updates="latestUpdates" title="My Notifications" />
          </div>
          <div class="space-y-6">
            <div class="bg-bg-canvas border border-border-default rounded-lg p-6">
              <h3 class="text-lg font-bold mb-4">Billing Snapshot</h3>
              <p class="text-sm text-text-secondary mb-4">
                View your full expenses and reports in the billing section.
              </p>
              <router-link
                to="/recipient/billing"
                class="block w-full py-2 bg-bg-surface border border-border-default rounded text-center text-sm font-medium hover:border-primary transition-all"
              >
                Go to Billing
              </router-link>
            </div>
            <div class="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
              <h3 class="text-lg font-bold text-primary mb-2">Recipient Support</h3>
              <p class="text-sm text-text-secondary mb-4">Need help with an order?</p>
              <button
                class="w-full py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Manager
              </button>
            </div>
          </div>
        </div>
      </template>
      <!-- Fallback/Driver View -->
      <template v-else>
        <div
          class="flex flex-col items-center justify-center py-20 bg-bg-canvas border border-border-default rounded-lg text-center"
        >
          <h2 class="text-xl font-bold text-text-primary mb-2">Driver Access</h2>
          <p class="text-text-placeholder mb-6 max-w-md mx-auto">
            Welcome to the driver portal. Your tasks and routes are managed in the dedicated
            section.
          </p>
          <router-link
            to="/driver/route"
            class="px-8 py-3 bg-primary text-white rounded-md font-bold hover:bg-primary/90 transition-colors"
          >
            View My Route
          </router-link>
        </div>
      </template>
    </template>
  </div>
</template>
