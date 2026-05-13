<script setup lang="ts">
import type { Order, Route, User } from '@/types'
import ShipmentPackageDetails from '@/components/shipment-details/ShipmentPackageDetails.vue'
import ShipmentStatusTimeline from '@/components/shipment-details/ShipmentStatusTimeline.vue'
import { Edit, Printer, ArrowLeft } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import apiClient from '@/api/axios'

const router = useRouter()
const routePath = useRoute()
const orderId = routePath.params.id

const order = ref<Order | null>(null)
const route = ref<Route | null>(null)
const assignedDriver = ref<User | null>(null)
const isLoading = ref(true)
const error = ref('')

const fetchData = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const orderRes = await apiClient.get(`/dashboard/orders/${orderId}`)
    order.value = orderRes.data

    const routeRes = await apiClient.get(`/dashboard/routes`, {
      params: { order_id: orderId },
    })

    if (routeRes.data && routeRes.data.length > 0) {
      route.value = routeRes.data[0]
    }
  } catch (err: unknown) {
    console.error('Failed to fetch shipment details:', err)
    error.value = 'Failed to load shipment details.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
  </div>

  <div v-else-if="error || !order" class="p-8 text-center">
    <div class="bg-red-50 border border-red-200 text-red-600 p-4 rounded mb-4">
      {{ error || 'Order not found' }}
    </div>
    <BaseButton @click="router.back()">Go Back</BaseButton>
  </div>

  <div v-else class="p-8 font-roboto">
    <button
      class="flex items-center gap-1 text-text-secondary text-xs mb-2 hover:text-text-primary transition-colors"
      @click="router.back()"
    >
      <ArrowLeft class="w-3 h-3" /> BACK TO SHIPMENTS
    </button>

    <h1 class="text-3xl font-bold text-text-primary mb-1">Tracking Number: {{ order.title }}</h1>
    <span class="text-xs text-status-pending font-medium mb-6 block uppercase">
      {{ order.status }}
    </span>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <BaseButton variant="secondary"> <Edit class="w-4 h-4 mr-2" /> Edit </BaseButton>
      <BaseButton variant="primary"> <Printer class="w-4 h-4 mr-2" /> Print Label </BaseButton>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <div class="col-span-2 flex flex-col gap-6">
        <ShipmentPackageDetails
          :order="order"
          :route="route"
          :assigned-driver="assignedDriver"
          @driver-assigned="
            (id: number | null) => {
              if (route) route.driver_id = id
            }
          "
        />
      </div>
      <div>
        <ShipmentStatusTimeline v-if="route" :route="route" />
        <div
          v-else
          class="bg-bg-canvas border border-border-default p-6 text-center text-text-placeholder text-sm"
        >
          No route information available yet.
        </div>
      </div>
    </div>
  </div>
</template>
