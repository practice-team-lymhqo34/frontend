<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Package,
  Truck,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
} from 'lucide-vue-next'
import { routesApi } from '@/api/routes'
import { ordersApi } from '@/api/orders'
import type { Order } from '@/types/order'
import type { User as UserType } from '@/types/user'
import type { Vehicle } from '@/types/vehicle'

const unassignedOrders = ref<Order[]>([])
const isLoadingOrders = ref(true)

onMounted(async () => {
  try {
    unassignedOrders.value = await ordersApi.getUnassignedOrders()
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    isLoadingOrders.value = false
  }
})

const drivers = ref<(UserType & { vehicle?: Vehicle })[]>([
  {
    id: 1,
    email: 'driver1@logiflow.com',
    role: 'driver',
    full_name: 'Oleksandr Kovalenko',
    phone_number: '+380501112233',
    created_at: '',
    vehicle: {
      id: 1,
      driver_id: 1,
      brand: 'Mercedes-Benz',
      model: 'Sprinter',
      max_weight: 1500,
      max_volume: 10,
      license_plate: 'AA 1234 BB',
      fuel_consumption: 12,
      current_mileage: 45000,
      maintenance_interval: 15000,
    },
  },
  {
    id: 2,
    email: 'driver2@logiflow.com',
    role: 'driver',
    full_name: 'Ivan Petrov',
    phone_number: '+380674445566',
    created_at: '',
    vehicle: {
      id: 2,
      driver_id: 2,
      brand: 'Volkswagen',
      model: 'Crafter',
      max_weight: 1000,
      max_volume: 8,
      license_plate: 'BC 5678 CB',
      fuel_consumption: 10,
      current_mileage: 32000,
      maintenance_interval: 15000,
    },
  },
])

const selectedOrder = ref<Order | null>(null)
const selectedDriver = ref<(UserType & { vehicle?: Vehicle }) | null>(null)
const isSubmitting = ref(false)
const assignmentSuccess = ref(false)

const canAssign = computed(() => {
  if (!selectedOrder.value || !selectedDriver.value?.vehicle) return false
  return selectedOrder.value.weight <= selectedDriver.value.vehicle.max_weight
})

