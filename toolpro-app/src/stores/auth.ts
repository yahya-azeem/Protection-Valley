import { writable, derived } from 'svelte/store'
import { browser } from '$app/environment'

export type UserRole = 'retail' | 'wholesale' | 'admin'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  company?: string
  token: string
}

function createAuthStore() {
  const { subscribe, set, update } = writable<User | null>(null)

  return {
    subscribe,
    login: (user: User) => set(user),
    logout: () => {
      set(null)
      if (browser) {
        localStorage.removeItem('user')
      }
    },
    init: (user: User | null) => set(user),
    updateProfile: (updates: Partial<User>) => {
      update(user => (user ? { ...user, ...updates } : null))
    }
  }
}

export const auth = createAuthStore()

export const isAuthenticated = derived(auth, $auth => $auth !== null)
export const isWholesale = derived(auth, $auth => $auth?.role === 'wholesale')
export const isAdmin = derived(auth, $auth => $auth?.role === 'admin')
export const userRole = derived(auth, $auth => $auth?.role || 'retail')

// Persist auth to localStorage
if (browser) {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      auth.init(JSON.parse(savedUser))
    } catch (e) {
      console.error('Failed to parse user from localStorage')
    }
  }

  auth.subscribe(value => {
    if (value) {
      localStorage.setItem('user', JSON.stringify(value))
    }
  })
}

// Mock login function for demo
export async function mockLogin(email: string, password: string): Promise<User | null> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (email === 'wholesale@toolpro.com' && password === 'password') {
    return {
      id: 1,
      email: 'wholesale@toolpro.com',
      name: 'Wholesale Customer',
      role: 'wholesale',
      company: 'ABC Construction',
      token: 'mock-wholesale-token'
    }
  }
  
  if (email === 'admin@toolpro.com' && password === 'password') {
    return {
      id: 2,
      email: 'admin@toolpro.com',
      name: 'Admin User',
      role: 'admin',
      token: 'mock-admin-token'
    }
  }
  
  return null
}
