import Link from 'next/link'
import Image from 'next/image'
import { Heart, Eye } from '@phosphor-icons/react/dist/ssr'
import type { Project, User } from '@/types'
import { getInitials } from '@/lib/utils/misc'
import { PROJECT_CATEGORIES } from '@/lib/constants'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface MasonryCardProps {
  project: Project
  owner?: User
}

export function MasonryCard({ project, owner }: MasonryCardProps) {
  const categoryLabel = PROJECT_CATEGORIES[project.category as keyof typeof PROJECT_CATEGORIES] ?? project.category

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary/20">{project.name[0]}</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
            {categoryLabel}
          </span>
          <StatusBadge status={project.status} size="sm" />
        </div>

        {/* Stats on hover */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-full">
            <Heart size={9} weight="fill" />
            {project.reactionCount}
          </span>
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-full">
            <Eye size={9} />
            {project.viewCount}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center gap-2.5">
        {owner?.avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={owner.avatarUrl}
            alt={owner.name}
            className="size-6 rounded-full object-cover shrink-0 ring-1 ring-border"
          />
        ) : (
          <span className="size-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
            {owner ? getInitials(owner.name) : '?'}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-150">
            {project.name}
          </p>
          <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
            {project.tagline}
          </p>
        </div>
      </div>
    </Link>
  )
}
