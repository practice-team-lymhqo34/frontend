<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { routesApi } from '@/api/routes'
import { useAuthStore } from '@/stores/auth'
import type { Route, DeliveryPhoto } from '@/types/route'
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock,
  Info,
  Loader2,
  Package,
  Trash2,
  Truck,
  X,
} from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseImageUpload from '@/components/ui/BaseImageUpload.vue'
import BaseEmptyState from '@/components/ui/BaseEmptyState.vue'
import { getErrorMessage } from '@/utils/errorHandler'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const routes = ref<Route[]>([])
const routeStatuses = ref<Record<number, string>>({})
const isLoading = ref(true)
const isUpdating = ref<Record<number, boolean>>({})
const error = ref('')
const isPhotoModalOpen = ref(false)
const isSummaryModalOpen = ref(false)
const selectedRouteForPhoto = ref<number | null>(null)
const tripSummary = ref({ distance: 0, fuel: 0, cost: 0 })
const photos = ref<DeliveryPhoto[]>([])
const isFetchingPhotos = ref(false)
const selectedFullPhoto = ref<string | null>(null)
const photoToDelete = ref<number | null>(null)
const isDeleteModalOpen = ref(false)

const openPhotoUpload = (routeId: number) => {
  selectedRouteForPhoto.value = routeId
  isPhotoModalOpen.value = true
}

const fetchPhotos = async (routeId: number) => {
  isFetchingPhotos.value = true
  try {
    photos.value = await routesApi.getRoutePhotos(routeId)
  } catch (err) {
    console.error('Failed to fetch photos:', err)
  } finally {
    isFetchingPhotos.value = false
  }
}

const confirmDeletePhoto = (photoId: number) => {
  photoToDelete.value = photoId
  isDeleteModalOpen.value = true
}

const deletePhoto = async () => {
  if (!photoToDelete.value) return
  try {
    await routesApi.deleteRoutePhoto(photoToDelete.value)
    photos.value = photos.value.filter((p) => p.id !== photoToDelete.value)
    showToast('Photo deleted successfully')
  } catch (err) {
    showToast(getErrorMessage(err), 'error')
  } finally {
    isDeleteModalOpen.value = false
    photoToDelete.value = null
  }
}

const onPhotoUploaded = async () => {
  showToast('Photo uploaded successfully')
  if (selectedRouteForPhoto.value) {
    await fetchPhotos(selectedRouteForPhoto.value)
  }
}

const showTripSummary = (distance: number, fuel: number, cost: number) => {
  tripSummary.value = { distance, fuel, cost }
  isSummaryModalOpen.value = true
}

const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({
  show: false,
  message: '',
  type: 'success',
})

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const isDetailsModalOpen = ref(false)
const selectedRoute = ref<Route | null>(null)

const openDetails = async (route: Route) => {
  selectedRoute.value = route
  isDetailsModalOpen.value = true
  await fetchPhotos(route.id)
}

const vehicle = computed(() => authStore.user?.vehicle)

const goToVehicle = () => {
  router.push('/driver/vehicle')
}

const currentStopId = computed(() => {
  const activeRoute = routes.value.find(
    (r) => (routeStatuses.value[r.id] || '').toLowerCase() !== 'delivered',
  )
  return activeRoute?.id
})

