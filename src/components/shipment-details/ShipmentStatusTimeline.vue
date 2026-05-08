<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import type { Route, RouteStatusEnum } from '@/types'

type StepState = 'completed' | 'current' | 'pending'

interface TimelineStep {
  label: string
  statusKey: RouteStatusEnum
  state: StepState
}

const props = defineProps<{
  route: Route
}>()

const allSteps: { label: string; statusKey: RouteStatusEnum }[] = [
  { label: 'Assigned to Driver', statusKey: 'assigned' },
  { label: 'Loaded', statusKey: 'loaded' },
  { label: 'In Transit', statusKey: 'in_transit' },
  { label: 'Delivered', statusKey: 'delivered' },
]

const steps = computed<TimelineStep[]>(() => {
  const completedStatuses = new Set((props.route.statuses ?? []).map((s) => s.status))

  const lastCompleted = [...allSteps].reverse().find((s) => completedStatuses.has(s.statusKey))

  return allSteps.map((step) => {
    if (completedStatuses.has(step.statusKey) && step.statusKey !== lastCompleted?.statusKey) {
      return { ...step, state: 'completed' }
    }
    if (step.statusKey === lastCompleted?.statusKey) {
      return { ...step, state: 'current' }
    }
    return { ...step, state: 'pending' }
  })
})
</script>

<template>
  <div class="bg-bg-canvas border border-border-default p-6">
    <h2 class="text-xs font-bold tracking-wider text-text-secondary mb-4">STATUS</h2>

    <div class="flex flex-col gap-4">
      <div v-for="(step, index) in steps" :key="index" class="flex items-start gap-3">
        <div
          class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          :class="{
            'bg-status-delivered': step.state === 'completed',
            'bg-status-pending': step.state === 'current',
            'border-2 border-border-default bg-bg-canvas': step.state === 'pending',
          }"
        >
          <Check v-if="step.state === 'completed'" class="w-3 h-3 text-white" />
        </div>

        <span
          class="text-sm"
          :class="{
            'text-text-primary font-medium': step.state !== 'pending',
            'text-text-placeholder': step.state === 'pending',
          }"
        >
          {{ step.label }}
        </span>
      </div>
    </div>
  </div>
</template>
