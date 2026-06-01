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

const TARIFF_PER_KG = 45 // Virtual tariff: 45 UAH per kg

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '60%',
      distributed: false,
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    type: 'datetime',
    categories: expensesData.value.map((p) => p.month),
    labels: {
      style: { colors: '#9ca3af' },
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MMM',
        day: 'dd',
        hour: 'HH:mm',
      },
    },
    tickAmount: 10, // Ensure spread across the month
  },
  yaxis: {
    labels: {
      style: { colors: '#9ca3af' },
      formatter: (val: number) => `₴${val.toLocaleString()}`,
    },
  },
  tooltip: {
    x: { format: 'dd MMM yyyy' },
    y: {
      formatter: (val: number) => `₴${val.toLocaleString()}`,
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
    name: 'Total Expenses',
    data: expensesData.value.map((p) => p.total_weight * TARIFF_PER_KG),
  },
])

const totalExpenses = computed(() => totalAmount.value * TARIFF_PER_KG)

const isEmpty = computed(() => !loading.value && expensesData.value.length === 0)
</script>

<template>
  <div
    class="relative min-h-[350px] w-full bg-bg-canvas p-6 rounded-xl border border-border-default shadow-sm"
  >
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-xl font-bold text-text-primary">Monthly Expenses Breakdown</h3>
        <p class="text-sm text-text-secondary">{{ period || 'Current billing period' }}</p>
      </div>
      <div v-if="!loading && !isEmpty" class="text-right">
        <p class="text-3xl font-black text-primary">₴{{ totalExpenses.toLocaleString() }}</p>
        <p class="text-xs text-text-placeholder uppercase tracking-widest font-bold">Total Spent</p>
      </div>
    </div>

    <div
      v-if="loading"
      class="absolute inset-0 flex flex-col items-center justify-center bg-bg-canvas/50 z-10 rounded-xl"
    >
      <Loader2 class="w-10 h-10 animate-spin text-primary mb-4" />
      <span class="text-text-secondary font-medium">Aggregating report data...</span>
    </div>

    <div v-else-if="isEmpty" class="flex flex-col items-center justify-center py-16 text-center">
      <div
        class="w-24 h-24 bg-bg-surface rounded-full flex items-center justify-center mb-6 border border-border-default"
      >
        <svg
          class="w-12 h-12 text-text-placeholder"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-text-primary mb-2">У цьому періоді витрат не знайдено</h3>
      <p class="text-sm text-text-secondary max-w-xs mx-auto">
        Завершені доставки за обраний період відсутні. Дашборд оновиться автоматично після закриття
        рейсу.
      </p>
    </div>

    <div v-else>
      <VueApexCharts height="250" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>
