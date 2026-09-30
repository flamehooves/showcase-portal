'use client'
import { useRef } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export function SearchBar({ value, onChange, placeholder = 'Search projects, builders, tags…', autoFocus }: SearchBarProps) {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div className="relative">
      <MagnifyingGlass
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-surface border border-border rounded-2xl pl-11 pr-10 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-1"
          aria-label="Clear search"
        >
          <X size={14} />
        </motion.button>
      )}
    </div>
  )
}
