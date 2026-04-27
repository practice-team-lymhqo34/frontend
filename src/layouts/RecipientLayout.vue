<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainSidebar from '@/components/layout/MainSidebar.vue'

const recipientLinks = [
  { name: 'Billings & Reports', path: '/recipient/billing' },
  { name: 'Active Deliveries', path: '/recipient/active' },
  { name: 'Settings', path: '/settings' },
]
</script>

<template>
  <div class="flex min-h-screen bg-bg-surface font-roboto">
    <MainSidebar :links="recipientLinks" />

    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
