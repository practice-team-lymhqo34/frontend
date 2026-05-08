<script setup lang="ts">
import { ref } from 'vue'
import { User } from 'lucide-vue-next'
import type { Route, User as UserType } from '@/types'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import apiClient from '@/api/axios'

const props = defineProps<{
  route: Route
  assignedDriver: UserType | null
}>()

const emit = defineEmits<{
  driverAssigned: [driverId: number]
}>()

// TODO: замінити на apiClient.get('/users?role=driver') коли бекенд готовий
const mockDriverOptions = [
  { value: '401', label: 'Ivan Petrenko' },
  { value: '402', label: 'Oleh Kovalenko' },
  { value: '403', label: 'Dmytro Shevchenko' },
]

const selectedDriverId = ref<string>(props.route.driver_id ? String(props.route.driver_id) : '')

const handleAssign = async (driverId: string | undefined) => {
  if (!driverId) return

  try {
    await apiClient.patch(`/dashboard/routes/${props.route.id}`, {
      driver_id: Number(driverId),
    })
    selectedDriverId.value = driverId
    emit('driverAssigned', Number(driverId))
  } catch (error) {
    console.error('Помилка призначення драйвера:', error)
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-6 h-6 rounded-full bg-bg-surface flex items-center justify-center flex-shrink-0">
      <User class="w-3 h-3 text-text-secondary" />
    </div>

    <span v-if="assignedDriver" class="text-text-primary text-sm">
      {{ assignedDriver.full_name }}
      <span class="text-text-secondary text-xs">(ID: {{ assignedDriver.id }})</span>
    </span>

    <BaseSelect
      v-model="selectedDriverId"
      label=""
      :options="mockDriverOptions"
      @update:model-value="handleAssign"
    />
  </div>
</template>
