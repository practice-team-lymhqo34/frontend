<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import IconEye from '@/components/icons/IconEye.vue'
import AuthSidebar from '@/components/auth/AuthSidebar.vue'
import apiClient from '@/api/axios.ts'
import router from '@/router'
import { getErrorMessage } from '@/utils/errorHandler'

const fullName = ref('')
const email = ref('')
const phoneNumber = ref('')
const role = ref('')
const password = ref('')
const confirmPassword = ref('')

const fullNameError = ref('')
const emailError = ref('')
const phoneNumberError = ref('')
const roleError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const errorMessage = ref('')
const isLoading = ref(false)

const roleOptions = [
  { value: 'client', label: 'Sender' },
  { value: 'manager', label: 'Manager' },
  { value: 'driver', label: 'Driver' },
]

const validateForm = () => {
  let isValid = true
  fullNameError.value = ''
  emailError.value = ''
  phoneNumberError.value = ''
  roleError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''

  if (!fullName.value) {
    fullNameError.value = 'Full name is required'
    isValid = false
  }

  if (!email.value) {
    emailError.value = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Invalid email format'
    isValid = false
  }

  if (!phoneNumber.value) {
    phoneNumberError.value = 'Phone number is required'
    isValid = false
  } else if (!/^\+?380\d{9}$/.test(phoneNumber.value)) {
    phoneNumberError.value = 'Invalid phone format (e.g. +380991234567)'
    isValid = false
  }

  if (!role.value) {
    roleError.value = 'Please select a role'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
    isValid = false
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
    isValid = false
  }

  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password'
    isValid = false
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  errorMessage.value = ''
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
    errorMessage.value = getErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen font-roboto bg-bg-canvas">
    <AuthSidebar />

    <div class="flex-1 flex flex-col justify-center px-6 sm:px-10 py-8 sm:py-0">
      <div class="w-full max-w-[480px] mx-auto flex flex-col gap-6 sm:gap-8">
        <div>
          <h1 class="text-text-primary text-3xl sm:text-[42px] font-bold">Create an account</h1>
          <p class="text-text-secondary mt-2">Join LogiFlow to manage your fleet efficiently.</p>
        </div>

        <form class="flex flex-col gap-6" @submit.prevent="handleRegister">
          <BaseInput
            v-model="fullName"
            label="Full Name"
            placeholder="Full Name"
            :error="fullNameError"
            @input="fullNameError = ''"
          />

          <BaseInput
            v-model="email"
            label="Email Address"
            placeholder="user@gmail.com"
            :error="emailError"
            @input="emailError = ''"
          />

          <BaseInput
            v-model="phoneNumber"
            label="Phone Number"
            placeholder="+380991234567"
            :error="phoneNumberError"
            @input="phoneNumberError = ''"
          />

          <BaseSelect
            v-model="role"
            label="Select Role"
            :options="roleOptions"
            :error="roleError"
            @update:model-value="roleError = ''"
          />

          <BaseInput
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Min. 8 characters"
            :error="passwordError"
            @input="passwordError = ''"
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
            :error="confirmPasswordError"
            @input="confirmPasswordError = ''"
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
