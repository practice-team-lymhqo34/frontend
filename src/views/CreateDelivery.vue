<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/axios'

const router = useRouter()
const isSubmitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  weight: null as number | null,
})

const submitOrder = async () => {
  isSubmitting.value = true

  try {
    const response = await apiClient.post('/orders/', form)
    console.log('Order created:', response.data)

    router.push('/dashboard') //todo router.push('/shipments')
  } catch (error) {
    console.error('Помилка при створенні замовлення:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-3xl text-[#333333] font-roboto">
    <div class="mb-8">
      <h1 class="text-[32px] font-bold mb-1">Create New Delivery</h1>
      <p class="text-gray-500">Basic order details</p>
    </div>

    <form @submit.prevent="submitOrder">
      <div class="bg-white p-6 border border-gray-200 mb-8">
        <h2 class="text-sm font-bold tracking-wider text-gray-700 mb-5">ORDER DETAILS</h2>

        <div class="space-y-5">
          <div>
            <label class="block text-xs text-gray-500 mb-1.5"
              >Delivery Title <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.title"
              type="text"
              placeholder="e.g. Electronics to Kyiv"
              class="w-full bg-[#F8F9FA] border-none rounded px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#083672] outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-xs text-gray-500 mb-1.5"
              >Weight (kg) <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.weight"
              type="number"
              step="0.1"
              min="0"
              placeholder="0.0"
              class="w-full bg-[#F8F9FA] border-none rounded px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#083672] outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-xs text-gray-500 mb-1.5">Description (Optional)</label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Any additional notes or details about the shipment..."
              class="w-full bg-[#F8F9FA] border-none rounded px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#083672] outline-none resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          type="button"
          @click="$router.back()"
          class="flex-1 flex justify-center items-center gap-2 border border-[#1E73BE] text-[#1E73BE] bg-white rounded py-3 font-semibold hover:bg-blue-50 transition-colors"
        >
          <span class="text-lg leading-none">✕</span> Cancel
        </button>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex-1 flex justify-center items-center gap-2 bg-[#1E73BE] text-white rounded py-3 font-semibold hover:bg-[#083672] disabled:bg-blue-300 transition-colors"
        >
          <span class="text-lg leading-none">📦</span>
          {{ isSubmitting ? 'Creating...' : 'Create Shipment' }}
        </button>
      </div>
    </form>
  </div>
</template>
