<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { invoicesApi } from '@/api/invoices'
import type { Invoice } from '@/types/invoice'
import { Loader2, AlertCircle } from 'lucide-vue-next'
import { getErrorMessage } from '@/utils/errorHandler'

const invoices = ref<Invoice[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const fetchInvoices = async () => {
  isLoading.value = true
  error.value = null
  try {
    invoices.value = await invoicesApi.getInvoices()
  } catch (err) {
    console.error('Failed to fetch invoices:', err)
    error.value = getErrorMessage(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchInvoices()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatMonth = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="p-8 w-full max-w-7xl mx-auto font-roboto text-[#333333]">
    <h1 class="text-[32px] font-bold mb-8">Billing Dashboard</h1>

    <div
      v-if="error"
      class="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2"
    >
      <AlertCircle class="w-5 h-5" />
      {{ error }}
    </div>

    <div class="mb-8">
      <h2 class="text-lg font-bold text-gray-700 mb-1 uppercase tracking-tight">
        Financial Overview
      </h2>
      <p class="text-gray-500 text-sm">Review your monthly logistics expenses and invoices.</p>
    </div>

    <div class="mb-12">
      <h2 class="text-[28px] font-bold mb-6">Monthly Expenses (Mock Data)</h2>

      <div class="relative w-full h-[350px] border-l border-b border-gray-200">
        <div class="absolute inset-0 flex flex-col justify-between">
          <div v-for="i in 13" :key="i" class="border-b border-blue-100 w-full h-0"></div>
        </div>

        <div
          class="absolute -left-10 top-0 h-full flex flex-col justify-between text-xs text-gray-400 text-right pr-2"
        >
          <span>1200</span><span>1100</span><span>1000</span><span>900</span> <span>800</span
          ><span>700</span><span>600</span><span>500</span> <span>400</span><span>300</span
          ><span>200</span><span>100</span><span>0</span>
        </div>

        <div class="absolute -bottom-6 w-full flex justify-between text-xs text-gray-500 px-4">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span> <span>May</span
          ><span>Jun</span><span>Jul</span><span>Aug</span> <span>Sep</span><span>Oct</span
          ><span>Nov</span><span>Dec</span>
        </div>

        <svg
          class="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1000 350"
        >
          <path
            d="M 0 300 L 80 260 L 160 210 L 250 240 L 330 220 L 410 160 L 500 160 L 580 200 L 660 180 L 750 90 L 830 110 L 910 80 L 1000 150"
            fill="none"
            stroke="#D0E3F5"
            stroke-width="2"
          />
          <path
            d="M 0 320 L 80 290 L 160 230 L 250 280 L 330 270 L 410 190 L 500 190 L 580 230 L 660 210 L 750 110 L 830 140 L 910 170 L 1000 240"
            fill="none"
            stroke="#1E73BE"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>

    <div class="w-full">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Invoices</h2>
        <button
          @click="fetchInvoices"
          class="text-sm text-brand-primary hover:underline flex items-center gap-1"
          :disabled="isLoading"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          Refresh
        </button>
      </div>

      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200"
      >
        <Loader2 class="w-10 h-10 text-brand-primary animate-spin mb-4" />
        <p class="text-gray-500 font-medium">Loading your invoices...</p>
      </div>

      <div
        v-else-if="invoices.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200"
      >
        <p class="text-gray-500 font-medium">No invoices found for your account.</p>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="py-4 px-2 text-sm font-bold text-gray-600">ID</th>
            <th class="py-4 px-2 text-sm font-bold text-gray-600">Billing Period</th>
            <th class="py-4 px-2 text-sm font-bold text-gray-600">Shipments</th>
            <th class="py-4 px-2 text-sm font-bold text-gray-600">Total Weight</th>
            <th class="py-4 px-2 text-sm font-bold text-gray-600">Generated At</th>
            <th class="py-4 px-2 text-sm font-bold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="invoice in invoices"
            :key="invoice.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="py-4 px-2 text-sm text-gray-700 font-medium">
              #INV-{{ String(invoice.id).padStart(3, '0') }}
            </td>
            <td class="py-4 px-2 text-sm text-gray-600 capitalize">
              {{ formatMonth(invoice.billing_month) }}
            </td>
            <td class="py-4 px-2 text-sm text-gray-600">{{ invoice.total_shipment }}</td>
            <td class="py-4 px-2 text-sm text-gray-600">{{ invoice.total_weight }} kg</td>
            <td class="py-4 px-2 text-sm text-gray-600">{{ formatDate(invoice.generated_at) }}</td>
            <td class="py-4 px-2">
              <button
                class="bg-[#F0F5FA] text-[#083672] px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
