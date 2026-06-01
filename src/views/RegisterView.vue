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
import { useToast } from '@/composables/useToast'

const { showSuccess, showError } = useToast()

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

const isLoading = ref(false)

const roleOptions = [
  { value: 'client', label: 'Sender' },
  { value: 'manager', label: 'Manager' },
  { value: 'driver', label: 'Driver' },
]

const validateFullName = () => {
  fullNameError.value = ''
  if (!fullName.value) {
    fullNameError.value = 'Full name is required'
    return false
  }
  return true
}

const validateEmail = () => {
  emailError.value = ''
  if (!email.value) {
    emailError.value = 'Email is required'
    return false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Invalid email format'
    return false
  }
  return true
}

const validatePhone = () => {
  phoneNumberError.value = ''
  if (!phoneNumber.value) {
    phoneNumberError.value = 'Phone number is required'
    return false
  } else if (!/^\+?380\d{9}$/.test(phoneNumber.value)) {
    phoneNumberError.value = 'Invalid phone format (e.g. +380991234567)'
    return false
  }
  return true
}

const validateRole = () => {
  roleError.value = ''
  if (!role.value) {
    roleError.value = 'Please select a role'
    return false
  }
  return true
}

const validatePassword = () => {
  passwordError.value = ''
  if (!password.value) {
    passwordError.value = 'Password is required'
    return false
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
    return false
  }
  return true
}

const validateConfirmPassword = () => {
  confirmPasswordError.value = ''
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password'
    return false
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    return false
  }
  return true
}

const validateForm = () => {
  const isFullNameValid = validateFullName()
  const isEmailValid = validateEmail()
  const isPhoneValid = validatePhone()
  const isRoleValid = validateRole()
  const isPasswordValid = validatePassword()
  const isConfirmPasswordValid = validateConfirmPassword()

  return (
    isFullNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isRoleValid &&
    isPasswordValid &&
    isConfirmPasswordValid
  )
}

const handleRegister = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    await apiClient.post('/auth/register', {
      email: email.value,
      password: password.value,
      full_name: fullName.value,
      phone_number: phoneNumber.value,
      role: role.value,
    })

    showSuccess('Registration successful! You can now log in.')
    router.push('/login')
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    showError(msg)
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
            @blur="validateFullName"
          />

          <BaseInput
            v-model="email"
            label="Email Address"
            placeholder="user@gmail.com"
            :error="emailError"
            @input="emailError = ''"
            @blur="validateEmail"
          />

          <BaseInput
            v-model="phoneNumber"
            label="Phone Number"
            placeholder="+380991234567"
            :error="phoneNumberError"
            @input="phoneNumberError = ''"
            @blur="validatePhone"
          />

          <BaseSelect
            v-model="role"
            label="Select Role"
            :options="roleOptions"
            :error="roleError"
            @update:model-value="roleError = ''"
            @blur="validateRole"
          />

          <BaseInput
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Min. 8 characters"
            :error="passwordError"
            @input="passwordError = ''"
            @blur="validatePassword"
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
            @blur="validateConfirmPassword"
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
