<script setup lang="ts">
import { Wrench, AlertCircle } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notifications'
import { formatAlertDate } from '@/utils/date'

defineProps<{
  currentMileage: number
  maintenanceInterval: number
}>()

const notificationStore = useNotificationStore()
</script>

<template>
  <section class="bg-bg-canvas border border-border-default rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
      <Wrench class="w-5 h-5 text-brand-primary" /> Maintenance & Alerts
    </h2>

    <div class="space-y-6">
      <div>
        <div class="flex items-center justify-between mb-2">
          <p class="text-text-secondary text-xs font-bold uppercase tracking-wider">
            Mileage to Maintenance
          </p>
          <span
            class="text-sm font-bold"
            :class="currentMileage >= maintenanceInterval ? 'text-red-600' : 'text-brand-primary'"
          >
            <template v-if="currentMileage >= maintenanceInterval">
              Maintenance Overdue! ({{ currentMileage - maintenanceInterval }} km)
            </template>
            <template v-else> {{ maintenanceInterval - currentMileage }} km left </template>
          </span>
        </div>

        <div
          class="w-full bg-bg-surface h-3 rounded-full overflow-hidden border border-border-default"
        >
          <div
            class="h-full transition-all duration-500"
            :style="{
              width: Math.min(100, (currentMileage / maintenanceInterval) * 100) + '%',
            }"
            :class="
              currentMileage / maintenanceInterval >= 1
                ? 'bg-red-600'
                : currentMileage / maintenanceInterval >= 0.9
                  ? 'bg-orange-500'
                  : 'bg-brand-primary'
            "
          ></div>
        </div>
      </div>

      <div class="pt-4 border-t border-border-default">
        <div class="flex items-center justify-between mb-3">
          <p class="text-text-secondary text-xs font-bold uppercase tracking-wider">
            Recent Alerts
          </p>
          <span
            v-if="notificationStore.maintenanceAlerts.length"
            class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
          >
            {{ notificationStore.maintenanceAlerts.length }}
          </span>
        </div>

        <div class="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
          <div
            v-for="alert in notificationStore.maintenanceAlerts"
            :key="alert.id"
            class="p-3 bg-red-50 border border-red-100 rounded flex justify-between items-center gap-3 transition-all"
          >
            <div class="space-y-0.5">
              <p class="text-xs font-bold text-red-900 leading-tight">
                {{ alert.message }}
              </p>
              <p class="text-[9px] text-red-700/60 uppercase font-medium">
                {{ formatAlertDate(alert.created_at) }}
              </p>
            </div>
            <button
              @click="notificationStore.markAsRead(alert.id)"
              class="shrink-0 text-[9px] font-black text-red-700 hover:text-red-900 bg-red-100 px-2 py-1 rounded border border-red-200 uppercase tracking-tighter"
            >
              Mark read
            </button>
          </div>

          <div
            v-if="!notificationStore.maintenanceAlerts.length"
            class="flex items-center gap-3 p-3 bg-bg-surface rounded text-sm text-text-secondary"
          >
            <AlertCircle class="w-4 h-4" />
            No active maintenance alerts
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
