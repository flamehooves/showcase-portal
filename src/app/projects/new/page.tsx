'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CircleNotch, Globe, DeviceMobile, AndroidLogo, Devices, Image as ImageIcon } from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/auth-store'
import { createProject } from '@/lib/api/projects'
import { PROJECT_STATUSES, PROJECT_CATEGORIES, PLATFORMS } from '@/lib/constants'
import { AppShell } from '@/components/layout/AppShell'
import type { Platform, ProjectCategory, ProjectStatus } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(80, 'Name is too long'),
  tagline: z.string().min(1, 'Tagline is required').max(160, 'Tagline is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  category: z.enum([
    'productivity', 'finance', 'health', 'internal-tools', 'ai',
    'collaboration', 'customer-experience', 'developer-tools', 'operations', 'learning',
  ] as const),
  status: z.enum(['concept', 'building', 'beta', 'live', 'iterating'] as const),
  tags: z.string(),
  platforms: z.array(z.enum(['web', 'ios', 'android', 'cross-platform'] as const)).min(1, 'Select at least one platform'),
  webUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  appStoreUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  playStoreUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  demoUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  story: z.string().max(5000).optional(),
  coverImage: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  publishImmediately: z.boolean(),
})

type FormValues = z.infer<typeof schema>

const PLATFORM_OPTIONS: { value: Platform; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { value: 'web', label: 'Web', icon: Globe },
  { value: 'ios', label: 'iOS', icon: DeviceMobile },
  { value: 'android', label: 'Android', icon: AndroidLogo },
  { value: 'cross-platform', label: 'Cross-Platform', icon: Devices },
]

function SectionHeader({ number, title, description }: { number: number; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
        {number}
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export default function NewProjectPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      category: 'productivity',
      status: 'concept',
      tags: '',
      platforms: ['web'],
      webUrl: '',
      appStoreUrl: '',
      playStoreUrl: '',
      demoUrl: '',
      story: '',
      coverImage: '',
      publishImmediately: false,
    },
  })

  const coverImage = watch('coverImage')

  async function onSubmit(values: FormValues) {
    if (!user) {
      router.replace('/signin')
      return
    }
    setSubmitError('')
    try {
      const project = await createProject({
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
        ownerId: user.id,
        isPublished: values.publishImmediately,
      })
      router.push(`/projects/${project.slug}`)
    } catch (err) {
      setSubmitError('Something went wrong. Please try again.')
      console.error(err)
    }
  }

  const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">New Project</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Share what you&apos;re building with the workshop community.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Section 1: Basics */}
          <section className="rounded-xl border border-border bg-card p-6">
            <SectionHeader number={1} title="Basics" description="Core identity of your project." />
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Name <span className="text-destructive">*</span>
                </label>
                <input {...register('name')} placeholder="e.g. Pulse" className={inputClass} />
                <FieldError message={errors.name?.message} />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Tagline <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('tagline')}
                  placeholder="One-line description of what your project does"
                  className={inputClass}
                />
                <FieldError message={errors.tagline?.message} />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe what the project does, who it's for, and what problem it solves."
                  className={`${inputClass} resize-none`}
                />
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
                <input
                  {...register('tags')}
                  placeholder="ai, productivity, slack (comma-separated)"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-muted-foreground">Separate tags with commas.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Platform & Links */}
          <section className="rounded-xl border border-border bg-card p-6">
            <SectionHeader number={2} title="Platform & Links" />
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
                            onClick={() => {
                              if (checked) {
                                field.onChange(field.value.filter((v) => v !== value))
                              } else {
                                field.onChange([...field.value, value])
                              }
                            }}
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
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Web URL
                  </label>
                  <input {...register('webUrl')} placeholder="https://" className={inputClass} />
                  <FieldError message={errors.webUrl?.message} />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Demo URL
                  </label>
                  <input {...register('demoUrl')} placeholder="https://" className={inputClass} />
                  <FieldError message={errors.demoUrl?.message} />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    App Store URL
                  </label>
                  <input {...register('appStoreUrl')} placeholder="https://apps.apple.com/…" className={inputClass} />
                  <FieldError message={errors.appStoreUrl?.message} />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Play Store URL
                  </label>
                  <input {...register('playStoreUrl')} placeholder="https://play.google.com/…" className={inputClass} />
                  <FieldError message={errors.playStoreUrl?.message} />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Story */}
          <section className="rounded-xl border border-border bg-card p-6">
            <SectionHeader
              number={3}
              title="Project Story"
              description="The why behind the what. Tell the story of how this came to be."
            />
            <textarea
              {...register('story')}
              rows={8}
              placeholder="What problem sparked this? What did you learn building it? What surprised you? Write in plain language — no need to be formal."
              className={`${inputClass} resize-y`}
            />
            <FieldError message={errors.story?.message} />
          </section>

          {/* Section 4: Cover Image */}
          <section className="rounded-xl border border-border bg-card p-6">
            <SectionHeader number={4} title="Cover Image" />
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Image URL
                </label>
                <input
                  {...register('coverImage')}
                  placeholder="https://images.unsplash.com/…"
                  className={inputClass}
                />
                <FieldError message={errors.coverImage?.message} />
              </div>

              {coverImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
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

          {/* Section 5: Publishing */}
          <section className="rounded-xl border border-border bg-card p-6">
            <SectionHeader number={5} title="Publishing" />
            <Controller
              name="publishImmediately"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => field.onChange(false)}
                    className={[
                      'flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors',
                      !field.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/40',
                    ].join(' ')}
                  >
                    <span className="text-sm font-semibold text-foreground">Save as draft</span>
                    <span className="text-xs text-muted-foreground">
                      Only visible to you. Publish when ready.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => field.onChange(true)}
                    className={[
                      'flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors',
                      field.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/40',
                    ].join(' ')}
                  >
                    <span className="text-sm font-semibold text-foreground">Publish immediately</span>
                    <span className="text-xs text-muted-foreground">
                      Visible to everyone in the portal right away.
                    </span>
                  </button>
                </div>
              )}
            />
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
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting && <CircleNotch size={15} className="animate-spin" />}
              {isSubmitting ? 'Creating…' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
