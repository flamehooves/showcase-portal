import type { ProjectStatus } from '@/types'
import { PROJECT_STATUSES } from '@/lib/constants'

interface StatusBadgeProps {
  status: ProjectStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { label, color } = PROJECT_STATUSES[status]

  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-medium',
        color,
        size === 'sm'
          ? 'px-2 py-0.5 text-[11px] leading-4'
          : 'px-2.5 py-1 text-xs',
      ].join(' ')}
    >
      {label}
    </span>
  )
}
