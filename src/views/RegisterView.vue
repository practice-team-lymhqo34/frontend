<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconEye from '@/components/icons/IconEye.vue'
import AuthSidebar from '@/components/auth/AuthSidebar.vue'

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleRegister = () => {
  console.log('Registration logic', {
    fullName: fullName.value,
    email: email.value,
    password: password.value,
  })
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

          <BaseButton type="submit" variant="primary"> Create Account </BaseButton>
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
