<script setup lang="ts">
import { ref } from 'vue'

const stops = ref([
  {
    id: 1,
    type: 'PICKUP',
    time: '09:30 AM',
    address: 'SwiftPost Warehouse, 10 Depot Rd, Chernivtsi',
    details: 'Loaded: 15 parcels',
    status: 'loaded',
    eta: null,
  },
  {
    id: 2,
    type: 'DELIVERY',
    time: null,
    address: 'John Smith, 42 Khreshchatyk St, Kyiv',
    details: 'Cargo: PT-№4 (15 kg, Standard). Phone: +380 68 765 43 21',
    status: 'in-transit',
    eta: 'ETA: 14:15 (On Time)',
    etaPositive: true,
  },
  {
    id: 3,
    type: 'UPCOMING',
    time: null,
    address: 'LLC "TechTrade", 5 Lvivska Sq, Kyiv',
    details: null,
    status: null,
    eta: 'ETA: 16:30',
    etaPositive: false,
  },
])

const setStatus = (stopId: number, status: string) => {
  const stop = stops.value.find((s) => s.id === stopId)
  if (stop) stop.status = status
}
</script>

<template>
  <div class="p-8 bg-bg-surface min-h-screen">
    <h1 class="text-3xl font-bold text-text-primary mb-6">Today's Route</h1>

    <div class="flex flex-col gap-4">
      <div
        v-for="stop in stops"
        :key="stop.id"
        class="bg-bg-canvas border rounded-lg p-5"
        :class="stop.status === 'in-transit' ? 'border-brand-primary' : 'border-border-default'"
      >
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-sm font-bold text-text-primary">STOP {{ stop.id }} - {{ stop.type }}</h2>
          <span v-if="stop.time" class="text-xs text-text-placeholder">{{ stop.time }}</span>
        </div>

        <span
          v-if="stop.eta"
          class="text-xs font-medium mb-3 block"
          :style="stop.etaPositive ? 'color:#16A34A' : 'color:#D97706'"
        >
          {{ stop.eta }}
        </span>

        <div class="flex flex-col gap-2 mb-4">
          <div class="flex items-center bg-bg-surface rounded px-3 py-2 text-sm">
            <span class="text-text-secondary w-24 shrink-0">Address</span>
            <span class="text-text-primary">{{ stop.address }}</span>
          </div>
          <div
            v-if="stop.details"
            class="flex items-center bg-bg-surface rounded px-3 py-2 text-sm"
          >
            <span class="text-text-secondary w-24 shrink-0">Details</span>
            <span class="text-text-primary">{{ stop.details }}</span>
          </div>
        </div>

        <button
          v-if="stop.type === 'DELIVERY'"
          class="flex items-center gap-2 px-4 py-2 mb-3 bg-brand-primary text-white text-sm rounded"
        >
          Add Photo (Proof / Damage)
        </button>

        <div class="grid grid-cols-3 gap-2">
          <button
            class="py-2 text-sm font-medium rounded border transition-colors"
            :class="
              stop.status === 'loaded'
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'bg-bg-canvas text-brand-primary border-brand-primary'
            "
            @click="setStatus(stop.id, 'loaded')"
          >
            Loaded
          </button>
          <button
            class="py-2 text-sm font-medium rounded border transition-colors"
            :class="
              stop.status === 'in-transit'
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'bg-bg-canvas text-brand-primary border-brand-primary'
            "
            @click="setStatus(stop.id, 'in-transit')"
          >
            In Transit
          </button>
          <button
            class="py-2 text-sm font-medium rounded border transition-colors"
            :class="
              stop.status === 'delivered'
                ? 'bg-status-deliveredbg text-status-delivered border-status-delivered'
                : 'bg-bg-canvas text-brand-primary border-brand-primary'
            "
            @click="setStatus(stop.id, 'delivered')"
          >
            Delivered
          </button>
        </div>
      </div>

      <button class="w-full py-3 bg-brand-primary text-white font-medium rounded-lg">
        Start Transit
      </button>
    </div>
  </div>
</template>