const fetchRoutes = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const data = await routesApi.getTodayRoutes()
    routes.value = data

    await Promise.all(
      data.map(async (route) => {
        try {
          const statuses = await routesApi.getRouteStatuses(route.id)
          if (statuses.length > 0) {
            const lastStatus = statuses[statuses.length - 1]
            routeStatuses.value[route.id] = lastStatus?.status ?? ''
          } else {
            routeStatuses.value[route.id] = ''
          }
        } catch (err) {
          console.error(`Failed to fetch status for route ${route.id}:`, err)
          routeStatuses.value[route.id] = ''
        }
      }),
    )
  } catch (err: unknown) {
    console.error('Failed to fetch routes:', err)
    error.value = getErrorMessage(err)
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (routeId: number, status: string) => {
  if (isUpdating.value[routeId]) return
  isUpdating.value[routeId] = true
  try {
    await routesApi.addRouteStatus(routeId, { status })
    routeStatuses.value[routeId] = status
    routes.value = await routesApi.getTodayRoutes()
    showToast(`Status updated to ${status.replace('_', ' ')}`)

    if (status.toLowerCase() === 'delivered') {
      const updatedRoute = routes.value.find((r) => r.id === routeId)
      if (updatedRoute && updatedRoute.fuel_cost !== null) {
        const distance = updatedRoute.order?.distance || 0
        const fuelConsumption = authStore.user?.vehicle?.fuel_consumption || 0

        const stats = {
          distance: distance,
          fuel: Number(((distance * fuelConsumption) / 100).toFixed(2)),
          cost: updatedRoute.fuel_cost || 0,
        }

        showTripSummary(stats.distance, stats.fuel, stats.cost)
        authStore.setLastTripStats(stats)
        authStore.addTripToHistory({ ...stats, routeId })
      }
    }
  } catch (err: unknown) {
    console.error('Failed to update status:', err)
    showToast(getErrorMessage(err), 'error')
  } finally {
    isUpdating.value[routeId] = false
  }
}

const getStatusColor = (routeId: number, buttonStatus: string) => {
  const current = (routeStatuses.value[routeId] || '').toLowerCase()
  const target = buttonStatus.toLowerCase()
  if (current === target) {
    return target === 'delivered' ? 'bg-green-500 text-white' : 'bg-brand-primary text-white'
  }
  if (!isStatusDisabled(routeId, buttonStatus)) {
    return 'bg-brand-primary/10 text-brand-primary border-brand-primary border'
  }
  return 'text-text-placeholder bg-bg-surface'
}

const isStatusDisabled = (routeId: number, targetStatus: string) => {
  const current = routeStatuses.value[routeId]
  if (isUpdating.value[routeId]) return true

  const transitions: Record<string, string> = {
    '': 'assigned',
    assigned: 'loaded',
    loaded: 'in_transit',
    in_transit: 'delivered',
    delivered: 'none',
  }

  const normalizedCurrent = current?.toLowerCase() || ''
  const normalizedTarget = targetStatus.toLowerCase()

  return transitions[normalizedCurrent] !== normalizedTarget
}

onMounted(fetchRoutes)

const formatDate = (date: string | null): string => {
  if (!date) return '—'
  return new Date(date).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const extractDetails = (description: string | null | undefined) => {
  if (!description) {
    return { qty: '—', vol: '—', desc: 'No instructions' }
  }

  const qtyMatch = description.match(/Quantity: ([^,.]+)/)
  const volMatch = description.match(/Volume: ([^,.]+)/)

  const cleanDesc = description
    .replace(/Quantity: [^,.]+[,.]?\s*/i, '')
    .replace(/Volume: [^,.]+[,.]?\s*/i, '')
    .trim()

  return {
    qty: qtyMatch ? qtyMatch[1]?.trim() : '—',
    vol: volMatch ? volMatch[1]?.trim() : '—',
    desc: cleanDesc || 'No additional instructions',
  }
}
</script>

<template>
  <div class="p-4 md:p-8 bg-bg-surface min-h-screen font-roboto text-text-primary">
    <div
      class="mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border-default pb-6 gap-6"
    >
      <div>
        <div class="flex items-center gap-4 mb-1 flex-wrap">
          <h1 class="text-2xl md:text-[32px] font-bold text-text-primary">Daily Route List</h1>
          <span
            v-if="routes.length > 0"
            class="bg-brand-primary text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest"
          >
            {{ routes.length }} STOPS TODAY
          </span>
        </div>
        <p class="text-text-secondary font-medium">
          Driver Console • {{ new Date().toLocaleDateString('uk-UA') }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div
          v-if="vehicle"
          @click="goToVehicle"
          class="bg-white px-5 py-3 rounded-lg border border-border-default shadow-sm flex items-center gap-4 flex-1 md:flex-initial cursor-pointer hover:border-brand-primary transition-colors group"
        >
          <div
            class="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors"
          >
            <Truck class="w-5 h-5 text-brand-primary group-hover:text-white" />
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
          class="bg-orange-50 px-5 py-3 rounded-lg border border-orange-200 flex items-center gap-4 flex-1 md:flex-initial"
        >
          <AlertCircle class="w-5 h-5 text-orange-500" />
          <div class="flex-1">
            <p
              class="text-[10px] font-black text-orange-400 uppercase tracking-tighter leading-none mb-1"
            >
              Warning
            </p>
            <p class="text-sm font-bold text-orange-700 leading-none">No vehicle assigned</p>
          </div>
          <BaseButton variant="secondary" size="sm" @click="goToVehicle">Add Vehicle</BaseButton>
        </div>
      </div>
    </div>

    <div
      v-if="error"
      class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700"
    >
      <AlertCircle class="w-5 h-5 flex-shrink-0" />
      <div class="flex-1">
        <p class="font-bold">Error loading routes</p>
        <p class="text-sm">{{ error }}</p>
      </div>
      <button
        @click="fetchRoutes"
        class="px-4 py-2 bg-white border border-red-200 rounded-md text-sm font-bold hover:bg-red-50 transition-colors"
      >
        Retry
      </button>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
      <Loader2 class="w-12 h-12 text-brand-primary animate-spin mb-4" />
      <p class="text-text-secondary font-bold tracking-widest">LOADING ROUTES...</p>
    </div>

    <BaseEmptyState
      v-else-if="routes.length === 0"
      :icon="Truck"
      title="No routes assigned yet"
      description="Check back later or contact your manager."
    />

    <div v-else class="space-y-6">
      <div
        v-for="(route, index) in routes"
        :key="route.id"
        class="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-stretch relative"
        :class="[
          route.id === currentStopId
            ? 'border-brand-primary border-2 shadow-lg z-10'
            : 'border-border-default',
          (routeStatuses[route.id] || '').toLowerCase() === 'delivered'
            ? 'opacity-75 grayscale-[0.3] bg-bg-surface/10'
            : '',
        ]"
      >
        <div
          v-if="route.id === currentStopId"
          class="absolute top-0 right-0 bg-brand-primary text-white text-[9px] font-black px-4 py-1.5 rounded-bl-lg z-20 uppercase tracking-widest shadow-sm"
        >
          Active Stop
        </div>
        <div
          v-else-if="(routeStatuses[route.id] || '').toLowerCase() === 'delivered'"
          class="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-lg z-20 uppercase tracking-widest flex items-center gap-1 shadow-sm"
        >
          <CheckCircle2 class="w-3 h-3" /> Completed
        </div>

        <div
          class="lg:w-40 bg-bg-surface/50 border-b lg:border-b-0 lg:border-r border-border-default p-4 lg:p-6 flex lg:flex-col items-center justify-between lg:justify-center gap-2 text-center"
        >
          <span class="text-[10px] font-black text-text-placeholder uppercase tracking-tighter"
            >STOP #{{ index + 1 }}</span
          >
          <div class="flex flex-row lg:flex-col items-center gap-2">
            <Clock class="w-4 h-4 lg:w-5 lg:h-5 text-brand-primary" />
            <span class="text-lg lg:text-xl font-black text-text-primary">{{
              formatDate(route.eta)
            }}</span>
          </div>
        </div>

        <div class="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-3">
              <span
                class="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-bold uppercase"
                >ID: {{ route.id }}</span
              >
              <h2 class="text-lg font-bold text-text-primary">Order #{{ route.order_id }}</h2>
            </div>

            <div class="space-y-3 relative">
              <div
                class="absolute left-[7px] top-3 bottom-3 w-[2px] bg-border-default border-dashed border-l"
              ></div>
              <div class="flex items-start gap-3 relative z-10">
                <div
                  class="w-4 h-4 rounded-full bg-orange-400 mt-1 flex-shrink-0 border-2 border-white"
                ></div>
                <div>
                  <p class="text-[9px] text-text-placeholder font-bold uppercase leading-none mb-1">
                    Pickup From
                  </p>
                  <p class="text-sm font-bold text-text-primary leading-tight">
                    {{ route.order?.origin_address || '—' }}
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-3 relative z-10">
                <div
                  class="w-4 h-4 rounded-full bg-green-500 mt-1 flex-shrink-0 border-2 border-white"
                ></div>
                <div>
                  <p class="text-[9px] text-text-placeholder font-bold uppercase leading-none mb-1">
                    Deliver To
                  </p>
                  <p class="text-sm font-bold text-text-primary leading-tight">
                    {{ route.order?.destination_address || '—' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-bg-surface/30 rounded-lg p-4 border border-border-default flex items-center"
          >
            <div class="grid grid-cols-3 w-full gap-2">
              <div class="border-r border-border-default pr-2">
                <p class="text-[9px] text-text-placeholder font-bold uppercase mb-1">Weight</p>
                <div class="flex items-center gap-1 font-bold text-text-primary text-xs">
                  <Package class="w-3 h-3 text-brand-primary" />
                  <span>{{ route.order?.weight || '—' }}kg</span>
                </div>
              </div>
              <div class="border-r border-border-default px-2">
                <p class="text-[9px] text-text-placeholder font-bold uppercase mb-1">Qty</p>
                <div class="font-bold text-text-primary text-xs">
                  {{ extractDetails(route.order?.description).qty }}
                </div>
              </div>
              <div class="pl-2">
                <p class="text-[9px] text-text-placeholder font-bold uppercase mb-1">Vol</p>
                <div class="font-bold text-text-primary text-xs">
                  {{ extractDetails(route.order?.description).vol }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="lg:w-96 p-6 bg-bg-surface/20 border-t lg:border-t-0 lg:border-l border-border-default flex flex-col justify-center gap-4"
        >
          <div class="flex gap-2">
            <button
              @click="openPhotoUpload(route.id)"
              class="flex-1 min-h-[48px] bg-white border border-border-default rounded-lg text-[11px] font-bold text-text-primary hover:bg-bg-surface transition-colors flex items-center justify-center gap-2"
            >
              <Camera class="w-4 h-4 text-brand-primary" /> ADD PHOTO
            </button>
            <button
              @click="openDetails(route)"
              class="px-6 min-h-[48px] bg-white border border-border-default rounded-lg text-[11px] font-bold text-text-primary hover:bg-bg-surface"
            >
              DETAILS
            </button>
          </div>

          <div class="flex p-1.5 bg-white border border-border-default rounded-xl relative">
            <div
              v-if="isUpdating[route.id]"
              class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl"
            >
              <Loader2 class="w-5 h-5 text-brand-primary animate-spin" />
            </div>

            <button
              v-if="!routeStatuses[route.id]"
              @click="updateStatus(route.id, 'assigned')"
              class="flex-1 min-h-[48px] text-[10px] font-black uppercase rounded-lg transition-all bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm"
            >
              Accept Route
            </button>

            <template v-else>
              <button
                @click="updateStatus(route.id, 'loaded')"
                :disabled="isStatusDisabled(route.id, 'loaded')"
                :class="[
                  'flex-1 min-h-[48px] text-[10px] font-black uppercase rounded-lg transition-all disabled:cursor-not-allowed',
                  getStatusColor(route.id, 'loaded'),
                ]"
              >
                Loaded
              </button>
              <button
                @click="updateStatus(route.id, 'in_transit')"
                :disabled="isStatusDisabled(route.id, 'in_transit')"
                :class="[
                  'flex-1 min-h-[48px] text-[10px] font-black uppercase rounded-lg transition-all mx-1.5 disabled:cursor-not-allowed',
                  getStatusColor(route.id, 'in_transit'),
                ]"
              >
                In Transit
              </button>
              <button
                @click="updateStatus(route.id, 'delivered')"
                :disabled="isStatusDisabled(route.id, 'delivered')"
                :class="[
                  'flex-1 min-h-[48px] text-[10px] font-black uppercase rounded-lg transition-all disabled:cursor-not-allowed',
                  getStatusColor(route.id, 'delivered'),
                ]"
              >
                Delivered
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <BaseModal
      :show="isDetailsModalOpen"
      @cancel="isDetailsModalOpen = false"
      title="Order Details"
      message="msg"
    >
      <div v-if="selectedRoute" class="space-y-6 py-2">
        <div class="flex items-center justify-between border-b pb-4">
          <div>
            <p class="text-[10px] font-black text-text-placeholder uppercase">Order ID</p>
            <p class="text-lg font-bold">#{{ selectedRoute.order_id }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-text-placeholder uppercase">Current Status</p>
            <span
              class="text-xs font-bold bg-brand-primary/10 text-brand-primary px-2 py-1 rounded uppercase"
            >
              {{ routeStatuses[selectedRoute.id] || 'Assigned' }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-bg-surface rounded-lg border border-border-default">
            <p class="text-[9px] font-black text-text-placeholder uppercase mb-1">Pickup Address</p>
            <p class="text-sm font-medium leading-tight">
              {{ selectedRoute.order?.origin_address }}
            </p>
          </div>
          <div class="p-3 bg-bg-surface rounded-lg border border-border-default">
            <p class="text-[9px] font-black text-text-placeholder uppercase mb-1">
              Delivery Address
            </p>
            <p class="text-sm font-medium leading-tight">
              {{ selectedRoute.order?.destination_address }}
            </p>
          </div>
        </div>

        <div>
          <p class="text-[10px] font-black text-text-placeholder uppercase mb-2">
            Order Information
          </p>
          <div class="bg-white border rounded-lg overflow-hidden">
            <div class="p-4 border-b flex justify-between items-center">
              <span class="text-sm font-bold text-text-primary">{{
                selectedRoute.order?.title
              }}</span>
              <span class="text-xs font-bold text-brand-primary"
                >{{ selectedRoute.order?.weight }} kg</span
              >
            </div>
            <div class="p-4 bg-bg-surface/30">
              <p class="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
                {{ extractDetails(selectedRoute.order?.description).desc }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p class="text-[10px] font-black text-text-placeholder uppercase mb-2">
            Damaged Package Photos
          </p>
          <div v-if="isFetchingPhotos" class="flex justify-center py-4">
            <Loader2 class="w-6 h-6 text-brand-primary animate-spin" />
          </div>
          <div v-else-if="photos.length > 0" class="grid grid-cols-2 gap-3">
            <div
              v-for="photo in photos"
              :key="photo.id"
              class="relative rounded-lg overflow-hidden border border-border-default group cursor-pointer"
              @click="selectedFullPhoto = photo.url"
            >
              <img :src="photo.url" class="w-full h-32 object-cover" alt="Package photo" />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <button
                  @click.stop="confirmDeletePhoto(photo.id)"
                  class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div v-else class="p-4 bg-bg-surface border border-dashed rounded-lg text-center">
            <p class="text-xs text-text-secondary">No photos uploaded yet</p>
          </div>
        </div>

        <div
          class="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-lg border border-brand-primary/10"
        >
          <Info class="w-5 h-5 text-brand-primary flex-shrink-0" />
          <p class="text-xs text-text-primary">
            Please ensure you have all documents signed before marking as
            <span class="font-bold">Delivered</span>.
          </p>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="primary" @click="isDetailsModalOpen = false" class="w-full">
          Close
        </BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      :show="isPhotoModalOpen"
      @cancel="isPhotoModalOpen = false"
      title="Upload Photo"
      message=""
    >
      <BaseImageUpload
        v-if="selectedRouteForPhoto"
        :route-id="selectedRouteForPhoto"
        @uploaded="onPhotoUploaded"
        @close="isPhotoModalOpen = false"
      />
    </BaseModal>

    <BaseModal :show="!!selectedFullPhoto" @cancel="selectedFullPhoto = null" title="Photo Preview">
      <div class="flex justify-center">
        <img
          :src="selectedFullPhoto || ''"
          class="max-w-full max-h-[70vh] rounded-lg shadow-xl"
          alt="Full size photo"
        />
      </div>
      <template #footer>
        <BaseButton variant="primary" @click="selectedFullPhoto = null" class="w-full">
          Close
        </BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      :show="isSummaryModalOpen"
      @cancel="isSummaryModalOpen = false"
      title="Route Completed!"
    >
      <div class="py-4 text-center">
        <div
          class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 class="w-10 h-10" />
        </div>
        <h3 class="text-xl font-bold mb-2">Great job!</h3>
        <p class="text-text-secondary mb-8">Trip details have been calculated automatically.</p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-bg-surface p-4 rounded-xl border border-border-default">
            <p class="text-[10px] font-black text-text-placeholder uppercase mb-1">
              Estimated Distance
            </p>
            <p class="text-2xl font-bold text-text-primary">
              {{ tripSummary.distance }} <span class="text-sm font-medium">km</span>
            </p>
          </div>
          <div class="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10">
            <p class="text-[10px] font-black text-brand-primary uppercase mb-1">Fuel Consumed</p>
            <p class="text-2xl font-bold text-brand-primary">
              {{ tripSummary.fuel.toFixed(2) }} <span class="text-sm font-medium">L</span>
            </p>
          </div>
          <div class="bg-brand-primary/10 p-4 rounded-xl border border-border-default">
            <p class="text-[10px] font-black text-brand-primary uppercase mb-1">Fuel Cost</p>
            <p class="text-2xl font-bold text-brand-primary">
              {{ tripSummary.cost.toFixed(2) }} <span class="text-sm font-medium">UAH</span>
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="primary" @click="isSummaryModalOpen = false" class="w-full py-4">
          DONE
        </BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      :show="isDeleteModalOpen"
      title="Delete Photo"
      message="Are you sure you want to delete this photo? This action cannot be undone."
      confirm-text="Delete"
      variant="danger"
      @confirm="deletePhoto"
      @cancel="isDeleteModalOpen = false"
    />

    <Transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border pointer-events-auto"
        :class="
          toast.type === 'success'
            ? 'bg-green-600 border-green-500 text-white'
            : 'bg-red-600 border-red-500 text-white'
        "
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5" />
        <AlertCircle v-else class="w-5 h-5" />
        <p class="text-sm font-bold tracking-wide uppercase">{{ toast.message }}</p>
        <button @click="toast.show = false" class="ml-2 hover:opacity-70">
          <X class="w-4 h-4" />
        </button>
      </div>
    </Transition>
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
