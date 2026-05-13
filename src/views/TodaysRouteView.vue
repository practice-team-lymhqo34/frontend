<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/api/axios'
import type { Route, RouteStatusEnum } from '@/types'
import { Truck, MapPin, Clock, Camera } from 'lucide-vue-next'

const routes = ref<Route[]>([])
const isLoading = ref(true)
const error = ref('')

const fetchRoutes = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await apiClient.get('/dashboard/routes')
    routes.value = response.data
  } catch (err: unknown) {
    console.error('Failed to fetch routes:', err)
    error.value = 'Failed to load your routes.'
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (routeId: number, status: RouteStatusEnum) => {
  try {
    await apiClient.post(`/dashboard/routes/${routeId}/statuses`, {
      status: status,
    })
    await fetchRoutes()
  } catch (err: unknown) {
    console.error('Failed to update status:', err)
    alert('Failed to update status. Please try again.')
  }
}

onMounted(fetchRoutes)

const formatDate = (date: string | null): string => {
  if (!date) return '—'
  return new Date(date).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="p-8 bg-bg-surface min-h-screen font-roboto text-text-primary">
    <h1 class="text-3xl font-bold mb-6">Today's Route</h1>

    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-600 p-4 rounded text-center"
    >
      {{ error }}
      <button @click="fetchRoutes" class="ml-4 underline font-bold">Retry</button>
    </div>

    <div
      v-else-if="routes.length === 0"
      class="bg-bg-canvas border border-border-default rounded-lg p-20 text-center"
    >
      <Truck class="w-16 h-16 text-text-placeholder mx-auto mb-4" />
      <h3 class="text-xl font-bold mb-2">No active routes</h3>
      <p class="text-text-secondary">You don't have any routes assigned for today.</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <div
        v-for="(route, index) in routes"
        :key="route.id"
        class="bg-bg-canvas border border-border-default rounded-lg p-6 shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold"
            >
              {{ index + 1 }}
            </div>
            <div>
              <h2 class="text-lg font-bold">Route #{{ route.id }}</h2>
              <p class="text-xs text-text-secondary uppercase tracking-wider">
                Order ID: {{ route.order_id }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center gap-1 text-xs text-text-secondary font-medium mb-1">
              <Clock class="w-3 h-3" /> ETA
            </div>
            <span class="text-sm font-bold text-brand-primary">{{ formatDate(route.eta) }}</span>
          </div>
        </div>

        <div class="space-y-4 mb-6">
          <div
            class="flex items-start gap-3 p-3 bg-bg-surface rounded border border-border-default"
          >
            <MapPin class="w-5 h-5 text-brand-primary mt-0.5" />
            <div>
              <p class="text-xs text-text-secondary font-bold uppercase mb-1">Destination</p>
              <p class="text-sm">See order details for full address</p>
            </div>
          </div>
        </div>

        <div class="flex gap-2 mb-6">
          <button
            class="flex-1 flex items-center justify-center gap-2 py-3 bg-bg-surface border border-border-default rounded text-sm font-bold hover:bg-border-default transition-colors"
          >
            <Camera class="w-4 h-4" /> Add Photo
          </button>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <button
            class="py-2.5 text-xs font-bold rounded border uppercase transition-colors border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            @click="updateStatus(route.id, 'LOADED')"
          >
            Loaded
          </button>
          <button
            class="py-2.5 text-xs font-bold rounded border uppercase transition-colors border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            @click="updateStatus(route.id, 'IN_TRANSIT')"
          >
            In Transit
          </button>
          <button
            class="py-2.5 text-xs font-bold rounded border uppercase transition-colors border-status-delivered text-status-delivered hover:bg-status-delivered hover:text-white"
            @click="updateStatus(route.id, 'DELIVERED')"
          >
            Delivered
          </button>
        </div>
      </div>

      <button
        class="w-full py-4 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-btn-primary-hover transition-colors"
      >
        Start All Routes
      </button>
    </div>
  </div>
</template>
