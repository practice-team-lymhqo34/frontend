<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import IconEye from '@/components/icons/IconEye.vue'
import AuthSidebar from '@/components/auth/AuthSidebar.vue'

const email = ref('')
const password = ref('')
const role = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const roleOptions = [
  { value: 'manager', label: 'Manager' },
  { value: 'driver', label: 'Driver' },
  { value: 'dispatcher', label: 'Sender' },
]

const handleLogin = () => console.log('Login logic here') //todo
</script>

<template>
  <div class="flex min-h-screen font-roboto bg-bg-canvas">
    <AuthSidebar />

    <div class="flex-1 flex flex-col justify-center px-10">
      <div class="w-full max-w-[480px] mx-auto flex flex-col gap-10">
        <h1 class="text-text-primary text-[42px] font-bold">Log in</h1>

        <form class="flex flex-col gap-6" @submit.prevent="handleLogin">
          <BaseInput v-model="email" label="Email Address" placeholder="user@gmail.com" />

          <BaseInput
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="*******"
          >
            <template #suffix>
              <button type="button" @click="showPassword = !showPassword">
                <IconEye :active="showPassword" />
              </button>
            </template>
          </BaseInput>

          <BaseSelect v-model="role" label="Select role" :options="roleOptions" />

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <BaseCheckbox v-model="rememberMe" label="Remember me" />
            </label>
            <a href="#" class="text-text-link text-sm hover:underline">Forgot Password?</a>
          </div>

          <BaseButton type="submit" variant="primary"> Log In </BaseButton>
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
