<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { getMonthlyExpenses } from '@/api/statistics'
import type { MonthlyExpensePoint } from '@/types/statistics'
import { Loader2 } from 'lucide-vue-next'
import type { ApexOptions } from 'apexcharts'

const loading = ref(true)
const expensesData = ref<MonthlyExpensePoint[]>([])
const totalAmount = ref(0)
const period = ref('')

const fetchChartData = async () => {
  try {
    loading.value = true
    const response = await getMonthlyExpenses()
    expensesData.value = response.data
    totalAmount.value = response.total_amount
    period.value = response.period
  } catch (error) {
    console.error('Failed to fetch expenses:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchChartData()
})

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100],
    },
  },
  xaxis: {
    type: 'datetime',
    categories: expensesData.value.map((p) => p.date),
    labels: {
      style: { colors: '#9ca3af' },
    },
  },
  yaxis: {
    labels: {
      style: { colors: '#9ca3af' },
      formatter: (val: number) => `$${val.toLocaleString()}`,
    },
  },
  tooltip: {
    x: { format: 'dd MMM yyyy' },
    y: {
      formatter: (val: number) => `$${val.toLocaleString()}`,
    },
  },
  colors: ['#3b82f6'],
  grid: {
    borderColor: '#374151',
    strokeDashArray: 4,
  },
}))

const series = computed(() => [
  {
    name: 'Expenses',
    data: expensesData.value.map((p) => p.amount),
  },
])

const isEmpty = computed(() => !loading.value && expensesData.value.length === 0)
</script>

<template>
  <div
    class="relative min-h-[300px] w-full bg-bg-canvas p-4 rounded-lg border border-border-default"
  >
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-text-primary">Monthly Expenses</h3>
        <p class="text-sm text-text-placeholder">{{ period || 'Current period' }}</p>
      </div>
      <div v-if="!loading" class="text-right">
        <p class="text-2xl font-bold text-text-primary">${{ totalAmount.toLocaleString() }}</p>
        <p class="text-xs text-text-placeholder">Total spent</p>
      </div>
    </div>

    <div
      v-if="loading"
      class="absolute inset-0 flex flex-col items-center justify-center bg-bg-canvas/50 z-10"
    >
      <Loader2 class="w-8 h-8 animate-spin text-primary mb-2" />
      <span class="text-text-placeholder">Loading statistics...</span>
    </div>

    <div v-else-if="isEmpty" class="flex flex-col items-center justify-center py-12">
      <div class="w-16 h-16 bg-bg-surface rounded-full flex items-center justify-center mb-4">
        <Loader2 class="w-8 h-8 text-text-placeholder" />
      </div>
      <p class="text-text-primary font-medium">No data available</p>
      <p class="text-sm text-text-placeholder">
        There are no completed trips or expenses for this month.
      </p>
    </div>

    <div v-else>
      <VueApexCharts height="250" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>
