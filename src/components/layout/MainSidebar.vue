<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import IconLogo from '@/components/icons/IconLogo.vue'
import apiClient from '@/api/axios'
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
    class="fixed lg:sticky top-0 z-30 h-screen flex-shrink-0 flex flex-col py-6 bg-bg-sidebar text-text-on-dark transition-all duration-300 overflow-hidden"
    :class="isOpen ? 'w-[230px] px-5' : 'w-0 lg:w-16 px-0 lg:px-3'"
  >
    <button
      class="flex items-center justify-center w-8 h-8 rounded text-text-sidebar-muted hover:text-white hover:bg-[#083672] transition-colors"
      :class="isOpen ? 'self-end' : 'self-center'"
      @click="$emit('toggle')"
    >
      <PanelLeftClose v-if="isOpen" class="w-4 h-4" />
      <PanelLeftOpen v-else class="w-4 h-4" />
    </button>
    <div class="mb-5 overflow-hidden" :class="isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'">
      <IconLogo v-if="isOpen" class="w-28 h-auto" />
      <div v-else class="w-8 h-8 mx-auto">
        <IconLogo class="w-full h-full object-contain" />
      </div>
    </div>

    <div
      class="flex mb-5 overflow-hidden"
      :class="isOpen ? 'items-center gap-7' : 'lg:justify-center'"
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

    <!-- Search -->
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
