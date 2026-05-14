<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { routesApi } from '@/api/routes'
import { useAuthStore } from '@/stores/auth'
import type { Route } from '@/types/route'
import { Truck, Clock, Camera, Loader2, Package, AlertCircle } from 'lucide-vue-next'

const authStore = useAuthStore()
const routes = ref<Route[]>([])
const isLoading = ref(true)
const error = ref('')

const vehicle = authStore.user?.vehicle

const fetchRoutes = async () => {
  isLoading.value = true
  error.value = ''
  try {
    routes.value = await routesApi.getTodayRoutes()
  } catch (err: unknown) {
    console.error('Failed to fetch routes:', err)
    error.value = 'Failed to load your routes for today.'
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (routeId: number, status: string) => {
  try {
    await routesApi.addRouteStatus(routeId, { status })
    await fetchRoutes()
  } catch (err: unknown) {
    console.error('Failed to update status:', err)
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
    <!-- Header -->
    <div
      class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border-default pb-6 gap-6"
    >
      <div>
        <h1 class="text-[32px] font-bold text-text-primary mb-1">Daily Route List</h1>
        <p class="text-text-secondary font-medium">
          Driver Console • {{ new Date().toLocaleDateString('uk-UA') }}
        </p>
      </div>

      <!-- Vehicle Status Info -->
      <div class="flex gap-4">
        <div
          v-if="vehicle"
          class="bg-white px-5 py-3 rounded-lg border border-border-default shadow-sm flex items-center gap-4"
        >
          <div class="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <Truck class="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <p
              class="text-[10px] font-black text-text-placeholder uppercase tracking-tighter leading-none mb-1"
            >
              Assigned Vehicle
            </p>
            <p class="text-sm font-bold text-text-primary leading-none">
              {{ vehicle.brand }} {{ vehicle.model }}
            </p>
            <p class="text-[11px] font-medium text-text-secondary mt-1">
              {{ vehicle.license_plate }} • {{ vehicle.max_weight }}kg limit
            </p>
          </div>
        </div>
        <div
          v-else
          class="bg-orange-50 px-5 py-3 rounded-lg border border-orange-200 flex items-center gap-4"
        >
          <AlertCircle class="w-5 h-5 text-orange-500" />
          <div>
            <p
              class="text-[10px] font-black text-orange-400 uppercase tracking-tighter leading-none mb-1"
            >
              Warning
            </p>
            <p class="text-sm font-bold text-orange-700 leading-none">No vehicle assigned</p>
          </div>
        </div>

        <div
          class="flex items-center gap-3 bg-white px-5 py-3 rounded-lg border border-border-default shadow-sm h-fit self-end"
        >
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-[10px] font-black uppercase tracking-wider text-text-secondary"
            >System Online</span
          >
        </div>
      </div>
    </div>

    <!-- Loading/Error States -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
      <Loader2 class="w-12 h-12 text-brand-primary animate-spin mb-4" />
      <p class="text-text-secondary font-bold tracking-widest">LOADING ROUTES...</p>
    </div>

    <div
      v-else-if="routes.length === 0"
      class="bg-white border border-dashed border-border-default rounded-lg p-20 text-center shadow-sm"
    >
      <Truck class="w-16 h-16 text-text-placeholder mx-auto mb-4 opacity-20" />
      <h3 class="text-xl font-bold text-text-primary">No routes assigned yet</h3>
      <p class="text-text-secondary mt-2">Check back later or contact your manager.</p>
    </div>

    <!-- Full Width List Layout -->
    <div v-else class="space-y-4">
      <div
        v-for="(route, index) in routes"
        :key="route.id"
        class="bg-white border border-border-default rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-stretch"
      >
        <!-- Index & Time Section -->
        <div
          class="lg:w-40 bg-bg-surface/50 border-r border-border-default p-6 flex lg:flex-col items-center justify-between lg:justify-center gap-2 text-center"
        >
          <span class="text-[10px] font-black text-text-placeholder uppercase tracking-tighter"
            >STOP #{{ index + 1 }}</span
          >
          <div class="flex flex-col items-center">
            <Clock class="w-5 h-5 text-brand-primary mb-1" />
            <span class="text-xl font-black text-text-primary">{{ formatDate(route.eta) }}</span>
          </div>
        </div>

        <!-- Details Section -->
        <div class="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Route Path & Info -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-3">
              <span
                class="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-bold uppercase"
                >ID: {{ route.id }}</span
              >
              <h2 class="text-lg font-bold text-text-primary">Order #{{ route.order_id }}</h2>
            </div>

            <!-- Route Path -->
            <div class="space-y-3 relative">
              <!-- Vertical line connecting pins -->
              <div
                class="absolute left-[7px] top-3 bottom-3 w-[2px] bg-border-default border-dashed border-l"
              ></div>

              <!-- Origin -->
              <div class="flex items-start gap-3 relative z-10">
                <div
                  class="w-4 h-4 rounded-full bg-orange-400 mt-1 flex-shrink-0 border-2 border-white"
                ></div>
                <div>
                  <p class="text-[9px] text-text-placeholder font-bold uppercase leading-none mb-1">
                    Pickup From
                  </p>
                  <p class="text-sm font-bold text-text-primary leading-tight">
                    {{ route.order?.origin_address || 'Origin address not specified' }}
                  </p>
                </div>
              </div>

              <!-- Destination -->
              <div class="flex items-start gap-3 relative z-10">
                <div
                  class="w-4 h-4 rounded-full bg-green-500 mt-1 flex-shrink-0 border-2 border-white"
                ></div>
                <div>
                  <p class="text-[9px] text-text-placeholder font-bold uppercase leading-none mb-1">
                    Deliver To
                  </p>
                  <p class="text-sm font-bold text-text-primary leading-tight">
                    {{ route.order?.destination_address || 'Destination address not specified' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipment Details -->
          <div
            class="bg-bg-surface/30 rounded-lg p-4 border border-border-default flex items-center"
          >
            <div class="grid grid-cols-2 w-full gap-4">
              <div>
                <p class="text-[10px] text-text-placeholder font-bold uppercase mb-1">Weight</p>
                <div class="flex items-center gap-2 font-bold text-text-primary">
                  <Package class="w-4 h-4 text-brand-primary" />
                  <span>{{ route.order?.weight || '—' }} kg</span>
                </div>
              </div>
              <div>
                <p class="text-[10px] text-text-placeholder font-bold uppercase mb-1">
                  Cargo Details
                </p>
                <p class="text-xs text-text-secondary italic line-clamp-2">
                  {{ route.order?.description || 'No special instructions provided' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div
          class="lg:w-80 p-6 bg-bg-surface/20 border-t lg:border-t-0 lg:border-l border-border-default flex flex-col justify-center gap-3"
        >
          <!-- Main Actions -->
          <div class="flex gap-2">
            <button
              class="flex-1 py-2.5 bg-white border border-border-default rounded text-[11px] font-bold text-text-primary hover:bg-bg-surface transition-colors flex items-center justify-center gap-2"
            >
              <Camera class="w-4 h-4 text-brand-primary" /> ADD PHOTO
            </button>
            <button
              class="px-4 py-2.5 bg-white border border-border-default rounded text-[11px] font-bold text-text-primary hover:bg-bg-surface"
            >
              DETAILS
            </button>
          </div>

          <!-- Status Bar -->
          <div class="flex p-1 bg-white border border-border-default rounded">
            <button
              @click="updateStatus(route.id, 'LOADED')"
              class="flex-1 py-2 text-[9px] font-black uppercase rounded transition-all hover:bg-brand-primary/10 text-brand-primary"
            >
              Loaded
            </button>
            <button
              @click="updateStatus(route.id, 'IN_TRANSIT')"
              class="flex-1 py-2 text-[9px] font-black uppercase rounded transition-all hover:bg-brand-primary/10 text-brand-primary border-x border-border-default"
            >
              Transit
            </button>
            <button
              @click="updateStatus(route.id, 'DELIVERED')"
              class="flex-1 py-2 text-[9px] font-black uppercase rounded transition-all hover:bg-green-500 text-green-600 font-bold"
            >
              Arrived
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
