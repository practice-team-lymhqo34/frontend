<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'

const managerLinks = [
  { name: 'Overview Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Shipments', path: '/shipments', icon: 'Package' },
  { name: 'Users', path: '/users', icon: 'Users' },
  { name: 'Create New Delivery', path: '/delivery/new', icon: 'Plus' },
  { name: 'Settings', path: '/settings', icon: 'Settings' },
]
</script>

<template>
  <AppLayout :links="managerLinks" />
</template>
