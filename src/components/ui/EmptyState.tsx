import type { ComponentType } from 'react'

interface EmptyStateProps {
  icon: ComponentType<{ size?: number; weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'; className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
        <Icon
          size={28}
          weight="light"
          className="text-neutral-400 dark:text-neutral-500"
        />
      </div>

      <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </h3>

      <p className="mt-1.5 max-w-xs text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
