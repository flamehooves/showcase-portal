'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChatCircle, Heart } from '@phosphor-icons/react'
import type { Project, User } from '@/types'
import { PROJECT_STATUSES, PLATFORMS } from '@/lib/constants'
import { formatRelativeDate } from '@/lib/utils/misc'
import { getInitials } from '@/lib/utils/misc'

interface ProjectCardProps {
  project: Project
  owner?: User
  featured?: boolean
  compact?: boolean
}

export function ProjectCard({ project, owner, featured = false, compact = false }: ProjectCardProps) {
  const status = PROJECT_STATUSES[project.status]

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group relative"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div
          className={`bg-surface border border-border rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 ${
            featured ? 'ring-1 ring-primary/20' : ''
          }`}
        >
          {/* Cover image */}
          <div className={`relative overflow-hidden bg-muted ${compact ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5" />
            )}

            {/* Featured indicator */}
            {featured && (
              <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                Featured
              </div>
            )}

            {/* Status badge */}
            <div className="absolute top-3 right-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Platform pills */}
            <div className="absolute bottom-3 left-3 flex gap-1">
              {project.platforms.slice(0, 3).map((p) => (
                <span
                  key={p}
                  className="text-xs bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm"
                >
                  {PLATFORMS[p]}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className={`${compact ? 'p-4' : 'p-5'}`}>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                {project.name}
              </h3>
              <ArrowUpRight
                size={16}
                weight="bold"
                className="text-text-muted group-hover:text-primary transition-colors flex-shrink-0 mt-0.5"
              />
            </div>

            <p className={`text-text-secondary text-sm leading-relaxed line-clamp-2 ${compact ? 'mb-3' : 'mb-4'}`}>
              {project.tagline}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Owner */}
              {owner && (
                <div className="flex items-center gap-2">
                  {owner.avatarUrl ? (
                    <Image
                      src={owner.avatarUrl}
                      alt={owner.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-primary">{getInitials(owner.name)}</span>
                    </div>
                  )}
                  <span className="text-xs text-text-muted">{owner.name.split(' ')[0]}</span>
                </div>
              )}

              {/* Engagement */}
              <div className="flex items-center gap-3 text-text-muted">
                <span className="flex items-center gap-1 text-xs">
                  <Heart size={12} />
                  {project.reactionCount}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <ChatCircle size={12} />
                  {project.commentCount}
                </span>
                <span className="text-xs">{formatRelativeDate(project.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
