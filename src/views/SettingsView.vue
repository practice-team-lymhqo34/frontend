<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import { User, Mail, Phone, Shield } from 'lucide-vue-next'

const authStore = useAuthStore()
const user = authStore.user
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto font-roboto text-text-primary">
    <h1 class="text-[32px] font-bold mb-8">Settings</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-1">
        <nav class="flex flex-col gap-2">
          <button
            class="flex items-center gap-3 px-4 py-3 bg-brand-primary/10 text-brand-primary rounded font-bold transition-colors"
          >
            <User class="w-5 h-5" /> Profile
          </button>
          <button
            class="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-bg-surface rounded font-medium transition-colors"
          >
            <Shield class="w-5 h-5" /> Security
          </button>
        </nav>
      </div>

      <div class="md:col-span-2 space-y-8">
        <section class="bg-bg-canvas border border-border-default rounded-lg p-6">
          <h2 class="text-xl font-bold mb-6">Profile Information</h2>

          <div v-if="user" class="space-y-6">
            <div class="flex items-center gap-4 p-4 bg-bg-surface rounded-lg">
              <div
                class="w-16 h-16 bg-brand-primary text-white flex items-center justify-center rounded-full text-2xl font-bold"
              >
                {{ user.full_name.charAt(0) }}
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ user.full_name }}</h3>
                <p class="text-text-secondary text-sm capitalize">{{ user.role }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <div class="space-y-1">
                <label class="text-sm font-bold text-text-secondary uppercase tracking-wider"
                  >Full Name</label
                >
                <div
                  class="flex items-center gap-3 px-4 py-3 bg-bg-surface border border-border-default rounded"
                >
                  <User class="w-4 h-4 text-text-placeholder" />
                  <span>{{ user.full_name }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-bold text-text-secondary uppercase tracking-wider"
                  >Email Address</label
                >
                <div
                  class="flex items-center gap-3 px-4 py-3 bg-bg-surface border border-border-default rounded"
                >
                  <Mail class="w-4 h-4 text-text-placeholder" />
                  <span>{{ user.email }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-bold text-text-secondary uppercase tracking-wider"
                  >Phone Number</label
                >
                <div
                  class="flex items-center gap-3 px-4 py-3 bg-bg-surface border border-border-default rounded"
                >
                  <Phone class="w-4 h-4 text-text-placeholder" />
                  <span>{{ user.phone_number }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-10 text-text-placeholder">
            User information not available.
          </div>
        </section>

        <section class="bg-bg-canvas border border-border-default rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4 text-red-600">Danger Zone</h2>
          <p class="text-text-secondary text-sm mb-6">
            Once you sign out, you will need to log back in to access your data.
          </p>
          <BaseButton variant="secondary" @click="authStore.logout()">Sign Out</BaseButton>
        </section>
      </div>
    </div>
  </div>
</template>
