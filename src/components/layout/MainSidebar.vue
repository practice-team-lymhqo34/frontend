<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import IconLogo from '@/components/icons/IconLogo.vue'
import apiClient from '@/api/axios'

export interface SidebarLink {
  name: string
  path: string
}

defineProps<{
  links: SidebarLink[]
}>()

const router = useRouter()

const handleLogout = async () => {
  try {
    await apiClient.post('/logout')
  } catch (error) {
    console.error('Помилка при виході:', error)
  } finally {
    router.push('/login')
  }
}
</script>

<template>
  <aside
    class="w-[220px] bg-bg-sidebar text-text-on-dark flex-shrink-0 min-h-screen flex flex-col px-5 py-6 gap-5"
  >
    <IconLogo class="w-28 h-auto" />

    <div class="flex items-center gap-7">
      <div
        class="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-white text-sm font-bold"
      >
        U
      </div>
      <button class="text-text-sidebar-muted hover:text-white transition-colors text-base">
        ⚙
      </button>
      <button class="text-text-sidebar-muted hover:text-white transition-colors text-base">
        🔔
      </button>
    </div>

    <div class="flex items-center gap-2 bg-[#083672] rounded px-3 py-2">
      <span class="text-text-sidebar-muted text-sm">🔍</span>
      <input
        type="text"
        placeholder="Search"
        class="bg-transparent text-sm text-text-on-dark placeholder-text-sidebar-muted outline-none w-full"
      />
    </div>

    <nav class="flex flex-col gap-0.5">
      <RouterLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="px-3 py-2 rounded text-sm text-text-sidebar-muted hover:text-white transition-colors"
        :class="$route.path === link.path ? 'bg-[#083672] text-white' : 'hover:bg-[#083672]'"
      >
        {{ link.name }}
      </RouterLink>
    </nav>

    <div class="mt-auto pt-4">
      <button
        @click="handleLogout"
        class="w-full text-left px-3 py-2 rounded text-sm text-text-sidebar-muted hover:text-red-400 hover:bg-[#083672] transition-colors flex items-center gap-2"
      >
        Log Out
      </button>
    </div>
  </aside>
</template>
