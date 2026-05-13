import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  email: string
  full_name: string
  role: 'client' | 'manager' | 'driver'
  phone_number: string
}

export const useAuthStore = defineStore('auth', () => {
  const getInitialUser = (): User | null => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e)
      localStorage.removeItem('user')
      return null
    }
  }

  const user = ref<User | null>(getInitialUser())

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role)

  const isClient = computed(() => user.value?.role === 'client')
  const isManager = computed(() => user.value?.role === 'manager')
  const isDriver = computed(() => user.value?.role === 'driver')

  function setUser(userData: User | null) {
    user.value = userData
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  }

  function logout() {
    setUser(null)
  }

  return {
    user,
    isAuthenticated,
    userRole,
    isClient,
    isManager,
    isDriver,
    setUser,
    logout,
  }
})
