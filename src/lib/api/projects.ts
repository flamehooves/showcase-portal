import type { Project, ProjectFilters, PaginatedResponse } from '@/types'
import { MOCK_PROJECTS, getProjectBySlug, getProjectById } from '@/mock/data/projects'
import { delay } from '@/lib/utils/misc'

export async function fetchProjects(
  filters: ProjectFilters = {},
  page = 1,
  limit = 12
): Promise<PaginatedResponse<Project>> {
  await delay(400)

  let results = MOCK_PROJECTS.filter((p) => p.isPublished)

  if (filters.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    )
  }

  if (filters.platform) {
    results = results.filter((p) => p.platforms.includes(filters.platform!))
  }

  if (filters.status) {
    results = results.filter((p) => p.status === filters.status)
  }

  if (filters.category) {
    results = results.filter((p) => p.category === filters.category)
  }

  if (filters.featured) {
    results = results.filter((p) => p.isFeatured)
  }

  if (filters.recentlyUpdated) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    results = results.filter((p) => new Date(p.updatedAt) > weekAgo)
  }

  results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const total = results.length
  const start = (page - 1) * limit
  const data = results.slice(start, start + limit)

  return { data, total, page, limit, hasMore: start + limit < total }
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  await delay(300)
  return getProjectBySlug(slug) ?? null
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  await delay(300)
  return MOCK_PROJECTS.filter((p) => p.isFeatured && p.isPublished).sort(
    (a, b) => b.viewCount - a.viewCount
  )
}

export async function fetchTrendingProjects(): Promise<Project[]> {
  await delay(350)
  return MOCK_PROJECTS.filter((p) => p.isPublished)
    .sort((a, b) => b.reactionCount + b.commentCount - (a.reactionCount + a.commentCount))
    .slice(0, 6)
}

export async function fetchRecentlyUpdatedProjects(): Promise<Project[]> {
  await delay(300)
  return MOCK_PROJECTS.filter((p) => p.isPublished)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8)
}

export async function fetchUserProjects(userId: string): Promise<Project[]> {
  await delay(300)
  return MOCK_PROJECTS.filter((p) => p.ownerId === userId || p.collaboratorIds.includes(userId))
}

let mockProjects = [...MOCK_PROJECTS]

export async function createProject(data: Partial<Project>): Promise<Project> {
  await delay(600)
  const project: Project = {
    id: `p${Date.now()}`,
    slug: data.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: data.name!,
    tagline: data.tagline || '',
    description: data.description || '',
    story: data.story || '',
    category: data.category || 'productivity',
    platforms: data.platforms || ['web'],
    status: data.status || 'concept',
    coverImage: data.coverImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop',
    screenshots: data.screenshots || [],
    demoMedia: data.demoMedia,
    webUrl: data.webUrl,
    appStoreUrl: data.appStoreUrl,
    playStoreUrl: data.playStoreUrl,
    demoUrl: data.demoUrl,
    repoUrl: data.repoUrl,
    tags: data.tags || [],
    ownerId: data.ownerId!,
    collaboratorIds: data.collaboratorIds || [],
    isPublished: false,
    isFeatured: false,
    viewCount: 0,
    reactionCount: 0,
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockProjects.push(project)
  return project
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  await delay(500)
  const idx = mockProjects.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error('Project not found')
  mockProjects[idx] = { ...mockProjects[idx], ...data, updatedAt: new Date().toISOString() }
  return mockProjects[idx]
}

export async function publishProject(id: string): Promise<Project> {
  return updateProject(id, { isPublished: true })
}

export async function unpublishProject(id: string): Promise<Project> {
  return updateProject(id, { isPublished: false })
}
