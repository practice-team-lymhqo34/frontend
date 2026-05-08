<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/axios'
import { Package, X } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'

interface OrderForm {
  title: string
  description: string
  weight: string
  isTemplate: boolean
}

const STORAGE_KEY = 'order-form-draft'

const router = useRouter()
const isSubmitting = ref(false)

const savedDraft = localStorage.getItem(STORAGE_KEY)

const form = reactive<OrderForm>(
  savedDraft
    ? JSON.parse(savedDraft)
    : {
        title: '',
        description: '',
        weight: '',
        isTemplate: false,
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
  isSubmitting.value = true

  try {
    await apiClient.post('/dashboard/orders', {
      title: form.title,
      description: form.description || null,
      weight: parseFloat(form.weight),
      is_template: form.isTemplate,
    })
    localStorage.removeItem(STORAGE_KEY)
    router.push('/dashboard') //todo router.push('/shipments')
  } catch (error) {
    console.error('Помилка при створенні замовлення:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-3xl text-primary font-roboto">
    <div class="mb-8">
      <h1 class="text-[32px] font-bold mb-1">Create New Delivery</h1>
      <p class="text-gray-500">Basic order details</p>
    </div>

    <form @submit.prevent="submitOrder">
      <div class="bg-bg-canvas p-6 border border-gray-200 mb-8">
        <h2 class="text-sm font-bold tracking-wider text-text-secondary mb-5">ORDER DETAILS</h2>

        <div class="space-y-5">
          <BaseInput
            v-model="form.title"
            label="Delivery Title *"
            placeholder="e.g. Electronics to Kyiv"
          />

          <BaseInput v-model="form.weight" label="Weight (kg) *" type="number" placeholder="0.0" />

          <div class="flex flex-col gap-1 w-full">
            <label class="text-text-primary text-sm font-normal leading-[140%]">
              Description (Optional)
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Any additional notes..."
              class="px-4 py-3 bg-bg-surface border-b border-border-default focus:border-border-focus text-base text-text-primary placeholder-text-placeholder outline-none resize-none transition-colors"
            />
          </div>
          <BaseCheckbox v-model="form.isTemplate" label="Save as template" />
        </div>
      </div>

      <div class="flex gap-4">
        <BaseButton variant="secondary" type="button" @click="$router.back()">
          <X class="w-4 h-4 mr-2" /> Cancel
        </BaseButton>

        <BaseButton type="submit" :disabled="isSubmitting">
          <Package class="w-4 h-4 mr-2" />
          {{ isSubmitting ? 'Creating...' : 'Create Shipment' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>
