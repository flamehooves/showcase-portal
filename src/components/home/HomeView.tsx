'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  House,
  Star,
  TrendUp,
  Sparkle,
  MagnifyingGlass,
  SignOut,
  FolderSimple,
  ShieldCheck,
  Plus,
} from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/auth-store'
import { PROJECT_CATEGORIES } from '@/lib/constants'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { MasonryCard } from './MasonryCard'
import { getInitials } from '@/lib/utils/misc'
import type { Project, User } from '@/types'

type Section = 'all' | 'featured' | 'trending' | 'new'

const STATUSES: { value: string; label: string }[] = [
  { value: 'live', label: 'Live' },
  { value: 'beta', label: 'Beta' },
  { value: 'building', label: 'Building' },
  { value: 'iterating', label: 'Iterating' },
  { value: 'concept', label: 'Concept' },
]

interface HomeViewProps {
  projects: Project[]
  owners: Record<string, User>
}

export function HomeView({ projects, owners }: HomeViewProps) {
  const { user, signOut } = useAuthStore()
  const [section, setSection] = useState<Section>('all')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = [...projects]
    if (section === 'featured') list = list.filter((p) => p.isFeatured)
    if (section === 'trending') list = list.sort((a, b) => b.reactionCount - a.reactionCount).slice(0, 9)
    if (section === 'new') list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 9)
    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (status !== 'all') list = list.filter((p) => p.status === status)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [projects, section, category, status, search])

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(PROJECT_CATEGORIES).map((k) => [k, projects.filter((p) => p.category === k).length])
      ),
    [projects]
  )

  const statusCounts = useMemo(
    () =>
      Object.fromEntries(STATUSES.map(({ value }) => [value, projects.filter((p) => p.status === value).length])),
    [projects]
  )

  const sectionLabel =
    section === 'featured' ? 'Featured' : section === 'trending' ? 'Trending' : section === 'new' ? 'New' : 'All projects'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── SIDEBAR ───────────────────────────────────────────────── */}
      <aside className="w-[220px] shrink-0 flex flex-col border-r border-border bg-card overflow-y-auto">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground tracking-tight">Showcase</span>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full leading-none">
              BETA
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Claude Code Workshop</p>
        </div>

        {/* Search */}
        <div className="px-3 pt-4 pb-2">
          <div className="relative">
            <MagnifyingGlass
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="w-full bg-muted border border-transparent rounded-lg pl-7 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-background transition-all"
            />
          </div>
        </div>

        {/* Browse section */}
        <nav className="px-3 pb-2">
          {(
            [
              { id: 'all' as Section, label: 'All projects', icon: House, count: projects.length },
              { id: 'featured' as Section, label: 'Featured', icon: Star, count: projects.filter((p) => p.isFeatured).length },
              { id: 'trending' as Section, label: 'Trending', icon: TrendUp, count: null },
              { id: 'new' as Section, label: 'New arrivals', icon: Sparkle, count: null },
            ] as const
          ).map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={[
                'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-left',
                section === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              ].join(' ')}
            >
              <Icon size={14} weight={section === id ? 'bold' : 'regular'} />
              <span className="flex-1">{label}</span>
              {count !== null && (
                <span
                  className={[
                    'text-[10px] font-semibold px-1.5 rounded-full leading-5',
                    section === id ? 'bg-white/20 text-white' : 'bg-background text-muted-foreground',
                  ].join(' ')}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Categories */}
        <div className="px-3 pt-3 pb-2 border-t border-border">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2.5 mb-2">
            Category
          </p>
          <SidebarFilter value="all" active={category === 'all'} count={projects.length} onClick={() => setCategory('all')}>
            All categories
          </SidebarFilter>
          {(Object.entries(PROJECT_CATEGORIES) as [string, string][]).map(([key, label]) => (
            <SidebarFilter
              key={key}
              value={key}
              active={category === key}
              count={categoryCounts[key] ?? 0}
              onClick={() => setCategory(key)}
            >
              {label}
            </SidebarFilter>
          ))}
        </div>

        {/* Status */}
        <div className="px-3 pt-3 pb-2 border-t border-border">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2.5 mb-2">
            Status
          </p>
          <SidebarFilter value="all" active={status === 'all'} count={projects.length} onClick={() => setStatus('all')}>
            All
          </SidebarFilter>
          {STATUSES.map(({ value, label }) => (
            <SidebarFilter
              key={value}
              value={value}
              active={status === value}
              count={statusCounts[value] ?? 0}
              onClick={() => setStatus(value)}
            >
              {label}
            </SidebarFilter>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom: auth + theme */}
        <div className="border-t border-border p-3 space-y-0.5">
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-[10px] text-muted-foreground">Theme</span>
            <ThemeToggle className="size-7 rounded-md" />
          </div>

          {user ? (
            <>
              {user.isWorkshopParticipant && (
                <Link
                  href="/my-projects"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <FolderSimple size={13} />
                  My Projects
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ShieldCheck size={13} />
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 px-2.5 py-2 mt-1 rounded-lg">
                {user.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={user.avatarUrl} alt={user.name} className="size-6 rounded-full object-cover ring-1 ring-border shrink-0" />
                ) : (
                  <span className="size-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                    {getInitials(user.name)}
                  </span>
                )}
                <span className="flex-1 text-xs font-medium text-foreground truncate">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={signOut}
                  aria-label="Sign out"
                  className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                >
                  <SignOut size={13} />
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/signin"
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </aside>

      {/* ── MAIN ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* Sticky topbar */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-tight">
              {sectionLabel}
              {category !== 'all' && (
                <span className="text-muted-foreground font-normal">
                  {' '}· {PROJECT_CATEGORIES[category as keyof typeof PROJECT_CATEGORIES]}
                </span>
              )}
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
            </p>
          </div>

          {user?.isWorkshopParticipant && (
            <Link
              href="/projects/new"
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shrink-0"
            >
              <Plus size={12} weight="bold" />
              New project
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="p-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
              <p className="text-muted-foreground text-sm font-medium">No projects found</p>
              <p className="text-muted-foreground text-xs">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
              {filtered.map((project) => (
                <div key={project.id} className="break-inside-avoid mb-5">
                  <MasonryCard project={project} owner={owners[project.ownerId]} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function SidebarFilter({
  active,
  count,
  onClick,
  children,
}: {
  value: string
  active: boolean
  count: number
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left gap-2',
        active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted',
      ].join(' ')}
    >
      <span className="truncate">{children}</span>
      <span className="text-[10px] tabular-nums shrink-0 text-muted-foreground">{count}</span>
    </button>
  )
}
