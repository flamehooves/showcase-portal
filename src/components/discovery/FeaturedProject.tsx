'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Globe, DeviceMobile, AndroidLogo } from '@phosphor-icons/react'
import type { Project, User } from '@/types'
import { PROJECT_STATUSES } from '@/lib/constants'
import { formatRelativeDate } from '@/lib/utils/misc'

interface FeaturedProjectProps {
  project: Project
  owner?: User
}

const platformIcons = {
  web: Globe,
  ios: DeviceMobile,
  android: AndroidLogo,
  'cross-platform': DeviceMobile,
}

export function FeaturedProject({ project, owner }: FeaturedProjectProps) {
  const status = PROJECT_STATUSES[project.status]

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="relative rounded-3xl overflow-hidden bg-surface border border-border hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300">
          {/* Large hero image */}
          <div className="relative aspect-[16/8] md:aspect-[16/7]">
            {project.coverImage && (
              <Image
                src={project.coverImage}
                alt={project.name}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              {/* Featured badge */}
              <div className="mb-4">
                <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                  Featured
                </span>
              </div>

              <div className="flex items-end justify-between gap-6">
                <div className="flex-1 min-w-0">
                  {/* Status + platforms */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                    {project.platforms.map((p) => {
                      const Icon = platformIcons[p]
                      return (
                        <span
                          key={p}
                          className="flex items-center gap-1 text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm"
                        >
                          <Icon size={11} />
                          {p === 'cross-platform' ? 'Multi' : p.charAt(0).toUpperCase() + p.slice(1)}
                        </span>
                      )
                    })}
                  </div>

                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    {project.name}
                  </h2>
                  <p className="text-white/80 text-base md:text-lg max-w-2xl line-clamp-2">
                    {project.tagline}
                  </p>
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                  {owner && (
                    <div className="text-right">
                      <p className="text-white/50 text-xs">by</p>
                      <p className="text-white text-sm font-medium">{owner.name}</p>
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <ArrowUpRight size={20} weight="bold" className="text-white" />
                  </div>
                </div>
              </div>

              {/* Mobile engagement */}
              <div className="flex items-center gap-4 mt-4 md:hidden">
                {owner && (
                  <span className="text-white/60 text-xs">by {owner.name}</span>
                )}
                <span className="text-white/50 text-xs ml-auto">
                  {formatRelativeDate(project.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
