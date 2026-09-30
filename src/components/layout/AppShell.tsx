'use client'

import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop side-fixed nav (hidden on mobile) */}
      <DesktopNav />

      {/* Main content — offset for desktop nav top bar (h-16) and mobile bottom nav */}
      <main
        className="
          w-full
          pt-0 md:pt-16
          pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0
        "
      >
        {children}
      </main>

      {/* Mobile bottom nav (hidden on desktop) */}
      <MobileNav />
    </div>
  )
}
