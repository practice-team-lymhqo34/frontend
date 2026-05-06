<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'

const recipientLinks = [
  { name: 'Billings & Reports', path: '/recipient/billing', icon: 'PackageCheck' },
  { name: 'Active Deliveries', path: '/recipient/active', icon: 'FileText' },
  { name: 'Settings', path: '/settings', icon: 'Settings' },
]
</script>

<template>
  <AppLayout :links="recipientLinks" />
</template>
