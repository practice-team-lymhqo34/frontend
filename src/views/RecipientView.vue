<script setup lang="ts">
import { ref } from 'vue'

const invoices = ref([
  {
    id: '#INV-001',
    date: '01 Mar 2026',
    amount: '4,500 UAH',
    status: 'Paid',
  },
  {
    id: '#INV-002',
    date: '01 Mar 2026',
    amount: '4,500 UAH',
    status: 'Pending',
  },
  {
    id: '#INV-003',
    date: '01 Mar 2026',
    amount: '4,500 UAH',
    status: 'Paid',
  },
])

const getStatusClasses = (status: string) => {
  if (status === 'Paid') return 'bg-green-100 text-green-600'
  if (status === 'Pending') return 'bg-orange-50 text-orange-500'
  return 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <div class="p-8 w-full max-w-7xl mx-auto font-roboto text-[#333333]">
    <h1 class="text-[32px] font-bold mb-8">Billing Dashboard</h1>

    <div class="mb-8">
      <h2 class="text-lg font-bold text-gray-700 mb-1">TOTAL SPENT (MARCH): 12,450 UAH</h2>
      <p class="text-gray-500 text-sm">Active Deliveries: 4</p>
      <p class="text-gray-500 text-sm">
        Unpaid Invoices: <span class="text-red-500 font-medium">1</span>
      </p>
    </div>

    <div class="mb-12">
      <h2 class="text-[28px] font-bold mb-6">Monthly Expenses (UAH)</h2>

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
          <circle cx="160" cy="230" r="4" fill="white" stroke="#1E73BE" stroke-width="2" />
          <circle cx="250" cy="280" r="4" fill="white" stroke="#1E73BE" stroke-width="2" />
          <circle cx="410" cy="190" r="4" fill="white" stroke="#1E73BE" stroke-width="2" />
        </svg>
      </div>
    </div>

    <div class="w-full">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="py-4 px-2 text-sm font-bold text-gray-600">Invoice ID</th>
            <th class="py-4 px-2 text-sm font-bold text-gray-600">Date</th>
            <th class="py-4 px-2 text-sm font-bold text-gray-600">Amount</th>
            <th class="py-4 px-2 text-sm font-bold text-gray-600">Status</th>
            <th class="py-4 px-2 text-sm font-bold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="invoice in invoices"
            :key="invoice.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="py-4 px-2 text-sm text-gray-700">{{ invoice.id }}</td>
            <td class="py-4 px-2 text-sm text-gray-600">{{ invoice.date }}</td>
            <td class="py-4 px-2 text-sm text-gray-600">{{ invoice.amount }}</td>
            <td class="py-4 px-2">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="getStatusClasses(invoice.status)"
              >
                {{ invoice.status }}
              </span>
            </td>
            <td class="py-4 px-2">
              <button
                class="bg-[#F0F5FA] text-[#083672] px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                Download PDF
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
