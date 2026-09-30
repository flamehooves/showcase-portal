'use client'

import { Suspense, useState, useMemo, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { MagnifyingGlass, X, FunnelSimple, SlidersHorizontal } from '@phosphor-icons/react'
import type { Platform, ProjectStatus, ProjectCategory } from '@/types'
import { MOCK_PROJECTS } from '@/mock/data/projects'
import { getUserById } from '@/mock/data/users'
import { PROJECT_CATEGORIES, PLATFORMS, PROJECT_STATUSES } from '@/lib/constants'
import { ProjectCard } from '@/components/discovery/ProjectCard'
import { AppShell } from '@/components/layout/AppShell'

const STATUS_ORDER: ProjectStatus[] = ['live', 'beta', 'iterating', 'building', 'concept']

function countByPlatform(platform: Platform) {
  return MOCK_PROJECTS.filter((p) => p.isPublished && p.platforms.includes(platform)).length
}

function countByStatus(status: ProjectStatus) {
  return MOCK_PROJECTS.filter((p) => p.isPublished && p.status === status).length
}

function countByCategory(category: ProjectCategory) {
  return MOCK_PROJECTS.filter((p) => p.isPublished && p.category === category).length
}

function DiscoverContent() {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    (searchParams.get('platform') as Platform) ?? null
  )
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(
    (searchParams.get('status') as ProjectStatus) ?? null
  )
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(
    (searchParams.get('category') as ProjectCategory) ?? null
  )

  const hasActiveFilters = !!(selectedPlatform || selectedStatus || selectedCategory)

  const filteredProjects = useMemo(() => {
    let results = MOCK_PROJECTS.filter((p) => p.isPublished)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.category.includes(q)
      )
    }

    if (selectedPlatform) {
      results = results.filter((p) => p.platforms.includes(selectedPlatform))
    }

    if (selectedStatus) {
      results = results.filter((p) => p.status === selectedStatus)
    }

    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory)
    }

    return results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [searchQuery, selectedPlatform, selectedStatus, selectedCategory])

  function clearAll() {
    startTransition(() => {
      setSearchQuery('')
      setSelectedPlatform(null)
      setSelectedStatus(null)
      setSelectedCategory(null)
    })
  }

  function togglePlatform(p: Platform) {
    startTransition(() => setSelectedPlatform((prev) => (prev === p ? null : p)))
  }

  function toggleStatus(s: ProjectStatus) {
    startTransition(() => setSelectedStatus((prev) => (prev === s ? null : s)))
  }

  function toggleCategory(c: ProjectCategory) {
    startTransition(() => setSelectedCategory((prev) => (prev === c ? null : c)))
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Discover
          </h1>
          <p className="text-muted-foreground mt-1.5">
            {filteredProjects.length === MOCK_PROJECTS.filter((p) => p.isPublished).length
              ? `${filteredProjects.length} projects across ${Object.keys(PROJECT_CATEGORIES).length} categories`
              : `${filteredProjects.length} result${filteredProjects.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <MagnifyingGlass
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
            placeholder="Search by name, category, tag, or keyword…"
            className="w-full bg-card border border-border rounded-2xl pl-11 pr-10 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => startTransition(() => setSearchQuery(''))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Platform filter */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <SlidersHorizontal size={12} />
              Platform
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(PLATFORMS) as [Platform, string][]).map(([key, label]) => {
                const count = countByPlatform(key)
                const active = selectedPlatform === key
                return (
                  <button
                    key={key}
                    onClick={() => togglePlatform(key)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl border transition-all duration-150 ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    {label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      active ? 'bg-white/20' : 'bg-muted text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status filter */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <FunnelSimple size={12} />
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((key) => {
                const status = PROJECT_STATUSES[key]
                const count = countByStatus(key)
                const active = selectedStatus === key
                return (
                  <button
                    key={key}
                    onClick={() => toggleStatus(key)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl border transition-all duration-150 ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        active ? 'bg-white' : key === 'live' ? 'bg-emerald-500' : key === 'beta' ? 'bg-amber-500' : key === 'building' ? 'bg-blue-500' : key === 'iterating' ? 'bg-cyan-500' : 'bg-purple-500'
                      }`}
                    />
                    {status.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      active ? 'bg-white/20' : 'bg-muted text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(PROJECT_CATEGORIES) as [ProjectCategory, string][]).map(([key, label]) => {
                const count = countByCategory(key)
                const active = selectedCategory === key
                return (
                  <button
                    key={key}
                    onClick={() => toggleCategory(key)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl border transition-all duration-150 ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    {label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      active ? 'bg-white/20' : 'bg-muted text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Clear all */}
          {(hasActiveFilters || searchQuery) && (
            <button
              onClick={clearAll}
              className="self-start inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-xl px-3 py-1.5 hover:border-foreground/30"
            >
              <X size={12} />
              Clear all filters
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Results grid */}
        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-muted rounded-2xl mb-3" />
                <div className="h-4 bg-muted rounded-full w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded-full w-full mb-1" />
                <div className="h-3 bg-muted rounded-full w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <MagnifyingGlass size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {searchQuery
                ? `No projects match "${searchQuery}". Try a different search term or adjust your filters.`
                : 'No projects match your current filters. Try clearing some filters to see more results.'}
            </p>
            <button
              onClick={clearAll}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <X size={14} />
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                owner={getUserById(project.ownerId)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default function DiscoverPage() {
  return (
    <Suspense>
      <DiscoverContent />
    </Suspense>
  )
}
