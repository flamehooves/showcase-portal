'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, X, Check, CaretDown } from '@phosphor-icons/react'
import { cn } from 'cn'
import { useAuthStore } from '@/stores/auth-store'
import { MOCK_USERS } from '@/mock/data/users'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  participant: 'Participant',
  employee: 'Employee',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-status-concept bg-status-concept-bg',
  participant: 'text-status-building bg-status-building-bg',
  employee: 'text-muted-foreground bg-muted',
}

export function PersonaSwitcher() {
  // Only render in development
  if (process.env.NODE_ENV !== 'development') return null

  return <PersonaSwitcherInner />
}

function PersonaSwitcherInner() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, switchPersona } = useAuthStore()

  function handleSwitch(userId: string) {
    switchPersona(userId)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] right-4 z-50 md:bottom-4">
      {/* Floating trigger badge */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full shadow-lg',
          'text-xs font-semibold tracking-wide',
          'bg-card border border-border text-muted-foreground',
          'hover:text-foreground hover:border-primary/30',
          'transition-all duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
        )}
        aria-label="Switch persona (dev only)"
        aria-expanded={isOpen}
      >
        <Users size={13} weight="fill" className="text-primary shrink-0" />
        <span className="hidden sm:inline max-w-[100px] truncate">
          {user?.name.split(' ')[0] ?? 'No user'}
        </span>
        <CaretDown
          size={11}
          className={cn('transition-transform duration-150', isOpen && 'rotate-180')}
        />
      </button>

      {/* Persona list panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute bottom-full right-0 mb-3',
              'w-72 max-h-[420px] overflow-y-auto',
              'rounded-2xl bg-card border border-border shadow-xl',
              'flex flex-col'
            )}
            role="listbox"
            aria-label="Switch persona"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Users size={14} weight="fill" className="text-primary" />
                <span className="text-xs font-semibold text-foreground tracking-wide uppercase">
                  Dev — Switch Persona
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="size-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Close persona switcher"
              >
                <X size={12} />
              </button>
            </div>

            {/* User list */}
            <div className="p-2 flex flex-col gap-0.5">
              {MOCK_USERS.map((mockUser) => {
                const isActive = user?.id === mockUser.id
                return (
                  <button
                    key={mockUser.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSwitch(mockUser.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left',
                      'transition-all duration-100',
                      isActive
                        ? 'bg-primary/8 ring-1 ring-primary/20'
                        : 'hover:bg-accent'
                    )}
                  >
                    {/* Avatar */}
                    {mockUser.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={mockUser.avatarUrl}
                        alt={mockUser.name}
                        className="size-8 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <span className="size-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {mockUser.name.charAt(0)}
                      </span>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-sm font-medium truncate', isActive ? 'text-primary' : 'text-foreground')}>
                          {mockUser.name}
                        </span>
                        {isActive && (
                          <Check size={12} weight="bold" className="text-primary shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={cn(
                          'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                          ROLE_COLORS[mockUser.role] ?? 'text-muted-foreground bg-muted'
                        )}>
                          {ROLE_LABELS[mockUser.role] ?? mockUser.role}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate">
                          {mockUser.team}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
