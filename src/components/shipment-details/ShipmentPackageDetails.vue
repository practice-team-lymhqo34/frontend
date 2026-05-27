<script setup lang="ts">
import type { Order, Route, User } from '@/types'
import ShipmentDriverSelect from '@/components/shipment-details/ShipmentDriverSelect.vue'
import { MapPin, Weight, User as UserIcon } from 'lucide-vue-next'

defineProps<{
  order: Order
  route?: Route | null
  assignedDriver: User | null
  readOnly?: boolean
}>()

const emit = defineEmits<{
  refresh: []
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
      <div class="grid grid-cols-2 items-start px-6 py-4">
        <div class="flex items-center gap-2 text-text-secondary">
          <Weight class="w-4 h-4" />
          <span class="text-sm">Weight</span>
        </div>
        <div>
          <span class="text-text-primary text-sm font-bold">{{ order.weight }} kg</span>
          <p v-if="order.description" class="text-text-secondary text-xs mt-1 italic">
            "{{ order.description }}"
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 items-start px-6 py-4">
        <div class="flex items-center gap-2 text-text-secondary">
          <MapPin class="w-4 h-4" />
          <span class="text-sm">Route</span>
        </div>
        <div class="space-y-4">
          <div>
            <p class="text-[9px] font-black text-orange-400 uppercase tracking-tighter">
              Pickup From
            </p>
            <p class="text-sm text-text-primary font-medium">{{ order.origin_address || '—' }}</p>
          </div>
          <div>
            <p class="text-[9px] font-black text-green-500 uppercase tracking-tighter">
              Deliver To
            </p>
            <p class="text-sm text-text-primary font-medium">
              {{ order.destination_address || '—' }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 items-center px-6 py-4">
        <span class="text-text-secondary text-sm">Assigned Driver</span>
        <div v-if="readOnly" class="flex items-center gap-2">
          <div
            v-if="assignedDriver"
            class="flex items-center gap-3 bg-bg-surface px-3 py-1.5 rounded-lg border border-border-default w-full"
          >
            <div
              class="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0"
            >
              <UserIcon class="w-3 h-3 text-brand-primary" />
            </div>
            <span class="text-sm font-bold text-text-primary">{{ assignedDriver.full_name }}</span>
          </div>
          <span v-else class="text-text-placeholder text-sm font-medium">Not Assigned</span>
        </div>
        <ShipmentDriverSelect
          v-else
          :route="route || null"
          :order-id="order.id"
          :assigned-driver="assignedDriver"
          @refresh="emit('refresh')"
        />
      </div>

      <div class="grid grid-cols-2 items-center px-6 py-3">
        <span class="text-text-secondary text-sm">ETA</span>
        <div class="flex flex-col">
          <span
            class="text-sm font-bold"
            :class="route?.is_delayed ? 'text-amber-600' : 'text-text-primary'"
          >
            {{ formatDate(route?.eta) }}
          </span>
          <span v-if="route?.is_delayed" class="text-[9px] text-amber-600 font-black uppercase">
            {{ route.delay_minutes }}m delay
          </span>
        </div>
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
