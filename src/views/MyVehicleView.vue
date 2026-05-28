<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import { Truck, AlertCircle, Save, Loader2, Gauge, Fuel, Wrench, Trash2 } from 'lucide-vue-next'
import { vehiclesApi } from '@/api/vehicles'
import type { VehicleCreate, Vehicle } from '@/types/vehicle'
import { getErrorMessage } from '@/utils/errorHandler'

import BaseModal from '@/components/ui/BaseModal.vue'

const authStore = useAuthStore()

const isEditing = computed(() => !!authStore.user?.vehicle?.id)

const vehicleForm = ref<VehicleCreate>({
  brand: '',
  model: '',
  license_plate: '',
  max_weight: 0,
  max_volume: 0,
  fuel_consumption: 0,
  current_mileage: 0,
  maintenance_interval: 10000,
})

const isSaving = ref(false)
const isDeleting = ref(false)
const isLoading = ref(true)
const error = ref('')
const successMessage = ref('')
const isDeleteModalOpen = ref(false)

const fetchVehicle = async () => {
  isLoading.value = true
  try {
    if (authStore.user?.vehicle) {
      populateForm(authStore.user.vehicle)
    } else {
      const vehicles = await vehiclesApi.getMyVehicles()
      if (vehicles.length > 0) {
        const v = vehicles[0]
        if (v) {
          populateForm(v)
          if (authStore.user) {
            authStore.user.vehicle = v
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch vehicle:', err)
  } finally {
    isLoading.value = false
  }
}

const populateForm = (v: Vehicle) => {
  vehicleForm.value = {
    brand: v.brand,
    model: v.model,
    license_plate: v.license_plate,
    max_weight: v.max_weight,
    max_volume: v.max_volume,
    fuel_consumption: v.fuel_consumption,
    current_mileage: v.current_mileage,
    maintenance_interval: v.maintenance_interval,
  }
}

onMounted(fetchVehicle)

const resetForm = () => {
  vehicleForm.value = {
    brand: '',
    model: '',
    license_plate: '',
    max_weight: 0,
    max_volume: 0,
    fuel_consumption: 0,
    current_mileage: 0,
    maintenance_interval: 10000,
  }
}

const saveVehicle = async () => {
  error.value = ''
  successMessage.value = ''

  if (
    vehicleForm.value.fuel_consumption <= 0 ||
    vehicleForm.value.current_mileage < 0 ||
    vehicleForm.value.max_weight <= 0 ||
    vehicleForm.value.max_volume <= 0 ||
    vehicleForm.value.maintenance_interval <= 0
  ) {
    error.value =
      'Please check the number format. Weight, volume, consumption and interval must be greater than 0.'
    return
  }

  isSaving.value = true

  try {
    let updatedVehicle
    if (authStore.user?.vehicle?.id) {
      updatedVehicle = await vehiclesApi.updateVehicle(authStore.user.vehicle.id, {
        fuel_consumption: vehicleForm.value.fuel_consumption,
        current_mileage: vehicleForm.value.current_mileage,
        maintenance_interval: vehicleForm.value.maintenance_interval,
      })
    } else {
      updatedVehicle = await vehiclesApi.createVehicle(vehicleForm.value)
    }

    if (authStore.user) {
      const updatedUser = { ...authStore.user, vehicle: updatedVehicle }
      authStore.setUser(updatedUser)
    }

    successMessage.value = 'Vehicle data saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = getErrorMessage(err)
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = () => {
  isDeleteModalOpen.value = true
}

const deleteVehicle = async () => {
  if (!authStore.user?.vehicle?.id) return

  isDeleting.value = true
  error.value = ''

  try {
    await vehiclesApi.deleteVehicle(authStore.user.vehicle.id)

    if (authStore.user) {
      const updatedUser = { ...authStore.user, vehicle: undefined }
      authStore.setUser(updatedUser)
    }

    resetForm()
    isDeleteModalOpen.value = false
    successMessage.value = 'Vehicle removed successfully. You can now add a new one.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = getErrorMessage(err)
    isDeleteModalOpen.value = false
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="p-4 md:p-8 w-full font-roboto text-text-primary">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-brand-primary/10 rounded-lg text-brand-primary shrink-0">
          <Truck class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-2xl md:text-[32px] font-bold leading-tight">My Vehicle</h1>
          <p class="text-text-secondary">Manage your vehicle details and maintenance schedules.</p>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-brand-primary" />
    </div>

    <div v-else class="grid grid-cols-1 gap-8">
      <section class="bg-bg-canvas border border-border-default rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">Vehicle Specifications</h2>

        <form @submit.prevent="saveVehicle" class="space-y-6">
          <div
            v-if="error"
            class="p-3 bg-red-50 border border-red-200 text-red-600 rounded flex items-center gap-2"
          >
            <AlertCircle class="w-5 h-5" />
            {{ error }}
          </div>

          <div
            v-if="successMessage"
            class="p-3 bg-green-50 border border-green-200 text-green-600 rounded flex items-center gap-2"
          >
            <Save class="w-5 h-5" />
            {{ successMessage }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-sm font-bold text-text-secondary uppercase tracking-wider"
                >Brand</label
              >
              <input
                v-model="vehicleForm.brand"
                type="text"
                required
                :disabled="isEditing"
                class="w-full px-4 py-3 bg-bg-surface border border-border-default rounded focus:outline-none focus:border-brand-primary disabled:opacity-70 disabled:bg-gray-50"
                placeholder="e.g. Mercedes-Benz"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-bold text-text-secondary uppercase tracking-wider"
                >Model</label
              >
              <input
                v-model="vehicleForm.model"
                type="text"
                required
                :disabled="isEditing"
                class="w-full px-4 py-3 bg-bg-surface border border-border-default rounded focus:outline-none focus:border-brand-primary disabled:opacity-70 disabled:bg-gray-50"
                placeholder="e.g. Sprinter"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-bold text-text-secondary uppercase tracking-wider"
                >License Plate</label
              >
              <input
                v-model="vehicleForm.license_plate"
                type="text"
                required
                maxlength="8"
                :disabled="isEditing"
                class="w-full px-4 py-3 bg-bg-surface border border-border-default rounded focus:outline-none focus:border-brand-primary disabled:opacity-70 disabled:bg-gray-50"
                placeholder="AA1234BP"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-bold text-text-secondary uppercase tracking-wider"
                >Max Weight (kg)</label
              >
              <input
                v-model.number="vehicleForm.max_weight"
                type="number"
                required
                min="1"
                :disabled="isEditing"
                class="w-full px-4 py-3 bg-bg-surface border border-border-default rounded focus:outline-none focus:border-brand-primary disabled:opacity-70 disabled:bg-gray-50"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-bold text-text-secondary uppercase tracking-wider"
                >Max Volume (m³)</label
              >
              <input
                v-model.number="vehicleForm.max_volume"
                type="number"
                required
                min="0.1"
                step="0.1"
                :disabled="isEditing"
                class="w-full px-4 py-3 bg-bg-surface border border-border-default rounded focus:outline-none focus:border-brand-primary disabled:opacity-70 disabled:bg-gray-50"
              />
            </div>

            <div class="space-y-1">
              <label
                class="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2"
              >
                <Fuel class="w-4 h-4 text-brand-primary" /> Fuel Consumption (l/100km)
              </label>
              <input
                v-model.number="vehicleForm.fuel_consumption"
                type="number"
                required
                step="0.1"
                :class="[
                  'w-full px-4 py-3 bg-bg-surface border rounded focus:outline-none focus:border-brand-primary',
                  vehicleForm.fuel_consumption < 0 ? 'border-red-500' : 'border-border-default',
                ]"
              />
            </div>

            <div class="space-y-1">
              <label
                class="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2"
              >
                <Gauge class="w-4 h-4 text-brand-primary" /> Current Mileage (km)
              </label>
              <input
                v-model.number="vehicleForm.current_mileage"
                type="number"
                required
                min="0"
                :class="[
                  'w-full px-4 py-3 bg-bg-surface border rounded focus:outline-none focus:border-brand-primary',
                  vehicleForm.current_mileage < 0 ? 'border-red-500' : 'border-border-default',
                ]"
              />
            </div>

            <div class="space-y-1 md:col-span-2">
              <label
                class="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2"
              >
                <Wrench class="w-4 h-4 text-brand-primary" /> Maintenance Interval (km)
              </label>
              <input
                v-model.number="vehicleForm.maintenance_interval"
                type="number"
                required
                min="1000"
                class="w-full px-4 py-3 bg-bg-surface border border-border-default rounded focus:outline-none focus:border-brand-primary"
              />
              <p class="text-xs text-text-secondary mt-1">
                The system will remind you of maintenance when the mileage reaches this value.
              </p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row justify-end gap-3 pt-4">
            <BaseButton
              v-if="isEditing"
              type="button"
              variant="secondary"
              @click="confirmDelete"
              :disabled="isDeleting || isSaving"
              class="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Loader2 v-if="isDeleting" class="w-4 h-4 mr-2 animate-spin" />
              <Trash2 v-else class="w-4 h-4 mr-2" />
              Remove Vehicle
            </BaseButton>

            <BaseButton type="submit" class="px-8 py-3" :disabled="isSaving || isDeleting">
              <Loader2 v-if="isSaving" class="w-4 h-4 mr-2 animate-spin" />
              <Save v-else class="w-4 h-4 mr-2" />
              {{ isEditing ? 'Update Settings' : 'Add Vehicle' }}
            </BaseButton>
          </div>
        </form>
      </section>

      <div v-if="isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-8"></div>
    </div>

    <BaseModal
      :show="isDeleteModalOpen"
      title="Remove Vehicle"
      confirm-text="Yes, Remove Vehicle"
      cancel-text="Cancel"
      variant="danger"
      @confirm="deleteVehicle"
      @cancel="isDeleteModalOpen = false"
    >
      <div class="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
        <AlertCircle class="w-5 h-5 text-red-600 mt-0.5" />
        <p class="text-sm text-red-700">
          Are you sure you want to remove this vehicle? This action will permanently delete all
          associated mileage and consumption history.
        </p>
      </div>
    </BaseModal>
  </div>
</template>
