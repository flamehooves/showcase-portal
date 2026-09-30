'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CircleNotch,
  Globe,
  DeviceMobile,
  AndroidLogo,
  Devices,
  Image as ImageIcon,
  LockSimple,
  Plus,
} from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/auth-store'
import { updateProject } from '@/lib/api/projects'
import { fetchUpdates } from '@/lib/api/updates'
import { getProjectBySlug } from '@/mock/data/projects'
import { getUserById } from '@/mock/data/users'
import { PROJECT_STATUSES, PROJECT_CATEGORIES, PLATFORMS } from '@/lib/constants'
import { AppShell } from '@/components/layout/AppShell'
import { UpdateComposer } from '@/components/forms/UpdateComposer'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { formatRelativeDate } from '@/lib/utils/misc'
import type { Platform, ProjectCategory, ProjectStatus, ProjectUpdate } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  tagline: z.string().min(1, 'Tagline is required').max(160),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  category: z.enum([
    'productivity', 'finance', 'health', 'internal-tools', 'ai',
    'collaboration', 'customer-experience', 'developer-tools', 'operations', 'learning',
  ] as const),
  status: z.enum(['concept', 'building', 'beta', 'live', 'iterating'] as const),
  tags: z.string(),
  platforms: z.array(z.enum(['web', 'ios', 'android', 'cross-platform'] as const)).min(1, 'Select at least one platform'),
  webUrl: z.string().url().or(z.literal('')).optional(),
  appStoreUrl: z.string().url().or(z.literal('')).optional(),
  playStoreUrl: z.string().url().or(z.literal('')).optional(),
  demoUrl: z.string().url().or(z.literal('')).optional(),
  story: z.string().max(5000).optional(),
  coverImage: z.string().url().or(z.literal('')).optional(),
})

type FormValues = z.infer<typeof schema>

