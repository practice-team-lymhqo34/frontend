<script setup lang="ts">
import { ref } from 'vue'
import { Search, MoreVertical, UserPlus } from 'lucide-vue-next'

const users = ref([
  { id: 1, name: 'Admin User', email: 'admin@logiflow.com', role: 'manager', status: 'Active' },
  { id: 2, name: 'John Driver', email: 'john@logiflow.com', role: 'driver', status: 'On Route' },
  { id: 3, name: 'Jane Client', email: 'jane@logiflow.com', role: 'client', status: 'Active' },
])

const getRoleClasses = (role: string) => {
  switch (role) {
    case 'manager':
      return 'bg-purple-100 text-purple-600'
    case 'driver':
      return 'bg-blue-100 text-blue-600'
    case 'client':
      return 'bg-orange-100 text-orange-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
</script>

<template>
  <div class="p-8 font-roboto text-text-primary">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-[32px] font-bold">Users</h1>
        <p class="text-text-secondary">Manage platform members and their roles</p>
      </div>
      <button
        class="flex items-center gap-2 bg-btn-primary-default text-white px-6 py-3 rounded font-bold hover:bg-btn-primary-hover transition-colors"
      >
        <UserPlus class="w-5 h-5" /> Add New User
      </button>
    </div>

    <div class="bg-bg-canvas border border-border-default rounded-lg overflow-hidden">
      <div class="p-4 border-b border-border-default flex gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-placeholder" />
          <input
            type="text"
            placeholder="Search by name or email..."
            class="w-full pl-10 pr-4 py-2 bg-bg-surface border border-border-default rounded outline-none focus:border-brand-primary transition-colors"
          />
        </div>
      </div>

      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-bg-surface border-b border-border-default">
            <th class="py-4 px-6 text-sm font-bold text-text-secondary uppercase tracking-wider">
              User
            </th>
            <th class="py-4 px-6 text-sm font-bold text-text-secondary uppercase tracking-wider">
              Role
            </th>
            <th class="py-4 px-6 text-sm font-bold text-text-secondary uppercase tracking-wider">
              Status
            </th>
            <th
              class="py-4 px-6 text-sm font-bold text-text-secondary uppercase tracking-wider text-right"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-default">
          <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-bg-surface transition-colors cursor-pointer"
          >
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold"
                >
                  {{ user.name.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-text-primary">{{ user.name }}</div>
                  <div class="text-xs text-text-secondary">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="py-4 px-6">
              <span
                class="px-3 py-1 rounded-full text-xs font-bold uppercase"
                :class="getRoleClasses(user.role)"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="py-4 px-6">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span class="text-sm text-text-primary">{{ user.status }}</span>
              </div>
            </td>
            <td class="py-4 px-6 text-right">
              <button
                class="p-2 hover:bg-border-default rounded-full transition-colors text-text-placeholder hover:text-text-primary"
              >
                <MoreVertical class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
