'use client'
import { create } from 'zustand'

interface UIStore {
  searchOpen: boolean
  lightboxOpen: boolean
  lightboxImages: { url: string; caption?: string }[]
  lightboxIndex: number
  openSearch: () => void
  closeSearch: () => void
  openLightbox: (images: { url: string; caption?: string }[], index?: number) => void
  closeLightbox: () => void
  setLightboxIndex: (index: number) => void
}

export const useUIStore = create<UIStore>((set) => ({
  searchOpen: false,
  lightboxOpen: false,
  lightboxImages: [],
  lightboxIndex: 0,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  openLightbox: (images, index = 0) => set({ lightboxOpen: true, lightboxImages: images, lightboxIndex: index }),
  closeLightbox: () => set({ lightboxOpen: false }),
  setLightboxIndex: (index) => set({ lightboxIndex: index }),
}))
