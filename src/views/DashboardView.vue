<script setup lang="ts">
import StatCard from '@/components/dashboard/StatCard.vue'
import LatestUpdates from '@/components/dashboard/LatestUpdates.vue'
import UsersByCity from '@/components/dashboard/UsersByCity.vue'

const stats = [
  { title: 'Total Shipments', value: '500K+', trend: 2.5 },
  { title: 'In Transit', value: '120K', trend: -1.2 },
  { title: 'Delivered', value: '352K', trend: 11 },
  { title: 'Delayed', value: '129', trend: -12.2 },
]

const updates = [
  { time: '10:45 AM', text: 'Shipment PT-№3 status changed to Pending' },
  { time: '09:12 AM', text: 'New delivery to Chernivtsi created' },
  { time: 'Yesterday', text: 'Driver assigned to route #42' },
]

const cities = [
  { name: 'Kyiv', percent: '32.5%', count: '120k' },
  { name: 'Chernivtsi', percent: '25.4%', count: '105k' },
  { name: 'Lviv', percent: '14.5%', count: '48k' },
  { name: 'Ternopil', percent: '13.2%', count: '45k' },
]
</script>

<template>
  <div class="p-8 bg-bg-surface min-h-screen">
    <h1 class="text-3xl font-bold text-text-primary mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard v-for="stat in stats" :key="stat.title" v-bind="stat" />
    </div>

    <div class="bg-bg-canvas border border-border-default rounded-lg p-4 text-text-placeholder">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2">
          <h2 class="text-xl font-bold text-text-primary mb-4">Activity</h2>
          Chart placeholder
        </div>
        <UsersByCity :cities="cities" />
      </div>
    </div>

    <LatestUpdates :updates="updates" />
  </div>
</template>
