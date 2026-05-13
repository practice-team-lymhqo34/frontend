<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/axios'
import { ordersApi } from '@/api/orders'
import type { Order } from '@/types/order'
import axios from 'axios'
import { Package, X, Copy, ChevronDown } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'

interface OrderForm {
  title: string
  description: string
  weight: string
  volume: string
  quantity: string
  isTemplate: boolean
}

const STORAGE_KEY = 'order-form-draft'

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')
const templates = ref<Order[]>([])
const showTemplates = ref(false)

const errors = reactive({
  title: '',
  weight: '',
})

const savedDraft = localStorage.getItem(STORAGE_KEY)

const form = reactive<OrderForm>(
  savedDraft
    ? JSON.parse(savedDraft)
    : {
        title: '',
        description: '',
        weight: '',
        volume: '',
        quantity: '',
        isTemplate: false,
      },
)

onMounted(async () => {
  try {
    templates.value = await ordersApi.getTemplates()
  } catch (err) {
    console.error('Failed to load templates:', err)
  }
})

const applyTemplate = (template: Order) => {
  form.title = template.title
  form.description = template.description || ''
  form.weight = template.weight.toString()
  form.volume = ''
  form.quantity = ''
  form.isTemplate = true
  showTemplates.value = false
  // Clear errors when template is applied
  errors.title = ''
  errors.weight = ''
}

watch(
  () => form.title,
  () => {
    if (form.title) errors.title = ''
  },
)

watch(
  () => form.weight,
  () => {
    if (form.weight) errors.weight = ''
  },
)

watch(
  form,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true },
)

const submitOrder = async () => {
  // Clear previous errors
  errors.title = ''
  errors.weight = ''

  let hasError = false
  if (!form.title) {
    errors.title = 'Title is required'
    hasError = true
  }
  if (!form.weight) {
    errors.weight = 'Weight is required'
    hasError = true
  }

  if (hasError) {
    errorMessage.value = 'Please correct the highlighted errors.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // We send volume and quantity in the description since they aren't in the DB schema yet
    const enrichedDescription = `[Qty: ${form.quantity || 'N/A'}, Vol: ${form.volume || 'N/A'}] ${form.description || ''}`

    await apiClient.post('/orders/', {
      title: form.title,
      description: enrichedDescription,
      weight: parseFloat(form.weight),
      is_template: form.isTemplate,
    })
    localStorage.removeItem(STORAGE_KEY)
    router.push('/recipient/orders')
  } catch (err: unknown) {
    console.error('Помилка при створенні замовлення:', err)
    if (axios.isAxiosError(err)) {
      errorMessage.value =
        err.response?.data?.detail || 'An error occurred while creating the shipment.'
    } else {
      errorMessage.value = 'An unexpected error occurred.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-3xl text-primary font-roboto">
    <div class="mb-8 flex justify-between items-start">
      <div>
        <h1 class="text-[32px] font-bold mb-1">Create New Delivery</h1>
        <p class="text-gray-500">Specify details for your shipment</p>
      </div>

      <!-- Template Selector -->
      <div class="relative" v-if="templates.length > 0">
        <button
          @click="showTemplates = !showTemplates"
          type="button"
          class="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-default rounded hover:bg-gray-50 transition-colors text-sm font-bold"
        >
          <Copy class="w-4 h-4 text-brand-primary" />
          Use Template
          <ChevronDown
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-180': showTemplates }"
          />
        </button>

        <div
          v-if="showTemplates"
          class="absolute right-0 mt-2 w-64 bg-white border border-border-default rounded-lg shadow-xl z-50 py-2"
        >
          <div
            v-for="template in templates"
            :key="template.id"
            @click="applyTemplate(template)"
            class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 border-gray-100"
          >
            <div class="font-bold text-sm">{{ template.title }}</div>
            <div class="text-xs text-text-secondary">{{ template.weight }} kg</div>
          </div>
        </div>
      </div>
    </div>

    <form @submit.prevent="submitOrder">
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded"
      >
        {{ errorMessage }}
      </div>

      <div class="bg-bg-canvas p-6 border border-gray-200 mb-8">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-sm font-bold tracking-wider text-text-secondary uppercase">
            DELIVERY DETAILS
          </h2>
          <span class="text-[10px] text-text-placeholder font-bold">* REQUIRED FIELDS</span>
        </div>

        <div class="space-y-6">
          <BaseInput
            v-model="form.title"
            label="Delivery Title *"
            placeholder="e.g. Weekly Electronics Supply"
            :error="errors.title"
          />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <BaseInput
              v-model="form.weight"
              label="Weight (kg) *"
              type="number"
              placeholder="0.0"
              :error="errors.weight"
            />
            <BaseInput v-model="form.volume" label="Volume (m³)" type="number" placeholder="0.0" />
            <BaseInput v-model="form.quantity" label="Quantity" type="number" placeholder="1" />
          </div>

          <div class="flex flex-col gap-1 w-full">
            <label class="text-text-primary text-sm font-normal leading-[140%]">
              Description (Optional)
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Any additional notes for the logistics company..."
              class="px-4 py-3 bg-bg-surface border-b border-border-default focus:border-border-focus text-base text-text-primary placeholder-text-placeholder outline-none resize-none transition-colors"
            />
          </div>
          <BaseCheckbox v-model="form.isTemplate" label="Save this as a template for future use" />
        </div>
      </div>

      <div class="flex gap-4">
        <BaseButton variant="secondary" type="button" @click="$router.back()">
          <X class="w-4 h-4 mr-2" /> Cancel
        </BaseButton>

        <BaseButton type="submit" :disabled="isSubmitting">
          <Package class="w-4 h-4 mr-2" />
          {{ isSubmitting ? 'Processing...' : 'Create Shipment' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>