const handleAssign = async () => {
  if (
    !selectedOrder.value ||
    !selectedDriver.value ||
    !selectedDriver.value.vehicle ||
    !canAssign.value
  )
    return

  isSubmitting.value = true
  try {
    await routesApi.assignRoute(
      selectedOrder.value.id,
      selectedDriver.value.id,
      selectedDriver.value.vehicle.id,
    )

    assignmentSuccess.value = true
    const assignedOrderId = selectedOrder.value.id

    setTimeout(() => {
      unassignedOrders.value = unassignedOrders.value.filter((o) => o.id !== assignedOrderId)
      selectedOrder.value = null
      selectedDriver.value = null
      assignmentSuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Assignment failed', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-8 font-roboto text-text-primary">
    <div class="mb-8">
      <h1 class="text-[32px] font-bold">Route Assignment</h1>
      <p class="text-text-secondary">Assign pending orders to available drivers and vehicles</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Package class="w-5 h-5 text-brand-primary" />
            Unassigned Orders
          </h2>
          <span
            class="bg-bg-surface px-3 py-1 rounded-full text-xs font-bold border border-border-default"
          >
            {{ unassignedOrders.length }} Pending
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-if="isLoadingOrders"
            class="flex flex-col items-center justify-center py-12 bg-bg-canvas border border-dashed border-border-default rounded-lg"
          >
            <Loader2 class="w-8 h-8 text-brand-primary animate-spin mb-2" />
            <p class="text-text-secondary text-sm">Loading orders...</p>
          </div>

          <div
            v-else-if="unassignedOrders.length === 0"
            class="flex flex-col items-center justify-center py-12 bg-bg-canvas border border-dashed border-border-default rounded-lg"
          >
            <Package class="w-8 h-8 text-text-placeholder mb-2" />
            <p class="text-text-secondary text-sm">No unassigned orders found</p>
          </div>

          <template v-else>
            <div
              v-for="order in unassignedOrders"
              :key="order.id"
              @click="selectedOrder = order"
              class="p-4 border rounded-lg transition-all cursor-pointer"
              :class="[
                selectedOrder?.id === order.id
                  ? 'border-brand-primary bg-blue-50/50'
                  : 'border-border-default bg-bg-canvas hover:border-text-placeholder',
              ]"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg">{{ order.title }}</h3>
                <span class="text-sm font-bold text-brand-primary">{{ order.weight }} kg</span>
              </div>
              <div class="flex items-center gap-4 text-sm text-text-secondary">
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 rounded-full bg-orange-400"></div>
                  From: {{ order.origin_address?.split(',')[0] || 'N/A' }}
                </div>
                <ChevronRight class="w-3 h-3" />
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                  To: {{ order.destination_address?.split(',')[0] || 'N/A' }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Truck class="w-5 h-5 text-brand-primary" />
            Available Drivers
          </h2>
        </div>

        <div
          v-if="!selectedOrder"
          class="bg-bg-surface border border-dashed border-border-default rounded-lg p-12 text-center"
        >
          <Package class="w-12 h-12 text-text-placeholder mx-auto mb-4" />
          <p class="text-text-secondary">Select an order first to see compatible drivers</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="driver in drivers"
            :key="driver.id"
            @click="selectedDriver = driver"
            class="p-4 border rounded-lg transition-all cursor-pointer"
            :class="[
              selectedDriver?.id === driver.id
                ? 'border-brand-primary bg-blue-50/50'
                : 'border-border-default bg-bg-canvas hover:border-text-placeholder',
            ]"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-bg-surface rounded-full flex items-center justify-center border border-border-default"
              >
                <User class="w-6 h-6 text-text-secondary" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-bold">{{ driver.full_name }}</h3>
                    <p class="text-xs text-text-secondary">
                      {{ driver.vehicle?.brand }} {{ driver.vehicle?.model }} •
                      {{ driver.vehicle?.license_plate }}
                    </p>
                  </div>
                  <div class="text-right text-xs">
                    <span class="font-bold text-text-primary"
                      >Cap: {{ driver.vehicle?.max_weight }} kg</span
                    >
                  </div>
                </div>

                <div
                  v-if="
                    selectedOrder &&
                    driver.vehicle &&
                    selectedOrder.weight > driver.vehicle.max_weight
                  "
                  class="mt-2 flex items-center gap-1 text-red-500 text-xs font-bold"
                >
                  <AlertCircle class="w-3 h-3" />
                  Order too heavy for this vehicle
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="selectedDriver"
            class="mt-8 p-6 bg-bg-canvas border border-border-default rounded-lg shadow-sm"
          >
            <h3 class="font-bold mb-4 uppercase text-xs tracking-wider text-text-secondary">
              Assignment Summary
            </h3>
            <div class="flex items-center gap-4 mb-6">
              <div class="flex-1 p-3 bg-bg-surface rounded border border-border-default text-sm">
                <div class="text-xs text-text-secondary mb-1">Order</div>
                <div class="font-bold">{{ selectedOrder.title }}</div>
              </div>
              <ChevronRight class="w-4 h-4 text-text-placeholder" />
              <div class="flex-1 p-3 bg-bg-surface rounded border border-border-default text-sm">
                <div class="text-xs text-text-secondary mb-1">Driver</div>
                <div class="font-bold">{{ selectedDriver.full_name }}</div>
              </div>
            </div>

            <button
              @click="handleAssign"
              :disabled="!canAssign || isSubmitting || assignmentSuccess"
              class="w-full py-4 rounded font-bold flex items-center justify-center gap-2 transition-all"
              :class="[
                assignmentSuccess
                  ? 'bg-green-500 text-white'
                  : canAssign
                    ? 'bg-brand-primary hover:bg-btn-primary-hover text-white'
                    : 'bg-border-default text-text-placeholder cursor-not-allowed',
              ]"
            >
              <template v-if="isSubmitting">
                <div
                  class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></div>
                Assigning...
              </template>
              <template v-else-if="assignmentSuccess">
                <CheckCircle2 class="w-5 h-5" />
                Successfully Assigned!
              </template>
              <template v-else> Confirm Assignment </template>
            </button>
            <p v-if="!canAssign" class="text-center text-red-500 text-xs mt-3 font-bold">
              Weight limit exceeded. Please select another driver.
            </p>
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
