import { Globe, DeviceMobile, AndroidLogo, Devices } from '@phosphor-icons/react'
import type { Platform } from '@/types'
import { PLATFORMS } from '@/lib/constants'

interface PlatformBadgeProps {
  platform: Platform
}

const PLATFORM_ICONS: Record<Platform, React.ComponentType<{ size?: number; weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone' }>> = {
  web: Globe,
  ios: DeviceMobile,
  android: AndroidLogo,
  'cross-platform': Devices,
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const Icon = PLATFORM_ICONS[platform]
  const label = PLATFORMS[platform]

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
      <Icon size={12} weight="regular" />
      {label}
    </span>
  )
}
