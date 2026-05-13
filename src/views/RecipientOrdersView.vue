<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/api/axios'
import type { Order } from '@/types'
import { Package, Search, Filter, Plus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const orders = ref<Order[]>([])
const isLoading = ref(true)
const error = ref('')

const fetchOrders = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await apiClient.get('/orders/')
    orders.value = response.data
  } catch (err: unknown) {
    console.error('Failed to fetch orders:', err)
    error.value = 'Failed to load orders. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-orange-100 text-orange-600'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-600'
    case 'COMPLETED':
      return 'bg-green-100 text-green-600'
    case 'CANCELED':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

onMounted(fetchOrders)
</script>

<template>
  <div class="p-8 font-roboto text-text-primary">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-[32px] font-bold">My Orders</h1>
        <p class="text-text-secondary">Manage and track your delivery requests</p>
      </div>
      <button
        @click="router.push('/recipient/delivery/new')"
        class="flex items-center gap-2 bg-btn-primary-default text-white px-6 py-3 rounded font-bold hover:bg-btn-primary-hover transition-colors"
      >
        <Plus class="w-5 h-5" /> Create New Delivery
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-600 p-4 rounded text-center"
    >
      {{ error }}
      <button @click="fetchOrders" class="ml-4 underline font-bold">Retry</button>
    </div>

    <div
      v-else-if="orders.length === 0"
      class="bg-bg-canvas border border-border-default rounded-lg p-20 text-center"
    >
      <Package class="w-16 h-16 text-text-placeholder mx-auto mb-4" />
      <h3 class="text-xl font-bold mb-2">No orders found</h3>
      <p class="text-text-secondary mb-6">You haven't created any delivery requests yet.</p>
      <button
        @click="router.push('/recipient/delivery/new')"
        class="text-brand-primary font-bold hover:underline"
      >
        Create your first delivery
      </button>
    </div>

    <div v-else class="bg-bg-canvas border border-border-default rounded-lg overflow-hidden">
      <div class="p-4 border-b border-border-default flex gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-placeholder" />
          <input
            type="text"
            placeholder="Search by title..."
            class="w-full pl-10 pr-4 py-2 bg-bg-surface border border-border-default rounded outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2 border border-border-default rounded hover:bg-bg-surface transition-colors"
        >
          <Filter class="w-4 h-4" /> Filter
        </button>
      </div>

      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-bg-surface border-b border-border-default">
            <th class="py-4 px-6 text-sm font-bold text-text-secondary uppercase tracking-wider">
              Order
            </th>
            <th class="py-4 px-6 text-sm font-bold text-text-secondary uppercase tracking-wider">
              Date
            </th>
            <th class="py-4 px-6 text-sm font-bold text-text-secondary uppercase tracking-wider">
              Weight
            </th>
            <th class="py-4 px-6 text-sm font-bold text-text-secondary uppercase tracking-wider">
              Status
            </th>
            <th
              class="py-4 px-6 text-sm font-bold text-text-secondary uppercase tracking-wider text-right"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-default">
          <tr
            v-for="order in orders"
            :key="order.id"
            class="hover:bg-bg-surface transition-colors cursor-pointer"
            @click="router.push(`/shipments/${order.id}`)"
          >
            <td class="py-4 px-6">
              <div class="font-bold text-text-primary">{{ order.title }}</div>
              <div class="text-xs text-text-secondary truncate max-w-[200px]">
                {{ order.description || 'No description' }}
              </div>
            </td>
            <td class="py-4 px-6 text-sm text-text-secondary">
              {{ new Date(order.created_at).toLocaleDateString() }}
            </td>
            <td class="py-4 px-6 text-sm text-text-primary">{{ order.weight }} kg</td>
            <td class="py-4 px-6">
              <span
                class="px-3 py-1 rounded-full text-xs font-bold uppercase"
                :class="getStatusClasses(order.status)"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="py-4 px-6 text-right">
              <button class="text-brand-primary font-bold text-sm hover:underline">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
