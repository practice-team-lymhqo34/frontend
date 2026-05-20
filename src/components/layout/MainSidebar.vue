<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import IconLogo from '@/components/icons/IconLogo.vue'
import apiClient from '@/api/axios'
import { useAuthStore } from '@/stores/auth'
import {
  Settings,
  Bell,
  User,
  Search,
  LogOut,
  LayoutDashboard,
  Package,
  Users,
  Plus,
  Route,
  Truck,
  FileText,
  PackageCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-vue-next'

export interface SidebarLink {
  name: string
  path: string
  icon: string
}

const iconMap: Record<string, unknown> = {
  LayoutDashboard,
  Package,
  Users,
  Plus,
  Route,
  Truck,
  FileText,
  PackageCheck,
}

defineProps<{
  links: SidebarLink[]
  isOpen: boolean
}>()

defineEmits<{
  close: []
  toggle: []
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await apiClient.post('/auth/logout')
  } catch (error) {
    console.error('Помилка при виході:', error)
  } finally {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<template>
  <aside
    class="fixed lg:sticky top-0 h-screen flex-shrink-0 flex flex-col py-6 bg-bg-sidebar text-text-on-dark transition-all duration-300 overflow-hidden lg:shadow-none"
    :class="[
      isOpen
        ? 'w-[230px] px-5 shadow-2xl opacity-100'
        : 'w-0 lg:w-16 px-0 lg:px-3 opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto',
    ]"
  >
    <div class="flex items-center justify-between mb-8" :class="!isOpen && 'lg:flex-col lg:gap-4'">
      <IconLogo v-if="isOpen" class="w-28 h-auto" />
      <div v-else class="w-8 h-8 mx-auto lg:block hidden">
        <IconLogo class="w-full h-full object-contain" />
      </div>

      <button
        class="flex items-center justify-center w-8 h-8 rounded text-text-sidebar-muted hover:text-white hover:bg-[#083672] transition-colors"
        @click="$emit('toggle')"
      >
        <PanelLeftClose v-if="isOpen" class="w-4 h-4" />
        <PanelLeftOpen v-else class="w-4 h-4 lg:block hidden" />
      </button>
    </div>

    <div
      class="flex mb-5 overflow-hidden"
      :class="isOpen ? 'items-center gap-7' : 'lg:justify-center lg:mb-8'"
    >
      <div
        class="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0"
      >
        <User class="w-4 h-4 text-white" />
      </div>
      <template v-if="isOpen">
        <button class="text-text-sidebar-muted hover:text-white transition-colors">
          <Settings class="w-4 h-4" />
        </button>
        <button class="text-text-sidebar-muted hover:text-white transition-colors">
          <Bell class="w-4 h-4" />
        </button>
      </template>
    </div>

    <div v-if="isOpen" class="flex items-center gap-2 bg-[#083672] rounded px-3 py-2 mb-5">
      <Search class="w-4 h-4 text-text-sidebar-muted flex-shrink-0" />
      <input
        type="text"
        placeholder="Search"
        class="bg-transparent text-sm text-text-on-dark placeholder-text-sidebar-muted outline-none w-full"
      />
    </div>

    <nav class="flex flex-col gap-0.5 flex-1">
      <RouterLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="flex items-center gap-3 py-2 rounded text-sm text-text-sidebar-muted hover:text-white transition-colors"
        :class="[
          route.path === link.path ? 'bg-[#083672] text-white' : 'hover:bg-[#083672]',
          isOpen ? 'px-3' : 'lg:justify-center lg:px-2',
        ]"
        :title="!isOpen ? link.name : undefined"
      >
        <component :is="iconMap[link.icon]" class="w-4 h-4 flex-shrink-0" />
        <span v-if="isOpen" class="whitespace-nowrap overflow-hidden">{{ link.name }}</span>
      </RouterLink>
    </nav>

    <button
      @click="handleLogout"
      class="flex items-center gap-3 px-3 py-2 rounded text-sm text-text-sidebar-muted hover:text-red-400 hover:bg-[#083672] transition-colors mt-auto"
      :class="!isOpen && 'lg:justify-center lg:px-2'"
      :title="!isOpen ? 'Log Out' : undefined"
    >
      <LogOut class="w-4 h-4 flex-shrink-0" />
      <span v-if="isOpen">Log Out</span>
    </button>
  </aside>
</template>
