<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import { User, Mail, Phone, Shield, Truck, ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const user = authStore.user
const router = useRouter()

const goToVehicle = () => {
  router.push('/driver/vehicle')
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto font-roboto text-text-primary">
    <h1 class="text-[32px] font-bold mb-8">Settings</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-1">
        <nav class="flex flex-col gap-2">
          <button
            class="flex items-center gap-3 px-4 py-3 bg-brand-primary/10 text-brand-primary rounded font-bold transition-colors text-left"
          >
            <User class="w-5 h-5" /> Profile
          </button>

          <button
            v-if="authStore.isDriver"
            @click="goToVehicle"
            class="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-bg-surface rounded font-medium transition-colors text-left"
          >
            <Truck class="w-5 h-5" /> My Vehicle
          </button>

          <button
            class="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-bg-surface rounded font-medium transition-colors text-left"
          >
            <Shield class="w-5 h-5" /> Security
          </button>
        </nav>
      </div>

      <div class="md:col-span-2 space-y-8">
        <section class="bg-bg-canvas border border-border-default rounded-lg p-6">
          <h2 class="text-xl font-bold mb-6">Profile Information</h2>

          <div v-if="user" class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-bg-surface rounded-lg">
              <div class="flex items-center gap-4">
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

              <div v-if="authStore.isDriver" class="hidden sm:block">
                <div v-if="user.vehicle" class="text-right">
                  <p class="text-[10px] text-text-placeholder font-bold uppercase">
                    Vehicle Linked
                  </p>
                  <p class="text-sm font-bold text-brand-primary">
                    {{ user.vehicle.brand }} {{ user.vehicle.model }}
                  </p>
                </div>
                <BaseButton v-else variant="secondary" size="sm" @click="goToVehicle">
                  Link Vehicle
                </BaseButton>
              </div>
            </div>

            <div
              v-if="authStore.isDriver && user.vehicle"
              @click="goToVehicle"
              class="p-4 border border-brand-primary/20 bg-brand-primary/5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-brand-primary/10 transition-colors"
            >
              <div class="flex items-center gap-3">
                <Truck class="w-5 h-5 text-brand-primary" />
                <div>
                  <p class="text-sm font-bold text-text-primary">My vehicle</p>
                  <p class="text-xs text-text-secondary">
                    {{ user.vehicle.license_plate }} • {{ user.vehicle.fuel_consumption }} l/100km
                  </p>
                </div>
              </div>
              <ChevronRight class="w-4 h-4 text-brand-primary" />
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
