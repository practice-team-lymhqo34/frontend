<script setup lang="ts">
defineProps<{
  updates: { time: string; text: string }[]
}>()
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-text-primary mb-4">Latest updates</h2>
    <div class="flex flex-col gap-1">
      <div
        v-for="(update, idx) in updates"
        :key="idx"
        class="bg-bg-canvas border border-border-default rounded flex items-center px-4 py-3 text-sm"
      >
        <span class="text-text-placeholder w-28 shrink-0">{{ update.time }}</span>
        <span class="text-text-primary">{{ update.text }}</span>
      </div>
    </div>
  </div>
</template>
