<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { invoicesApi } from '@/api/invoices'
import type { Invoice } from '@/types/invoice'
import { Loader2, AlertCircle } from 'lucide-vue-next'
import { getErrorMessage } from '@/utils/errorHandler'
import MonthlyExpensesChart from '@/components/dashboard/MonthlyExpensesChart.vue'

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
  <div class="p-4 md:p-8 w-full max-w-7xl mx-auto font-roboto text-text-primary">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-[32px] font-bold">Billings & Reports</h1>
        <p class="text-text-secondary">Control your budget and view logistics reports</p>
      </div>
    </div>

    <div
      v-if="error"
      class="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2"
    >
      <AlertCircle class="w-5 h-5" />
      {{ error }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <div class="lg:col-span-2">
        <MonthlyExpensesChart />
      </div>
      <div class="bg-bg-canvas border border-border-default rounded-lg p-6">
        <h3 class="text-lg font-bold mb-4">Financial Summary</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center pb-4 border-b border-border-default">
            <span class="text-text-secondary">Total Invoices</span>
            <span class="font-bold">{{ invoices.length }}</span>
          </div>
          <div class="flex justify-between items-center pb-4 border-b border-border-default">
            <span class="text-text-secondary">Current Period</span>
            <span class="font-bold text-brand-primary">{{
              new Date().toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })
            }}</span>
          </div>
          <div class="pt-2">
            <p class="text-xs text-text-placeholder">
              Expenses are calculated based on completed deliveries for the selected period.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Invoice History</h2>
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
        class="flex flex-col items-center justify-center py-20 bg-bg-canvas rounded-xl border border-border-default"
      >
        <Loader2 class="w-10 h-10 text-brand-primary animate-spin mb-4" />
        <p class="text-text-secondary font-medium">Loading your invoices...</p>
      </div>

      <div
        v-else-if="invoices.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-bg-canvas rounded-xl border border-border-default"
      >
        <p class="text-text-secondary font-medium">No invoices found for your account.</p>
      </div>

      <div v-else class="bg-bg-canvas border border-border-default rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-bg-surface border-b border-border-default">
                <th
                  class="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider"
                >
                  Billing Period
                </th>
                <th
                  class="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider"
                >
                  Shipments
                </th>
                <th
                  class="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider"
                >
                  Total Weight
                </th>
                <th
                  class="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider"
                >
                  Generated At
                </th>
                <th
                  class="py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider text-right"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border-default">
              <tr
                v-for="invoice in invoices"
                :key="invoice.id"
                class="hover:bg-bg-surface transition-colors cursor-pointer group"
              >
                <td class="py-4 px-6 text-sm text-text-primary font-medium">
                  #INV-{{ String(invoice.id).padStart(3, '0') }}
                </td>
                <td class="py-4 px-6 text-sm text-text-secondary capitalize">
                  {{ formatMonth(invoice.billing_month) }}
                </td>
                <td class="py-4 px-6 text-sm text-text-secondary">{{ invoice.total_shipment }}</td>
                <td class="py-4 px-6 text-sm text-text-secondary">{{ invoice.total_weight }} kg</td>
                <td class="py-4 px-6 text-sm text-text-secondary">
                  {{ formatDate(invoice.generated_at) }}
                </td>
                <td class="py-4 px-6 text-right">
                  <button
                    class="bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-brand-primary hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
