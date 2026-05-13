<script setup lang="ts">
import type { Order, Route, User } from '@/types'
import ShipmentDriverSelect from '@/components/shipment-details/ShipmentDriverSelect.vue'

defineProps<{
  order: Order
  route?: Route | null
  assignedDriver: User | null
}>()

const formatDate = (date: string | null | undefined): string => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="bg-bg-canvas border border-border-default">
    <h2 class="text-xs font-bold tracking-wider text-text-secondary px-6 py-4">PACKAGE DETAILS</h2>

    <div class="divide-y divide-border-default">
      <div class="grid grid-cols-2 items-center px-6 py-3">
        <span class="text-text-secondary text-sm">Package</span>
        <div>
          <span class="text-text-primary text-sm">{{ order.weight }} kg</span>
          <p v-if="order.description" class="text-text-secondary text-xs mt-0.5">
            {{ order.description }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 items-center px-6 py-3">
        <span class="text-text-secondary text-sm">Assigned Driver</span>
        <ShipmentDriverSelect v-if="route" :route="route" :assigned-driver="assignedDriver" />
        <span v-else class="text-text-placeholder text-sm">—</span>
      </div>

      <div class="grid grid-cols-2 items-center px-6 py-3">
        <span class="text-text-secondary text-sm">ETA</span>
        <span class="text-text-primary text-sm">{{ formatDate(route?.eta) }}</span>
      </div>

      <div class="grid grid-cols-2 items-center px-6 py-3">
        <span class="text-text-secondary text-sm">Started At</span>
        <span class="text-text-primary text-sm">{{ formatDate(route?.started_at) }}</span>
      </div>

      <div class="grid grid-cols-2 items-center px-6 py-3">
        <span class="text-text-secondary text-sm">Completed At</span>
        <span class="text-text-primary text-sm">{{ formatDate(route?.completed_at) }}</span>
      </div>
    </div>
  </div>
</template>
