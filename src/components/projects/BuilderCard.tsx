'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import type { User } from '@/types'
import { getInitials } from '@/lib/utils/misc'

interface BuilderCardProps {
  owner: User
  collaborators?: User[]
}

function UserAvatar({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 32, md: 48, lg: 64 }
  const s = sizes[size]
  return user.avatarUrl ? (
    <Image src={user.avatarUrl} alt={user.name} width={s} height={s} className="rounded-full object-cover" />
  ) : (
    <div
      style={{ width: s, height: s }}
      className="rounded-full bg-primary/20 flex items-center justify-center"
    >
      <span className="text-sm font-bold text-primary">{getInitials(user.name)}</span>
    </div>
  )
}

export function BuilderCard({ owner, collaborators = [] }: BuilderCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-5">Built by</h3>

      {/* Owner */}
      <Link href={`/profile/${owner.id}`} className="group flex items-center gap-4 mb-5 hover:opacity-80 transition-opacity">
        <UserAvatar user={owner} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
              {owner.name}
            </span>
            {owner.isWorkshopParticipant && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Workshop
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted">{owner.team}</p>
          {owner.bio && (
            <p className="text-sm text-text-secondary mt-1.5 line-clamp-2">{owner.bio}</p>
          )}
        </div>
        <ArrowRight size={16} className="text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
      </Link>

      {/* Collaborators */}
      {collaborators.length > 0 && (
        <>
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium text-text-muted mb-3">
              {collaborators.length === 1 ? 'Collaborator' : 'Collaborators'}
            </p>
            <div className="flex flex-col gap-3">
              {collaborators.map((collab) => (
                <Link
                  key={collab.id}
                  href={`/profile/${collab.id}`}
                  className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <UserAvatar user={collab} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                      {collab.name}
                    </p>
                    <p className="text-xs text-text-muted">{collab.team}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
