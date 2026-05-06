<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import MainSidebar from '@/components/layout/MainSidebar.vue'

export interface SidebarLink {
  name: string
  path: string
  icon: string
}

const props = defineProps<{
  links: SidebarLink[]
}>()

const isSidebarOpen = ref(true)
</script>

<template>
  <div class="flex min-h-screen bg-bg-surface font-roboto">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/40 z-20 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <MainSidebar
      :links="props.links"
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
      @toggle="isSidebarOpen = !isSidebarOpen"
    />

    <main class="flex-1 overflow-y-auto min-w-0">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
