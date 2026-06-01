<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/api/axios'
import type { Order } from '@/types'
import { Package, Search, Loader2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { getErrorMessage } from '@/utils/errorHandler'
import BaseEmptyState from '@/components/ui/BaseEmptyState.vue'

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
    console.error('Failed to fetch shipments:', err)
    error.value = getErrorMessage(err)
  } finally {
    isLoading.value = false
  }
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'PENDING':
    case 'pending':
      return 'bg-orange-100 text-orange-600'
    case 'IN_PROGRESS':
    case 'in_progress':
      return 'bg-blue-100 text-blue-600'
    case 'COMPLETED':
    case 'completed':
      return 'bg-green-100 text-green-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

onMounted(fetchOrders)
</script>

<template>
  <div class="p-8 font-roboto text-text-primary max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-[32px] font-bold">Shipments Management</h1>
        <p class="text-text-secondary">
          Overview of all active and pending deliveries in the system
        </p>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-32 bg-white rounded-xl border border-border-default"
    >
      <Loader2 class="w-12 h-12 text-brand-primary animate-spin mb-4" />
      <p class="text-text-secondary font-bold">LOADING SHIPMENTS...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-600 p-8 rounded-xl text-center"
    >
      <p class="font-bold mb-4">{{ error }}</p>
      <button @click="fetchOrders" class="px-6 py-2 bg-red-600 text-white rounded-lg font-bold">
        Retry
      </button>
    </div>

    <BaseEmptyState
      v-else-if="orders.length === 0"
      :icon="Package"
      title="No shipments found"
      description="There are currently no orders to display."
    />

    <div v-else class="bg-white border border-border-default rounded-xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-border-default flex gap-4 bg-bg-surface/50">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-placeholder" />
          <input
            type="text"
            placeholder="Search shipments by title, ID or client..."
            class="w-full pl-10 pr-4 py-2 bg-white border border-border-default rounded-lg outline-none focus:border-brand-primary transition-colors"
          />
        </div>
      </div>

      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-bg-surface border-b border-border-default">
            <th class="py-4 px-6 text-xs font-black text-text-secondary uppercase tracking-widest">
              Shipment / Order
            </th>
            <th class="py-4 px-6 text-xs font-black text-text-secondary uppercase tracking-widest">
              Created Date
            </th>
            <th class="py-4 px-6 text-xs font-black text-text-secondary uppercase tracking-widest">
              Weight
            </th>
            <th class="py-4 px-6 text-xs font-black text-text-secondary uppercase tracking-widest">
              Status
            </th>
            <th
              class="py-4 px-6 text-xs font-black text-text-secondary uppercase tracking-widest text-right"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-default">
          <tr
            v-for="order in orders"
            :key="order.id"
            class="hover:bg-blue-50/30 transition-colors cursor-pointer group"
            @click="router.push(`/shipments/${order.id}`)"
          >
            <td class="py-5 px-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center"
                >
                  <Package class="w-5 h-5" />
                </div>
                <div>
                  <div
                    class="font-bold text-text-primary group-hover:text-brand-primary transition-colors"
                  >
                    #{{ order.id }} - {{ order.title }}
                  </div>
                  <div class="text-xs text-text-secondary truncate max-w-xs">
                    {{ order.description || 'No additional details' }}
                  </div>
                </div>
              </div>
            </td>
            <td class="py-5 px-6 text-sm text-text-secondary font-medium">
              {{ new Date(order.created_at).toLocaleDateString('uk-UA') }}
            </td>
            <td class="py-5 px-6">
              <span class="text-sm font-bold text-text-primary">{{ order.weight }} kg</span>
            </td>
            <td class="py-5 px-6">
              <span
                class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                :class="getStatusClasses(order.status)"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="py-5 px-6 text-right">
              <button
                class="text-brand-primary font-bold text-xs hover:underline uppercase tracking-tighter"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
