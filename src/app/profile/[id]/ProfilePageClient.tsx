'use client'

import { use } from 'react'
import Link from 'next/link'
import {
  PencilSimple,
  Buildings,
  GraduationCap,
  Heart,
  ChatCircle,
  Eye,
  FolderOpen,
} from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/auth-store'
import { getUserById } from '@/mock/data/users'
import { MOCK_PROJECTS } from '@/mock/data/projects'
import { AppShell } from '@/components/layout/AppShell'
import { ProjectCard } from '@/components/discovery/ProjectCard'
import { getInitials } from '@/lib/utils/misc'

export function ProfilePageClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const currentUser = useAuthStore((s) => s.user)

  const profileUser = getUserById(id)

  if (!profileUser) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <h1 className="text-xl font-semibold text-foreground">User not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This profile doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </AppShell>
    )
  }

  const isOwnProfile = currentUser?.id === profileUser.id

  const userProjects = MOCK_PROJECTS.filter(
    (p) => p.ownerId === profileUser.id && p.isPublished
  )

  const totalReactions = userProjects.reduce((sum, p) => sum + p.reactionCount, 0)
  const totalComments = userProjects.reduce((sum, p) => sum + p.commentCount, 0)
  const totalViews = userProjects.reduce((sum, p) => sum + p.viewCount, 0)

  const roleLabel =
    profileUser.role === 'admin'
      ? 'Admin'
      : profileUser.role === 'participant'
      ? 'Participant'
      : 'Employee'

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Profile header */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-start mb-10">
          {/* Avatar */}
          <div className="shrink-0">
            {profileUser.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profileUser.avatarUrl}
                alt={profileUser.name}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-border"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-border">
                <span className="text-2xl font-semibold text-primary">
                  {getInitials(profileUser.name)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {profileUser.name}
              </h1>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {roleLabel}
                </span>

                {profileUser.isWorkshopParticipant && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <GraduationCap size={11} weight="fill" />
                    Workshop
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
              <Buildings size={14} />
              <span>{profileUser.team}</span>
            </div>

            {profileUser.bio && (
              <p className="text-sm text-foreground/80 leading-relaxed max-w-lg">
                {profileUser.bio}
              </p>
            )}
          </div>

          {/* Edit button */}
          {isOwnProfile && (
            <div className="shrink-0">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                aria-label="Edit profile (coming soon)"
                disabled
                title="Profile editing coming soon"
              >
                <PencilSimple size={14} />
                Edit profile
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-10">
          {[
            { label: 'Projects', value: userProjects.length, icon: FolderOpen },
            { label: 'Views', value: totalViews, icon: Eye },
            { label: 'Reactions', value: totalReactions, icon: Heart },
            { label: 'Comments', value: totalComments, icon: ChatCircle },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 gap-1"
            >
              <Icon size={18} weight="light" className="text-muted-foreground mb-0.5" />
              <span className="text-2xl font-semibold tabular-nums text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">
            {isOwnProfile ? 'Your projects' : `${profileUser.name.split(' ')[0]}'s projects`}
          </h2>

          {userProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <FolderOpen size={28} weight="light" className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">No published projects</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isOwnProfile
                  ? 'Create and publish your first project.'
                  : `${profileUser.name.split(' ')[0]} hasn't published any projects yet.`}
              </p>
              {isOwnProfile && (
                <Link
                  href="/projects/new"
                  className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Create project
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {userProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  owner={profileUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
