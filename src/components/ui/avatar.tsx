'use client'

import { useState } from 'react'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  className?: string
}

const SIZE_MAP: Record<AvatarSize, { px: number; text: string; ring: string }> = {
  xs: { px: 24, text: 'text-[10px]', ring: 'ring-1' },
  sm: { px: 32, text: 'text-xs',     ring: 'ring-1' },
  md: { px: 40, text: 'text-sm',     ring: 'ring-2' },
  lg: { px: 56, text: 'text-base',   ring: 'ring-2' },
  xl: { px: 80, text: 'text-xl',     ring: 'ring-2' },
}

/** Deterministic hue (0–360) based on name string */
function nameToHue(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const { px, text, ring } = SIZE_MAP[size]
  const hue = nameToHue(name)
  const initials = getInitials(name)

  const showImage = src && !imgError

  return (
    <span
      className={[
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        `ring-white dark:ring-neutral-900 ${ring}`,
        className,
      ].join(' ')}
      style={{ width: px, height: px }}
      title={name}
      aria-label={name}
    >
      {/* Initials fallback — always rendered underneath */}
      <span
        aria-hidden={showImage ? true : undefined}
        className={[
          'absolute inset-0 flex items-center justify-center font-semibold leading-none select-none',
          text,
        ].join(' ')}
        style={{
          background: `hsl(${hue}, 60%, 92%)`,
          color: `hsl(${hue}, 50%, 35%)`,
        }}
      >
        {initials}
      </span>

      {/* Image — fades in once loaded */}
      {showImage && (
        <img
          src={src}
          alt={name}
          width={px}
          height={px}
          className={[
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
            imgLoaded ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          draggable={false}
        />
      )}
    </span>
  )
}
