<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainSidebar from '@/components/layout/MainSidebar.vue'
const managerLinks = [
  { name: 'Overview Dashboard', path: '/dashboard' },
  { name: 'Shipments', path: '/shipments' },
  { name: 'Users', path: '/users' },
  { name: '+ Create New Delivery', path: '/delivery/new' },
  { name: 'Settings', path: '/settings' },
]
</script>

<template>
  <div class="flex min-h-screen bg-bg-surface font-roboto">
    <MainSidebar :links="managerLinks" />
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
