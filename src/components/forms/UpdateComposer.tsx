'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CircleNotch, CheckSquare, Square, Image as ImageIcon, Link as LinkIcon } from '@phosphor-icons/react'
import { createUpdate } from '@/lib/api/updates'
import { UPDATE_TYPES } from '@/lib/constants'
import type { ProjectUpdate, UpdateType } from '@/types'
import { useAuthStore } from '@/stores/auth-store'

const schema = z.object({
  type: z.enum([
    'milestone', 'feature', 'release', 'screenshot', 'demo',
    'iteration', 'announcement', 'progress', 'reflection',
  ] as const),
  title: z.string().min(1, 'Title is required').max(120, 'Title is too long'),
  body: z.string().min(1, 'Body is required').max(2000, 'Body is too long'),
  isMilestone: z.boolean(),
  imageUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  externalUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
})

type FormValues = z.infer<typeof schema>

interface UpdateComposerProps {
  projectId: string
  onSuccess: (update: ProjectUpdate) => void
  onCancel?: () => void
}

export function UpdateComposer({ projectId, onSuccess, onCancel }: UpdateComposerProps) {
  const user = useAuthStore((s) => s.user)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'progress',
      title: '',
      body: '',
      isMilestone: false,
      imageUrl: '',
      externalUrl: '',
    },
  })

  const isMilestone = watch('isMilestone')

  async function onSubmit(values: FormValues) {
    if (!user) return
    setSubmitting(true)
    try {
      const update = await createUpdate({
        projectId,
        authorId: user.id,
        type: values.type as UpdateType,
        title: values.title,
        body: values.body,
        isMilestone: values.isMilestone,
        media: values.imageUrl ? [{ url: values.imageUrl, caption: '' }] : [],
        externalUrl: values.externalUrl || undefined,
        createdAt: new Date().toISOString(),
      })
      reset()
      onSuccess(update)
    } catch (err) {
      console.error('Failed to create update', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4">Add update</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Update type
          </label>
          <select
            {...register('type')}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {(Object.entries(UPDATE_TYPES) as [UpdateType, string][]).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            {...register('title')}
            placeholder="What happened?"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        {/* Body */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Details <span className="text-destructive">*</span>
          </label>
          <textarea
            {...register('body')}
            rows={4}
            placeholder="Share what changed, why it matters, and what you learned..."
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
          {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
        </div>

        {/* Milestone toggle */}
        <button
          type="button"
          onClick={() => setValue('isMilestone', !isMilestone)}
          className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
        >
          {isMilestone ? (
            <CheckSquare size={18} weight="fill" className="text-amber-500" />
          ) : (
            <Square size={18} className="text-muted-foreground" />
          )}
          <span className={isMilestone ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-muted-foreground'}>
            Mark as milestone
          </span>
        </button>

        {/* Optional fields */}
        <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <ImageIcon size={12} />
              Image URL
            </label>
            <input
              {...register('imageUrl')}
              placeholder="https://..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <LinkIcon size={12} />
              External link
            </label>
            <input
              {...register('externalUrl')}
              placeholder="https://..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.externalUrl && <p className="text-xs text-destructive">{errors.externalUrl.message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {submitting && <CircleNotch size={14} className="animate-spin" />}
            {submitting ? 'Posting…' : 'Post update'}
          </button>
        </div>
      </form>
    </div>
  )
}
