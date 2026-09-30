'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowSquareOut, Star, Flag, Rocket, Camera, Play, Wrench, Megaphone, CheckCircle, Lightbulb } from '@phosphor-icons/react'
import type { ProjectUpdate, User } from '@/types'
import { UPDATE_TYPES } from '@/lib/constants'
import { formatDate, getInitials } from '@/lib/utils/misc'

const UPDATE_ICONS = {
  milestone: Star,
  feature: Rocket,
  release: Flag,
  screenshot: Camera,
  demo: Play,
  iteration: Wrench,
  announcement: Megaphone,
  progress: CheckCircle,
  reflection: Lightbulb,
}

const UPDATE_COLORS = {
  milestone: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
  feature: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
  release: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  screenshot: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30',
  demo: 'text-pink-500 bg-pink-50 dark:bg-pink-950/30',
  iteration: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30',
  announcement: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30',
  progress: 'text-slate-500 bg-slate-50 dark:bg-slate-950/30',
  reflection: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30',
}

interface TimelineItemProps {
  update: ProjectUpdate
  author?: User
  isLast?: boolean
}

export function TimelineItem({ update, author, isLast = false }: TimelineItemProps) {
  const Icon = UPDATE_ICONS[update.type]
  const colorClass = UPDATE_COLORS[update.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-4 md:gap-6"
    >
      {/* Timeline rail */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center ${colorClass} ${
            update.isMilestone ? 'ring-2 ring-offset-2 ring-amber-300 dark:ring-amber-600' : ''
          }`}
        >
          <Icon size={18} weight={update.isMilestone ? 'fill' : 'regular'} />
        </div>
        {!isLast && <div className="w-px flex-1 mt-2 bg-border min-h-[2rem]" />}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${isLast ? '' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-text-muted">
                {UPDATE_TYPES[update.type]}
              </span>
              {update.isMilestone && (
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                  Milestone
                </span>
              )}
            </div>
            <h3 className="font-semibold text-text-primary text-base md:text-lg leading-snug">
              {update.title}
            </h3>
          </div>
          <span className="text-xs text-text-muted flex-shrink-0 mt-1">
            {formatDate(update.createdAt)}
          </span>
        </div>

        {/* Author */}
        {author && (
          <div className="flex items-center gap-2 mb-3">
            {author.avatarUrl ? (
              <Image src={author.avatarUrl} alt={author.name} width={18} height={18} className="rounded-full" />
            ) : (
              <div className="w-4.5 h-4.5 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-[8px] font-bold text-accent">{getInitials(author.name)}</span>
              </div>
            )}
            <span className="text-xs text-text-muted">{author.name}</span>
          </div>
        )}

        {/* Body */}
        <p className="text-sm text-text-secondary leading-relaxed mb-4">{update.body}</p>

        {/* Media */}
        {update.media.length > 0 && (
          <div className={`grid gap-2 mb-4 ${update.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {update.media.map((m, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-surface-elevated">
                <Image
                  src={m.url}
                  alt={m.caption || `Media ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {m.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 p-2">
                    <p className="text-white text-xs">{m.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* External link */}
        {update.externalUrl && (
          <a
            href={update.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowSquareOut size={14} />
            View update
          </a>
        )}
      </div>
    </motion.div>
  )
}
