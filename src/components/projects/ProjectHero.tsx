'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowSquareOut, DeviceMobile, AndroidLogo, Globe, Share, Heart } from '@phosphor-icons/react'
import type { Project, User } from '@/types'
import { PROJECT_STATUSES, PLATFORMS } from '@/lib/constants'
import { formatRelativeDate } from '@/lib/utils/misc'

interface ProjectHeroProps {
  project: Project
  owner?: User
  collaborators?: User[]
  isReacted?: boolean
  onReact?: () => void
}

export function ProjectHero({ project, owner, collaborators = [], isReacted, onReact }: ProjectHeroProps) {
  const status = PROJECT_STATUSES[project.status]

  return (
    <div className="relative">
      {/* Hero image */}
      <div className="relative aspect-[16/7] md:aspect-[16/6] rounded-2xl md:rounded-3xl overflow-hidden bg-surface-elevated">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      </div>

      {/* Project info card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 md:mt-8"
      >
        {/* Status + platforms row */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
          {project.platforms.map((p) => (
            <span
              key={p}
              className="text-xs text-text-secondary bg-surface border border-border px-2.5 py-1 rounded-full"
            >
              {PLATFORMS[p]}
            </span>
          ))}
          <span className="text-xs text-text-muted ml-auto">
            Updated {formatRelativeDate(project.updatedAt)}
          </span>
        </div>

        {/* Title + tagline */}
        <h1 className="text-3xl md:text-5xl font-bold text-text-primary leading-tight mb-3">
          {project.name}
        </h1>
        <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-3xl mb-6">
          {project.tagline}
        </p>

        {/* Action row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Primary CTA */}
          {project.webUrl && (
            <a
              href={project.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Globe size={18} weight="bold" />
              Open Project
              <ArrowSquareOut size={16} />
            </a>
          )}

          {/* App Store */}
          {project.appStoreUrl && (
            <a
              href={project.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-surface border border-border text-text-primary font-medium px-4 py-2.5 rounded-xl hover:bg-surface-elevated transition-colors"
            >
              <DeviceMobile size={18} />
              App Store
              <ArrowSquareOut size={14} className="text-text-muted" />
            </a>
          )}

          {/* Play Store */}
          {project.playStoreUrl && (
            <a
              href={project.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-surface border border-border text-text-primary font-medium px-4 py-2.5 rounded-xl hover:bg-surface-elevated transition-colors"
            >
              <AndroidLogo size={18} />
              Play Store
              <ArrowSquareOut size={14} className="text-text-muted" />
            </a>
          )}

          {/* Reaction */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onReact}
            className={`inline-flex items-center gap-2 border px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ml-auto ${
              isReacted
                ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400'
                : 'bg-surface border-border text-text-secondary hover:border-red-200 hover:text-red-500'
            }`}
          >
            <Heart size={18} weight={isReacted ? 'fill' : 'regular'} />
            {project.reactionCount}
          </motion.button>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-text-muted bg-surface border border-border px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
