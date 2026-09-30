import { AppShell } from '@/components/layout/AppShell'

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-muted ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}

export default function ProjectLoading() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Hero image skeleton */}
        <Skeleton className="w-full aspect-[16/7] md:aspect-[16/6] rounded-2xl md:rounded-3xl mb-6" />

        {/* Hero info skeleton */}
        <div className="mt-6 md:mt-8 mb-12 md:mb-16">
          {/* Status + platforms */}
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Title */}
          <Skeleton className="h-10 w-2/3 mb-3" />
          <Skeleton className="h-10 w-1/2 mb-6" />

          {/* Tagline */}
          <Skeleton className="h-6 w-full max-w-2xl mb-2" />
          <Skeleton className="h-6 w-3/4 max-w-xl mb-8" />

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
            <Skeleton className="h-11 w-20 rounded-xl ml-auto" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-16 rounded-full" />
            ))}
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-12">
            {/* About section */}
            <div>
              <Skeleton className="h-7 w-24 mb-6" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* Media gallery skeleton */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-xl" />
                ))}
              </div>
            </div>

            {/* Timeline skeleton */}
            <div>
              <Skeleton className="h-7 w-28 mb-2" />
              <Skeleton className="h-4 w-64 mb-8" />
              <div className="space-y-10">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                      {i < 2 && <div className="w-px flex-1 mt-2 bg-muted min-h-[60px]" />}
                    </div>
                    <div className="flex-1 pb-8">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-2/3 mb-3" />
                      <Skeleton className="h-4 w-full mb-1.5" />
                      <Skeleton className="h-4 w-5/6 mb-1.5" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments skeleton */}
            <div>
              <Skeleton className="h-5 w-32 mb-8" />
              <div className="space-y-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="border border-border rounded-2xl rounded-tl-md p-4">
                        <Skeleton className="h-4 w-28 mb-3" />
                        <Skeleton className="h-3.5 w-full mb-1.5" />
                        <Skeleton className="h-3.5 w-4/5" />
                      </div>
                      <Skeleton className="h-3 w-16 mt-2 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Builder card skeleton */}
            <div className="border border-border rounded-2xl p-6">
              <Skeleton className="h-3 w-16 mb-5" />
              <div className="flex items-center gap-4 mb-5">
                <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3.5 w-full mb-1" />
                  <Skeleton className="h-3.5 w-3/4" />
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <Skeleton className="h-3 w-20 mb-3" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="border border-border rounded-2xl p-5">
              <Skeleton className="h-3 w-12 mb-4" />
              <div className="space-y-3.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`flex items-center justify-between ${i === 3 ? 'border-t border-border pt-3.5' : ''}`}>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tags skeleton */}
            <div className="border border-border rounded-2xl p-5">
              <Skeleton className="h-3 w-10 mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>

            {/* Related projects skeleton */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="border border-border rounded-2xl overflow-hidden">
                    <Skeleton className="aspect-[16/9] w-full" />
                    <div className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3.5 w-full mb-1" />
                      <Skeleton className="h-3.5 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
