/** Shared shimmer base */
function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={[
        'animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800',
        className,
      ].join(' ')}
      aria-hidden="true"
    />
  )
}

/** Matches a ProjectCard: cover image + meta */
export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {/* Cover */}
      <Shimmer className="h-44 w-full rounded-none" />

      <div className="p-4 space-y-3">
        {/* Status + platform row */}
        <div className="flex items-center gap-2">
          <Shimmer className="h-5 w-14" />
          <Shimmer className="h-5 w-12" />
        </div>

        {/* Title */}
        <Shimmer className="h-5 w-3/4" />

        {/* Tagline */}
        <div className="space-y-1.5">
          <Shimmer className="h-3.5 w-full" />
          <Shimmer className="h-3.5 w-2/3" />
        </div>

        {/* Avatar + stats row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Shimmer className="h-7 w-7 rounded-full" />
            <Shimmer className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-3">
            <Shimmer className="h-3 w-8" />
            <Shimmer className="h-3 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Full-width hero skeleton for a project detail page */
export function ProjectHeroSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero image */}
      <Shimmer className="h-72 w-full rounded-2xl md:h-96" />

      <div className="space-y-4">
        {/* Status + platform badges */}
        <div className="flex items-center gap-2">
          <Shimmer className="h-6 w-16" />
          <Shimmer className="h-6 w-14" />
          <Shimmer className="h-6 w-20" />
        </div>

        {/* Title */}
        <Shimmer className="h-8 w-2/3" />

        {/* Tagline */}
        <Shimmer className="h-5 w-1/2" />

        {/* Description lines */}
        <div className="space-y-2 pt-1">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-4/5" />
        </div>

        {/* Owner row */}
        <div className="flex items-center gap-3 pt-2">
          <Shimmer className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Shimmer className="h-3.5 w-28" />
            <Shimmer className="h-3 w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Single timeline entry skeleton */
export function TimelineItemSkeleton() {
  return (
    <div className="flex gap-4">
      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <Shimmer className="h-3 w-3 rounded-full" />
        <div className="mt-2 flex-1 w-px bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="flex-1 pb-6 space-y-2">
        {/* Type + date */}
        <div className="flex items-center gap-2">
          <Shimmer className="h-5 w-20" />
          <Shimmer className="h-3.5 w-16" />
        </div>

        {/* Title */}
        <Shimmer className="h-4 w-3/5" />

        {/* Body */}
        <div className="space-y-1.5 pt-1">
          <Shimmer className="h-3.5 w-full" />
          <Shimmer className="h-3.5 w-4/5" />
        </div>
      </div>
    </div>
  )
}

/** Single comment skeleton */
export function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Shimmer className="h-8 w-8 shrink-0 rounded-full" />

      <div className="flex-1 space-y-2">
        {/* Author + date */}
        <div className="flex items-center gap-2">
          <Shimmer className="h-3.5 w-24" />
          <Shimmer className="h-3 w-14" />
        </div>

        {/* Comment body */}
        <div className="space-y-1.5">
          <Shimmer className="h-3.5 w-full" />
          <Shimmer className="h-3.5 w-3/4" />
        </div>
      </div>
    </div>
  )
}
