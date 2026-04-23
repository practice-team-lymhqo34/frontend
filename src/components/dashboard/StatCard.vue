<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string | number
  trend: number
}>()

const isPositive = computed(() => props.trend > 0)
const trendFormatted = computed(() => {
  const sign = isPositive.value ? '+' : ''
  return `${sign}${props.trend}%`
})
</script>

<template>
  <div class="bg-bg-canvas border border-border-default rounded-lg p-4 flex flex-col gap-2">
    <div class="text-text-secondary text-xs font-medium">{{ title }}</div>
    <div class="flex items-end justify-between">
      <div class="text-2xl font-bold text-text-primary">{{ value }}</div>
      <div
        class="px-2 py-0.5 rounded text-xs font-medium"
        :class="
          isPositive
            ? 'bg-status-delivered-bg text-status-delivered'
            : 'bg-status-delayed-bg text-status-delayed'
        "
      >
        {{ trendFormatted }}
      </div>
    </div>
  </div>
</template>
