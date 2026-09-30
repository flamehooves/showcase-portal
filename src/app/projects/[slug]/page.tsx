import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Eye, ChatCircle, Heart, CalendarBlank, Tag, ArrowLeft, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { fetchProjectBySlug } from '@/lib/api/projects'
import { fetchComments } from '@/lib/api/comments'
import { fetchUpdates } from '@/lib/api/updates'
import { getUserById } from '@/mock/data/users'
import { MOCK_PROJECTS } from '@/mock/data/projects'
import { ProjectHero } from '@/components/projects/ProjectHero'
import { BuilderCard } from '@/components/projects/BuilderCard'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { CommentSection } from '@/components/comments/CommentSection'
import { MediaGallery } from '@/components/media/MediaGallery'
import { ProjectCard } from '@/components/discovery/ProjectCard'
import { AppShell } from '@/components/layout/AppShell'
import { formatDate } from '@/lib/utils/misc'
import { PROJECT_CATEGORIES } from '@/lib/constants'
import type { User } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return MOCK_PROJECTS.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const project = await fetchProjectBySlug(slug)
  if (!project) return { title: 'Project not found' }
  return {
    title: project.name,
    description: project.tagline,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params

  const project = await fetchProjectBySlug(slug)
  if (!project) notFound()

  const [comments, updates] = await Promise.all([
    fetchComments(project.id),
    fetchUpdates(project.id),
  ])

  // Resolve users synchronously from mock data
  const owner = getUserById(project.ownerId)
  const collaborators = project.collaboratorIds
    .map((id) => getUserById(id))
    .filter((u): u is User => u !== undefined)

  // Build authors map for CommentSection
  const authorIds = [...new Set(comments.map((c) => c.authorId))]
  const authorsMap: Record<string, User> = {}
  for (const id of authorIds) {
    const u = getUserById(id)
    if (u) authorsMap[id] = u
  }

  // Build update authors map
  const updateAuthorIds = [...new Set(updates.map((u) => u.authorId))]
  const updateAuthorsMap: Record<string, User> = {}
  for (const id of updateAuthorIds) {
    const u = getUserById(id)
    if (u) updateAuthorsMap[id] = u
  }

  // Related projects: same category, exclude this project, up to 3
  const related = MOCK_PROJECTS.filter(
    (p) => p.isPublished && p.id !== project.id && p.category === project.category
  ).slice(0, 3)

  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const categoryLabel = PROJECT_CATEGORIES[project.category]

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Discover
          </Link>
          <span>/</span>
          <Link
            href={`/discover?category=${project.category}`}
            className="hover:text-foreground transition-colors capitalize"
          >
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{project.name}</span>
        </div>

        {/* Hero */}
        <ProjectHero
          project={project}
          owner={owner}
          collaborators={collaborators}
        />

        {/* Content grid */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          {/* ── LEFT COLUMN (2/3) ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-14">
            {/* About */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                About
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-base text-muted-foreground leading-[1.8] mb-5 text-pretty">
                  {project.description}
                </p>
                {project.story && project.story !== project.description && (
                  <>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mt-8 mb-3">
                      The story
                    </h3>
                    <p className="text-base text-muted-foreground leading-[1.8] text-pretty">
                      {project.story}
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* Media Gallery */}
            {project.screenshots.length > 0 && (
              <section>
                <MediaGallery screenshots={project.screenshots} />
              </section>
            )}

            {/* Evolution timeline */}
            {sortedUpdates.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">Evolution</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  How this project has grown and changed over time.
                </p>
                <div>
                  {sortedUpdates.map((update, index) => (
                    <TimelineItem
                      key={update.id}
                      update={update}
                      author={updateAuthorsMap[update.authorId]}
                      isLast={index === sortedUpdates.length - 1}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Comments */}
            <section>
              <CommentSection
                projectId={project.id}
                comments={comments}
                authors={authorsMap}
              />
            </section>
          </div>

          {/* ── RIGHT SIDEBAR (1/3) ───────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Builder card */}
            {owner && (
              <BuilderCard owner={owner} collaborators={collaborators} />
            )}

            {/* Quick stats */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Stats
              </h3>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye size={15} />
                    Views
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {project.viewCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Heart size={15} />
                    Reactions
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {project.reactionCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ChatCircle size={15} />
                    Comments
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {project.commentCount.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-border pt-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarBlank size={15} />
                    Created
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
                  <Tag size={12} />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/discover?search=${tag}`}
                      className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors border border-border"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related projects */}
            {related.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    More in {categoryLabel}
                  </h3>
                  <Link
                    href={`/discover?category=${project.category}`}
                    className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    See all <ArrowUpRight size={11} />
                  </Link>
                </div>
                <div className="space-y-4">
                  {related.map((rel) => (
                    <ProjectCard
                      key={rel.id}
                      project={rel}
                      owner={getUserById(rel.ownerId)}
                      compact
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
