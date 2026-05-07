<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import IconEye from '@/components/icons/IconEye.vue'
import AuthSidebar from '@/components/auth/AuthSidebar.vue'
import apiClient from '@/api/axios.ts'
import router from '@/router'
import axios from 'axios'

const fullName = ref('')
const email = ref('')
const phoneNumber = ref('')
const role = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const errorMessage = ref('')
const isLoading = ref(false)

const roleOptions = [
  { value: 'client', label: 'Sender' },
  { value: 'manager', label: 'Manager' },
  { value: 'driver', label: 'Driver' },
]

const handleRegister = async () => {
  errorMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords does not match'
    return
  }

  isLoading.value = true

  try {
    await apiClient.post('/auth/register', {
      email: email.value,
      password: password.value,
      full_name: fullName.value,
      phone_number: phoneNumber.value,
      role: role.value,
    })

    router.push('/login')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail

      if (Array.isArray(detail)) {
        console.error('Помилки валідації від бекенду:', detail)
        errorMessage.value = 'Please, fill all the necessary fields correctly.'
      } else if (typeof detail === 'string') {
        errorMessage.value = detail
      } else {
        errorMessage.value = 'Server connection failed'
      }
    } else {
      errorMessage.value = 'Unknown error'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen font-roboto bg-bg-canvas">
    <AuthSidebar />

    <div class="flex-1 flex flex-col justify-center px-10">
      <div class="w-full max-w-[480px] mx-auto flex flex-col gap-8">
        <div>
          <h1 class="text-text-primary text-[42px] font-bold">Create an account</h1>
          <p class="text-text-secondary mt-2">Join LogiFlow to manage your fleet efficiently.</p>
        </div>

        <form class="flex flex-col gap-6" @submit.prevent="handleRegister">
          <div class="grid grid-cols-2 gap-4">
            <BaseInput v-model="fullName" label="Full Name" placeholder="Full Name" />
          </div>

          <BaseInput v-model="email" label="Email Address" placeholder="user@gmail.com" />

          <BaseInput v-model="phoneNumber" label="Phone Number" placeholder="+380991234567" />

          <BaseSelect v-model="role" label="Select Role" :options="roleOptions" />

          <BaseInput
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Min. 8 characters"
          >
            <template #suffix>
              <button type="button" @click="showPassword = !showPassword">
                <IconEye :active="showPassword" />
              </button>
            </template>
          </BaseInput>
          <BaseInput
            v-model="confirmPassword"
            label="Confirm Password"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Repeat password"
          >
            <template #suffix>
              <button type="button" @click="showConfirmPassword = !showConfirmPassword">
                <IconEye :active="showConfirmPassword" />
              </button>
            </template>
          </BaseInput>

          <BaseButton type="submit" variant="primary" :disabled="isLoading">
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </BaseButton>
          <div v-if="errorMessage" class="text-red-500 text-sm font-medium text-center mb-4">
            {{ errorMessage }}
          </div>
        </form>

        <div class="h-px bg-border-default w-full"></div>

        <p class="text-sm">
          <span class="text-text-secondary">Already have an account?</span>
          <RouterLink to="/login" class="ml-1 text-text-link font-bold hover:underline"
            >Log In</RouterLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
