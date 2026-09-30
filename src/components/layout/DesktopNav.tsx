'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  House,
  Compass,
  Folder,
  User,
  SignOut,
  CaretDown,
  Users,
  ShieldCheck,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: House },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/projects', label: 'Projects', icon: Folder },
]

export function DesktopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, switchPersona } = useAuthStore()

  return (
    <header className="fixed inset-x-0 top-0 z-40 hidden md:block h-16">
      {/* Glass background */}
      <div className="absolute inset-0 glass border-b border-border/60" />

      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
        >
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground group-hover:text-primary transition-colors duration-150">
            Showcase
          </span>
          <span className="hidden lg:inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
            Beta
          </span>
        </Link>

        {/* Primary nav links */}
        <nav className="flex items-center gap-1" aria-label="Primary navigation">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/'
              ? pathname === '/'
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon
                  size={16}
                  weight={isActive ? 'fill' : 'regular'}
                />
                {label}
              </Link>
            )
          })}

          {/* Conditional nav items */}
          {user?.isWorkshopParticipant && (
            <Link
              href="/my-projects"
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                pathname.startsWith('/my-projects')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Folder
                size={16}
                weight={pathname.startsWith('/my-projects') ? 'fill' : 'regular'}
              />
              My Projects
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                pathname.startsWith('/admin')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <ShieldCheck
                size={16}
                weight={pathname.startsWith('/admin') ? 'fill' : 'regular'}
              />
              Admin
            </Link>
          )}
        </nav>

        {/* Right slot: theme toggle + user menu */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label="User menu"
              >
                {user.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="size-7 rounded-full object-cover ring-2 ring-border"
                  />
                ) : (
                  <span className="size-7 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-xs">
                    {user.name.charAt(0)}
                  </span>
                )}
                <span className="hidden lg:block max-w-[120px] truncate text-foreground">
                  {user.name.split(' ')[0]}
                </span>
                <CaretDown size={14} className="text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col gap-0.5 pb-2">
                    <span className="font-medium text-foreground text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground font-normal truncate">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push(`/profile/${user.id}`)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User size={15} />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {process.env.NODE_ENV === 'development' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => switchPersona('u9')}
                        className="flex items-center gap-2 cursor-pointer text-muted-foreground"
                      >
                        <Users size={15} />
                        Switch to Admin
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={signOut}
                    variant="destructive"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <SignOut size={15} />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
