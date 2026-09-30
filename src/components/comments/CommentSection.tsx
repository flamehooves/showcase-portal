'use client'
import { useState, useOptimistic } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash, ChatCircle } from '@phosphor-icons/react'
import type { Comment, User } from '@/types'
import { formatRelativeDate, getInitials } from '@/lib/utils/misc'
import { postComment, deleteComment } from '@/lib/api/comments'
import { useAuthStore } from '@/stores/auth-store'

interface CommentSectionProps {
  projectId: string
  comments: Comment[]
  authors: Record<string, User>
}

function CommentCard({
  comment,
  author,
  currentUser,
  onDelete,
}: {
  comment: Comment
  author?: User
  currentUser?: User | null
  onDelete: (id: string) => void
}) {
  const canDelete = currentUser && (currentUser.id === comment.authorId || currentUser.role === 'admin')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 group"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {author?.avatarUrl ? (
          <Image src={author.avatarUrl} alt={author.name} width={36} height={36} className="rounded-full" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{author ? getInitials(author.name) : '?'}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-surface border border-border rounded-2xl rounded-tl-md px-4 py-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-semibold text-text-primary">{author?.name ?? 'Unknown'}</span>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {canDelete && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-text-muted hover:text-red-500 transition-colors"
                  aria-label="Delete comment"
                >
                  <Trash size={14} />
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{comment.body}</p>
        </div>
        <div className="flex items-center gap-3 mt-1.5 px-2">
          <span className="text-xs text-text-muted">{formatRelativeDate(comment.createdAt)}</span>
          <button className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors">
            <Heart size={12} />
            {comment.reactionCount > 0 && comment.reactionCount}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function CommentSection({ projectId, comments: initialComments, authors }: CommentSectionProps) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState(initialComments)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleSubmit = async () => {
    if (!body.trim() || !user) return
    setSubmitting(true)
    try {
      const comment = await postComment(projectId, user.id, body.trim())
      setComments((prev) => [comment, ...prev])
      setBody('')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteComment(id)
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <ChatCircle size={20} className="text-text-muted" />
        <h3 className="font-semibold text-text-primary">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </h3>
      </div>

      {/* Composer */}
      {user ? (
        <div className="flex gap-3 mb-8">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt={user.name} width={36} height={36} className="rounded-full flex-shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">{getInitials(user.name)}</span>
            </div>
          )}
          <div className="flex-1">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => !body && setFocused(false)}
              placeholder="Share your thoughts…"
              rows={focused ? 3 : 1}
              className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
            <AnimatePresence>
              {focused && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-end gap-2 mt-2"
                >
                  <button
                    onClick={() => { setBody(''); setFocused(false) }}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors px-3 py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!body.trim() || submitting}
                    className="text-sm bg-primary text-primary-foreground font-medium px-4 py-1.5 rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-colors"
                  >
                    {submitting ? 'Posting…' : 'Post'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-4 mb-8 text-center">
          <p className="text-sm text-text-muted">
            <a href="/signin" className="text-primary hover:underline">Sign in</a> to leave a comment
          </p>
        </div>
      )}

      {/* Comments */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <ChatCircle size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">No comments yet. Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <AnimatePresence initial={false}>
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                author={authors[comment.authorId]}
                currentUser={user}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
