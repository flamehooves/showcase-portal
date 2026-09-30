'use client'
import { create } from 'zustand'
import { persist, type StorageValue } from 'zustand/middleware'
import type { User } from '@/types'
import { MOCK_USERS } from '@/mock/data/users'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  signIn: (user: User) => void
  signOut: () => void
  switchPersona: (userId: string) => void
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const cookieStorage = {
  getItem: (name: string): StorageValue<AuthStore> | null => {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    if (!match) return null
    try {
      return JSON.parse(decodeURIComponent(match[1]))
    } catch {
      return null
    }
  },
  setItem: (name: string, value: StorageValue<AuthStore>): void => {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
  },
  removeItem: (name: string): void => {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=; path=/; max-age=0`
  },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: (user) => set({ user, isAuthenticated: true }),
      signOut: () => set({ user: null, isAuthenticated: false }),
      switchPersona: (userId) => {
        const user = MOCK_USERS.find((u) => u.id === userId)
        if (user) set({ user, isAuthenticated: true })
      },
    }),
    { name: 'showcase-auth', storage: cookieStorage }
  )
)
