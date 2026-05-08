<script setup lang="ts">
import type { Order, Route, User } from '@/types'
import ShipmentPackageDetails from '@/components/shipment-details/ShipmentPackageDetails.vue'
import ShipmentStatusTimeline from '@/components/shipment-details/ShipmentStatusTimeline.vue'
import { Edit, Printer, ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()

// TODO: замінити на useRoute().params.id + apiClient
const order = ref<Order>({
  id: 4,
  title: 'PT-№4',
  description: 'Standard Delivery',
  weight: 15,
  status: 'awaiting_confirmation',
  owner_id: 1,
  created_at: '2026-03-15T10:00:00Z',
})

const route = ref<Route>({
  id: 1,
  order_id: 4,
  driver_id: null,
  started_at: null,
  eta: '2026-03-17T14:00:00Z',
  completed_at: null,
  statuses: [
    { id: 1, route_id: 1, status: 'assigned', created_at: '2026-03-15T10:00:00Z' },
    { id: 2, route_id: 1, status: 'in_transit', created_at: '2026-03-16T08:30:00Z' },
  ],
})
const assignedDriver = ref<User | null>(null)
</script>

<template>
  <div class="p-8 font-roboto">
    <button
      class="flex items-center gap-1 text-text-secondary text-xs mb-2 hover:text-text-primary transition-colors"
      @click="router.back()"
    >
      <ArrowLeft class="w-3 h-3" /> BACK TO SHIPMENTS
    </button>

    <h1 class="text-3xl font-bold text-text-primary mb-1">Tracking Number: {{ order.title }}</h1>
    <span class="text-xs text-status-pending font-medium mb-6 block">
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
          @driver-assigned="(id: number | null) => (route.driver_id = id)"
        />
      </div>
      <div>
        <ShipmentStatusTimeline :route="route" />
      </div>
    </div>
  </div>
</template>
