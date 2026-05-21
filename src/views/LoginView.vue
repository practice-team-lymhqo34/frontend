<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import IconEye from '@/components/icons/IconEye.vue'
import AuthSidebar from '@/components/auth/AuthSidebar.vue'
import apiClient from '@/api/axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const emailError = ref('')
const passwordError = ref('')
const isLoading = ref(false)

const validateForm = () => {
  let isValid = true
  emailError.value = ''
  passwordError.value = ''

  if (!email.value) {
    emailError.value = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Invalid email format'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
    isValid = false
  }

  return isValid
}

const redirectUser = async () => {
  const userRole = authStore.userRole
  console.log('Redirecting user based on role:', userRole)
  if (userRole === 'manager') {
    await router.push('/dashboard')
  } else if (userRole === 'driver') {
    await router.push('/driver/route')
  } else if (userRole === 'client') {
    await router.push('/recipient/billing')
  } else {
    await router.push('/dashboard')
  }
}

const handleLogin = async () => {
  if (!validateForm()) return

  errorMessage.value = ''
  isLoading.value = true
  console.log('Attempting login for:', email.value)

  try {
    const response = await apiClient.post('/auth/login', {
      email: email.value,
      password: password.value,
    })

    console.log('Login successful, setting user in store')
    authStore.setUser(response.data)

    isLoading.value = false

    await redirectUser()
  } catch (error: unknown) {
    isLoading.value = false
    console.error('Login error:', error)
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail
      if (Array.isArray(detail)) {
        errorMessage.value = 'Please fill all fields correctly.'
      } else if (typeof detail === 'string') {
        errorMessage.value = detail
      } else if (error.code === 'ECONNABORTED') {
        errorMessage.value = 'Request timed out. Please try again.'
      } else {
        errorMessage.value = 'Server connection error'
      }
    } else {
      errorMessage.value = 'An unexpected error occurred'
    }
  }
}
</script>

<template>
  <div class="flex min-h-screen font-roboto bg-bg-canvas">
    <AuthSidebar />

    <div class="flex-1 flex flex-col justify-center px-6 sm:px-10">
      <div class="w-full max-w-[480px] mx-auto flex flex-col gap-8 sm:gap-10">
        <h1 class="text-text-primary text-3xl sm:text-[42px] font-bold">Log in</h1>

        <form class="flex flex-col gap-6" @submit.prevent="handleLogin">
          <BaseInput
            v-model="email"
            label="Email Address"
            placeholder="user@gmail.com"
            :error="emailError"
            @input="emailError = ''"
          />

          <BaseInput
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="*******"
            :error="passwordError"
            @input="passwordError = ''"
          >
            <template #suffix>
              <button type="button" @click="showPassword = !showPassword">
                <IconEye :active="showPassword" />
              </button>
            </template>
          </BaseInput>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <BaseCheckbox v-model="rememberMe" label="Remember me" />
            </label>
            <a href="#" class="text-text-link text-sm hover:underline">Forgot Password?</a>
          </div>

          <BaseButton type="submit" variant="primary" :disabled="isLoading">
            {{ isLoading ? 'Logging in...' : 'Log In' }}
          </BaseButton>
          <div v-if="errorMessage" class="text-red-500 text-sm text-center font-medium">
            {{ errorMessage }}
          </div>
        </form>

        <div class="h-px bg-border-default w-full"></div>
        <p class="text-sm">
          <span class="text-text-secondary">No account yet?</span>
          <RouterLink to="/register" class="ml-1 text-text-link font-bold hover:underline"
            >Sign Up</RouterLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