const PLATFORM_OPTIONS: { value: Platform; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { value: 'web', label: 'Web', icon: Globe },
  { value: 'ios', label: 'iOS', icon: DeviceMobile },
  { value: 'android', label: 'Android', icon: AndroidLogo },
  { value: 'cross-platform', label: 'Cross-Platform', icon: Devices },
]

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export function EditPageClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  const project = getProjectBySlug(slug)
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [showComposer, setShowComposer] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const inputClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: project
      ? {
          name: project.name,
          tagline: project.tagline,
          description: project.description,
          category: project.category,
          status: project.status,
          tags: project.tags.join(', '),
          platforms: project.platforms,
          webUrl: project.webUrl ?? '',
          appStoreUrl: project.appStoreUrl ?? '',
          playStoreUrl: project.playStoreUrl ?? '',
          demoUrl: project.demoUrl ?? '',
          story: project.story ?? '',
          coverImage: project.coverImage ?? '',
        }
      : {},
  })

  const coverImage = watch('coverImage')

  useEffect(() => {
    if (!project) return
    fetchUpdates(project.id).then(setUpdates)
  }, [project])

  if (!project) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <h1 className="text-xl font-semibold text-foreground">Project not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This project doesn&apos;t exist or has been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go back
          </button>
        </div>
      </AppShell>
    )
  }

  if (!user || user.id !== project.ownerId) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <LockSimple size={24} weight="light" className="text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Permission denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You don&apos;t have permission to edit this project.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go back
          </button>
        </div>
      </AppShell>
    )
  }

  async function onSubmit(values: FormValues) {
    setSubmitError('')
    try {
      await updateProject(project!.id, {
        name: values.name,
        tagline: values.tagline,
        description: values.description,
        category: values.category as ProjectCategory,
        status: values.status as ProjectStatus,
        tags: values.tags.split(',').map((t) => t.trim()).filter(Boolean),
        platforms: values.platforms as Platform[],
        webUrl: values.webUrl || undefined,
        appStoreUrl: values.appStoreUrl || undefined,
        playStoreUrl: values.playStoreUrl || undefined,
        demoUrl: values.demoUrl || undefined,
        story: values.story || '',
        coverImage: values.coverImage || '',
      })
      router.push(`/projects/${project!.slug}`)
    } catch (err) {
      setSubmitError('Failed to save changes. Please try again.')
      console.error(err)
    }
  }

  function handleUpdateSuccess(update: ProjectUpdate) {
    setUpdates((prev) => [update, ...prev])
    setShowComposer(false)
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit Project</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Last updated {formatRelativeDate(project.updatedAt)}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basics */}
          <section className="rounded-xl border border-border bg-card p-6">
            <SectionHeader title="Basics" />
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Name <span className="text-destructive">*</span>
                </label>
                <input {...register('name')} className={inputClass} />
                <FieldError message={errors.name?.message} />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Tagline <span className="text-destructive">*</span>
                </label>
                <input {...register('tagline')} className={inputClass} />
                <FieldError message={errors.tagline?.message} />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea {...register('description')} rows={4} className={`${inputClass} resize-none`} />
                <FieldError message={errors.description?.message} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Category
                  </label>
                  <select {...register('category')} className={inputClass}>
                    {(Object.entries(PROJECT_CATEGORIES) as [ProjectCategory, string][]).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Status
                  </label>
                  <select {...register('status')} className={inputClass}>
                    {(Object.entries(PROJECT_STATUSES) as [ProjectStatus, { label: string }][]).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Tags
                </label>
                <input {...register('tags')} placeholder="Comma-separated" className={inputClass} />
              </div>
            </div>
          </section>

          {/* Platform & Links */}
          <section className="rounded-xl border border-border bg-card p-6">
            <SectionHeader title="Platform & Links" />
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Platforms <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="platforms"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {PLATFORM_OPTIONS.map(({ value, label, icon: Icon }) => {
                        const checked = field.value.includes(value)
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              field.onChange(
                                checked
                                  ? field.value.filter((v) => v !== value)
                                  : [...field.value, value]
                              )
                            }
                            className={[
                              'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                              checked
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-input bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
                            ].join(' ')}
                          >
                            <Icon size={15} />
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                />
                <FieldError message={errors.platforms?.message} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { key: 'webUrl' as const, label: 'Web URL', placeholder: 'https://' },
                  { key: 'demoUrl' as const, label: 'Demo URL', placeholder: 'https://' },
                  { key: 'appStoreUrl' as const, label: 'App Store URL', placeholder: 'https://apps.apple.com/…' },
                  { key: 'playStoreUrl' as const, label: 'Play Store URL', placeholder: 'https://play.google.com/…' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                      {label}
                    </label>
                    <input {...register(key)} placeholder={placeholder} className={inputClass} />
                    <FieldError message={errors[key]?.message} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Story */}
          <section className="rounded-xl border border-border bg-card p-6">
            <SectionHeader title="Project Story" description="The why behind the what." />
            <textarea
              {...register('story')}
              rows={8}
              placeholder="What problem sparked this? What did you learn building it?"
              className={`${inputClass} resize-y`}
            />
            <FieldError message={errors.story?.message} />
          </section>

          {/* Cover Image */}
          <section className="rounded-xl border border-border bg-card p-6">
            <SectionHeader title="Cover Image" />
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Image URL
                </label>
                <input {...register('coverImage')} placeholder="https://images.unsplash.com/…" className={inputClass} />
                <FieldError message={errors.coverImage?.message} />
              </div>
              {coverImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                    onError={(e) => { ;(e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                  <div className="text-center">
                    <ImageIcon size={24} weight="light" className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Submit */}
          {submitError && (
            <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{submitError}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting && <CircleNotch size={15} className="animate-spin" />}
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>

        {/* Timeline section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">Timeline</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {updates.length} update{updates.length !== 1 ? 's' : ''} posted
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowComposer((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Plus size={15} weight="bold" />
              Add update
            </button>
          </div>

          {showComposer && (
            <div className="mb-6">
              <UpdateComposer
                projectId={project.id}
                onSuccess={handleUpdateSuccess}
                onCancel={() => setShowComposer(false)}
              />
            </div>
          )}

          {updates.length === 0 && !showComposer ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-sm font-medium text-foreground">No updates yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Post your first update to let others follow your progress.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {updates.map((update, i) => (
                <TimelineItem
                  key={update.id}
                  update={update}
                  author={getUserById(update.authorId)}
                  isLast={i === updates.length - 1}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}
