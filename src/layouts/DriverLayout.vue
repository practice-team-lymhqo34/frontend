<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainSidebar from '@/components/layout/MainSidebar.vue'

const driverLinks = [
  { name: "Today's Route", path: '/driver/route' },
  { name: 'My Vehicle', path: '/driver/vehicle' },
  { name: 'Settings', path: '/settings' },
]
</script>

<template>
  <div class="flex min-h-screen bg-bg-surface font-roboto">
    <MainSidebar :links="driverLinks" />
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
