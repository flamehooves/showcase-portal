'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, Compass, Folder, User } from '@phosphor-icons/react'
import { cn } from 'cn'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: House },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/projects', label: 'Projects', icon: Folder },
  { href: '/profile', label: 'Profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
    >
      {/* Glass backdrop */}
      <div className="absolute inset-0 glass border-t border-border/60" />

      <div
        className="relative flex items-stretch justify-around px-2 pb-safe"
        style={{ height: 'calc(3.5rem + env(safe-area-inset-bottom))' }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/'
            ? pathname === '/'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 px-1 pt-2 pb-1',
                'text-[10px] font-medium tracking-wide',
                'transition-colors duration-150',
                'min-w-0',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={cn(
                  'flex items-center justify-center size-7 rounded-lg transition-all duration-150',
                  isActive && 'bg-primary/10'
                )}
              >
                <Icon
                  size={20}
                  weight={isActive ? 'fill' : 'regular'}
                />
              </span>
              <span className="truncate w-full text-center">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
