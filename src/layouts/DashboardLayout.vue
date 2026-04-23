<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainSidebar from '@/components/layout/MainSidebar.vue'
</script>

<template>
  <div class="flex min-h-screen bg-bg-surface font-roboto">
    <MainSidebar />
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
