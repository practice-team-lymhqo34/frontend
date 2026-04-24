<script setup lang="ts">
defineProps<{
  cities: { name: string; percent: string; count: string }[]
}>()
</script>

<template>
  <div class="bg-bg-canvas border border-border-default rounded-lg p-4">
    <h3 class="text-sm font-bold text-text-primary mb-4">Users by City</h3>
    <div class="flex flex-col gap-3">
      <div v-for="city in cities" :key="city.name" class="grid grid-cols-3 items-center text-sm">
        <span class="text-text-primary">{{ city.name }}</span>
        <span class="font-medium text-text-primary text-right">{{ city.percent }}</span>
        <span class="text-text-placeholder text-right">{{ city.count }}</span>
      </div>
    </div>
  </div>
</template>
