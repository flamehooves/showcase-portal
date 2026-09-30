'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  PencilSimple,
  Eye,
  ArrowSquareOut,
  FolderSimple,
  LockSimple,
  Globe,
} from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/auth-store'
import { MOCK_PROJECTS } from '@/mock/data/projects'
import { publishProject, unpublishProject } from '@/lib/api/projects'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PlatformBadge } from '@/components/ui/PlatformBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { AppShell } from '@/components/layout/AppShell'
import { formatRelativeDate } from '@/lib/utils/misc'
import type { Project } from '@/types'

type Tab = 'all' | 'published' | 'drafts'

export default function MyProjectsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
      return unsub
    }
  }, [])

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/signin')
    }
  }, [hydrated, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setProjects(MOCK_PROJECTS.filter((p) => p.ownerId === user.id))
    }
  }, [user])

  const filtered = useMemo(() => {
    if (activeTab === 'published') return projects.filter((p) => p.isPublished)
    if (activeTab === 'drafts') return projects.filter((p) => !p.isPublished)
    return projects
  }, [projects, activeTab])

  async function handleTogglePublish(project: Project) {
    setLoadingId(project.id)
    try {
      const updated = project.isPublished
        ? await unpublishProject(project.id)
        : await publishProject(project.id)
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    } finally {
      setLoadingId(null)
    }
  }

  if (!hydrated || !isAuthenticated || !user) return null

  if (!user.isWorkshopParticipant && user.role !== 'admin') {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <LockSimple size={24} weight="light" className="text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Workshop participant access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You need to be a workshop participant to manage projects. If you think this is a mistake, reach out to the workshop organizers.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </AppShell>
    )
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: projects.length },
    { id: 'published', label: 'Published', count: projects.filter((p) => p.isPublished).length },
    { id: 'drafts', label: 'Drafts', count: projects.filter((p) => !p.isPublished).length },
  ]

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">My Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your workshop submissions.
            </p>
          </div>
          <Link
            href="/projects/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            <Plus size={16} weight="bold" />
            New Project
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
              ].join(' ')}
            >
              {tab.label}
              <span
                className={[
                  'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-medium min-w-[20px]',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Project list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={FolderSimple}
            title={
              activeTab === 'published'
                ? 'No published projects'
                : activeTab === 'drafts'
                ? 'No drafts'
                : 'No projects yet'
            }
            description={
              activeTab === 'all'
                ? 'Create your first project to get started.'
                : activeTab === 'published'
                ? 'Publish a project so others can discover it.'
                : 'Projects saved as drafts will appear here.'
            }
            action={
              activeTab === 'all'
                ? { label: 'Create project', onClick: () => router.push('/projects/new') }
                : undefined
            }
          />
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Platform
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((project) => (
                  <tr key={project.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {project.coverImage && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={project.coverImage}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{project.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {project.tagline}
                          </p>
                          {/* Inline status for mobile */}
                          <div className="mt-1 flex gap-1.5 sm:hidden">
                            <StatusBadge status={project.status} size="sm" />
                            {!project.isPublished && (
                              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={project.status} size="sm" />
                        {!project.isPublished && (
                          <span className="inline-flex w-fit items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                            Draft
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.platforms.map((p) => (
                          <PlatformBadge key={p} platform={p} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                      {formatRelativeDate(project.updatedAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <Link
                          href={`/projects/${project.slug}/edit`}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          title="Edit"
                        >
                          <PencilSimple size={14} />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>

                        {/* View */}
                        <Link
                          href={`/projects/${project.slug}`}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                          <span className="hidden sm:inline">View</span>
                        </Link>

                        {/* Publish / Unpublish */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(project)}
                          disabled={loadingId === project.id}
                          title={project.isPublished ? 'Unpublish' : 'Publish'}
                          className={[
                            'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50',
                            project.isPublished
                              ? 'text-muted-foreground hover:text-foreground hover:bg-accent'
                              : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30',
                          ].join(' ')}
                        >
                          {project.isPublished ? (
                            <>
                              <LockSimple size={14} />
                              <span className="hidden sm:inline">Unpublish</span>
                            </>
                          ) : (
                            <>
                              <Globe size={14} />
                              <span className="hidden sm:inline">Publish</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  )
}
