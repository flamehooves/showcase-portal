'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Star,
  X,
  FolderSimple,
  Users,
  GraduationCap,
  Check,
} from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/auth-store'
import { MOCK_PROJECTS } from '@/mock/data/projects'
import { MOCK_USERS } from '@/mock/data/users'
import { MOCK_COLLECTIONS } from '@/mock/data/collections'
import { AppShell } from '@/components/layout/AppShell'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Project, User, Collection } from '@/types'

export default function AdminPage() {
  const router = useRouter()
  const currentUser = useAuthStore((s) => s.user)
  const [hydrated, setHydrated] = useState(false)

  // Local state for featured project ids
  const [featuredIds, setFeaturedIds] = useState<string[]>(
    MOCK_PROJECTS.filter((p) => p.isFeatured && p.isPublished).map((p) => p.id)
  )

  // Local state for participant toggles
  const [participants, setParticipants] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCK_USERS.map((u) => [u.id, u.isWorkshopParticipant]))
  )

  // Selected project to add to featured
  const [addFeaturedId, setAddFeaturedId] = useState('')

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
      return unsub
    }
  }, [])

  useEffect(() => {
    if (hydrated && currentUser && currentUser.role !== 'admin') {
      router.replace('/')
    }
  }, [hydrated, currentUser, router])

  if (!hydrated || !currentUser || currentUser.role !== 'admin') return null

  const publishedProjects = MOCK_PROJECTS.filter((p) => p.isPublished)
  const featuredProjects = publishedProjects.filter((p) => featuredIds.includes(p.id))
  const unfeaturedProjects = publishedProjects.filter((p) => !featuredIds.includes(p.id))

  function removeFromFeatured(id: string) {
    setFeaturedIds((prev) => prev.filter((fid) => fid !== id))
  }

  function addToFeatured() {
    if (!addFeaturedId || featuredIds.includes(addFeaturedId)) return
    setFeaturedIds((prev) => [...prev, addFeaturedId])
    setAddFeaturedId('')
  }

  function toggleParticipant(userId: string) {
    setParticipants((prev) => ({ ...prev, [userId]: !prev[userId] }))
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Curation & Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage featured projects, collections, and participant access.
          </p>
        </div>

        <div className="space-y-8">
          {/* Featured Projects */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/40">
              <Star size={16} weight="fill" className="text-amber-500" />
              <h2 className="text-sm font-semibold text-foreground">Featured Projects</h2>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {featuredIds.length} featured
              </span>
            </div>

            {/* Currently featured list */}
            {featuredProjects.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No projects are currently featured.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {featuredProjects.map((project) => (
                  <li key={project.id} className="flex items-center gap-3 px-5 py-3">
                    {project.coverImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={project.coverImage}
                        alt=""
                        className="h-9 w-14 rounded-md object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block"
                      >
                        {project.name}
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">{project.tagline}</p>
                    </div>
                    <StatusBadge status={project.status} size="sm" />
                    <button
                      type="button"
                      onClick={() => removeFromFeatured(project.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      aria-label={`Remove ${project.name} from featured`}
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Add to featured */}
            {unfeaturedProjects.length > 0 && (
              <div className="flex items-center gap-2 px-5 py-3 border-t border-border bg-muted/20">
                <Star size={14} className="text-muted-foreground shrink-0" />
                <select
                  value={addFeaturedId}
                  onChange={(e) => setAddFeaturedId(e.target.value)}
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a project to feature…</option>
                  {unfeaturedProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addToFeatured}
                  disabled={!addFeaturedId}
                  className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
                >
                  <Check size={13} weight="bold" />
                  Add
                </button>
              </div>
            )}
          </section>

          {/* Collections */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/40">
              <FolderSimple size={16} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Collections</h2>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {MOCK_COLLECTIONS.length}
              </span>
            </div>

            {MOCK_COLLECTIONS.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No collections yet.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {MOCK_COLLECTIONS.map((collection: Collection) => (
                  <li key={collection.id} className="flex items-center gap-4 px-5 py-3">
                    {collection.coverImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={collection.coverImage}
                        alt=""
                        className="h-9 w-14 rounded-md object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{collection.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{collection.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {collection.projectIds.length} project{collection.projectIds.length !== 1 ? 's' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Participant Eligibility */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/40">
              <Users size={16} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Participant Eligibility</h2>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {Object.values(participants).filter(Boolean).length} of {MOCK_USERS.length}
              </span>
            </div>

            <ul className="divide-y divide-border">
              {MOCK_USERS.map((user: User) => {
                const isParticipant = participants[user.id] ?? false
                return (
                  <li key={user.id} className="flex items-center gap-3 px-5 py-3">
                    {user.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.team}</p>
                    </div>

                    <span
                      className={[
                        'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                        user.role === 'admin'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground',
                      ].join(' ')}
                    >
                      {user.role}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleParticipant(user.id)}
                      disabled={user.role === 'admin'}
                      aria-label={`${isParticipant ? 'Remove' : 'Grant'} participant access for ${user.name}`}
                      title={
                        user.role === 'admin'
                          ? 'Admins always have participant access'
                          : isParticipant
                          ? 'Revoke participant access'
                          : 'Grant participant access'
                      }
                      className={[
                        'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                        isParticipant || user.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                      ].join(' ')}
                    >
                      <GraduationCap size={13} weight={isParticipant || user.role === 'admin' ? 'fill' : 'regular'} />
                      {isParticipant || user.role === 'admin' ? 'Participant' : 'Not participant'}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
