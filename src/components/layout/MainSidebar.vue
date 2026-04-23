<script setup lang="ts">
import { RouterLink } from 'vue-router'
import IconLogo from '@/components/icons/IconLogo.vue'
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
        to="/dashboard"
        class="px-3 py-2 rounded text-sm text-text-sidebar-muted hover:text-white transition-colors"
        :class="$route.path === '/dashboard' ? 'bg-[#083672] text-white' : 'hover:bg-[#083672]'"
      >
        Overview Dashboard
      </RouterLink>
      <RouterLink
        to="/shipments"
        class="px-3 py-2 rounded text-sm text-text-sidebar-muted hover:text-white transition-colors"
        :class="$route.path === '/shipments' ? 'bg-[#083672] text-white' : 'hover:bg-[#083672]'"
      >
        Shipments
      </RouterLink>
      <RouterLink
        to="/users"
        class="px-3 py-2 rounded text-sm text-text-sidebar-muted hover:text-white transition-colors"
        :class="$route.path === '/users' ? 'bg-[#083672] text-white' : 'hover:bg-[#083672]'"
      >
        Users
      </RouterLink>
      <RouterLink
        to="/delivery/new"
        class="px-3 py-2 rounded text-sm text-text-sidebar-muted hover:text-white transition-colors"
        :class="$route.path === '/delivery/new' ? 'bg-[#083672] text-white' : 'hover:bg-[#083672]'"
      >
        + Create New Delivery
      </RouterLink>
      <RouterLink
        to="/settings"
        class="px-3 py-2 rounded text-sm text-text-sidebar-muted hover:text-white transition-colors"
        :class="$route.path === '/settings' ? 'bg-[#083672] text-white' : 'hover:bg-[#083672]'"
      >
        Settings
      </RouterLink>
    </nav>
  </aside>
</template>
