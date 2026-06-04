<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Order, Route, User } from '@/types'
import ShipmentDriverSelect from '@/components/shipment-details/ShipmentDriverSelect.vue'
import { MapPin, Weight, User as UserIcon, Banknote, Check, Edit2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api/axios'

const props = defineProps<{
  order: Order
  route?: Route | null
  assignedDriver: User | null
  readOnly?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()

const authStore = useAuthStore()
const isEditingAmount = ref(false)
const newAmount = ref(props.order.total_amount)

watch(
  () => props.order.total_amount,
  (val) => {
    newAmount.value = val
  },
)

const updateAmount = async () => {
  try {
    await apiClient.patch(`/dashboard/orders/${props.order.id}`, {
      total_amount: newAmount.value,
    })
    isEditingAmount.value = false
    emit('refresh')
  } catch (err) {
    console.error('Failed to update amount:', err)
  }
}

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
  <div class="space-y-6">
    <!-- Manager Billing Control - Big & Clear -->
    <div
      v-if="authStore.isManager"
      class="bg-white border-2 border-brand-primary rounded-xl p-6 shadow-sm"
    >
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-brand-primary/10 rounded-lg">
          <Banknote class="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h3 class="text-sm font-black text-text-primary uppercase tracking-wider">
            Billing & Pricing
          </h3>
          <p class="text-xs text-text-secondary">Manage and confirm shipment cost</p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div v-if="!isEditingAmount" class="flex flex-col">
          <span class="text-3xl font-black text-text-primary">
            ₴{{ (order.total_amount || 0).toLocaleString() }}
          </span>
          <span class="text-[10px] text-text-placeholder font-bold uppercase tracking-widest mt-1">
            Current Final Price
          </span>
        </div>

        <div v-else class="flex flex-col w-full md:w-auto gap-2">
          <label class="text-[10px] font-bold text-text-secondary uppercase">Set New Amount</label>
          <div class="flex items-center gap-2">
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder text-sm"
                >₴</span
              >
              <input
                v-model.number="newAmount"
                type="number"
                class="pl-7 pr-4 py-2 bg-bg-surface border border-border-default rounded-lg focus:outline-none focus:border-brand-primary w-full md:w-40 font-bold"
              />
            </div>
            <button
              @click="updateAmount"
              class="bg-brand-primary text-white p-2 rounded-lg hover:bg-brand-dark transition-colors"
            >
              <Check class="w-5 h-5" />
            </button>
            <button
              @click="isEditingAmount = false"
              class="bg-bg-surface text-text-secondary p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          v-if="!isEditingAmount"
          @click="isEditingAmount = true"
          class="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg font-bold text-sm hover:bg-brand-dark shadow-md transition-all active:scale-95"
        >
          <Edit2 class="w-4 h-4" />
          Adjust Final Price
        </button>
      </div>

      <div class="mt-4 pt-4 border-t border-border-default flex items-center gap-2 text-xs">
        <span class="text-text-placeholder">Based on weight:</span>
        <span class="font-bold text-text-secondary">{{ order.weight }} kg</span>
        <span class="text-text-placeholder ml-2">Initial Estimate:</span>
        <span class="font-bold text-text-secondary"
          >₴{{ (order.weight * 45).toLocaleString() }}</span
        >
      </div>
    </div>

    <div class="bg-bg-canvas border border-border-default rounded-lg overflow-hidden">
      <h2 class="text-xs font-bold tracking-wider text-text-secondary px-6 py-4 uppercase">
        Package Information
      </h2>

      <div class="divide-y divide-border-default">
        <!-- Amount Row (For Clients) -->
        <div
          v-if="!authStore.isManager"
          class="grid grid-cols-2 items-center px-6 py-5 bg-brand-primary/5"
        >
          <div class="flex items-center gap-2 text-brand-primary">
            <Banknote class="w-4 h-4" />
            <span class="text-sm font-bold uppercase tracking-wider">Total Amount</span>
          </div>
          <div>
            <span class="text-xl font-black text-text-primary">
              ₴{{ (order.total_amount || 0).toLocaleString() }}
            </span>
            <p class="text-[9px] text-text-placeholder font-bold uppercase mt-0.5">
              Final Billing Price
            </p>
          </div>
        </div>

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
              <span class="text-sm font-bold text-text-primary">{{
                assignedDriver.full_name
              }}</span>
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
  </div>
</template>
