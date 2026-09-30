export type UserRole = 'employee' | 'participant' | 'admin'

export type Platform = 'web' | 'ios' | 'android' | 'cross-platform'

export type ProjectStatus = 'concept' | 'building' | 'beta' | 'live' | 'iterating'

export type ProjectCategory =
  | 'productivity'
  | 'finance'
  | 'health'
  | 'internal-tools'
  | 'ai'
  | 'collaboration'
  | 'customer-experience'
  | 'developer-tools'
  | 'operations'
  | 'learning'

export type UpdateType =
  | 'milestone'
  | 'feature'
  | 'release'
  | 'screenshot'
  | 'demo'
  | 'iteration'
  | 'announcement'
  | 'progress'
  | 'reflection'

export type ReactionType = 'like' | 'fire' | 'rocket' | 'heart'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string
  role: UserRole
  team: string
  bio: string
  isWorkshopParticipant: boolean
  createdAt: string
}

export interface Screenshot {
  id: string
  url: string
  caption: string
  order: number
}

export interface DemoMedia {
  type: 'video' | 'embed'
  url: string
  thumbnailUrl?: string
  caption?: string
}

export interface Project {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  story: string
  category: ProjectCategory
  platforms: Platform[]
  status: ProjectStatus
  coverImage: string
  screenshots: Screenshot[]
  demoMedia?: DemoMedia
  webUrl?: string
  appStoreUrl?: string
  playStoreUrl?: string
  demoUrl?: string
  repoUrl?: string
  tags: string[]
  ownerId: string
  collaboratorIds: string[]
  isPublished: boolean
  isFeatured: boolean
  viewCount: number
  reactionCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface ProjectCollaborator {
  userId: string
  role: string
}

export interface UpdateMedia {
  url: string
  caption?: string
}

export interface ProjectUpdate {
  id: string
  projectId: string
  authorId: string
  type: UpdateType
  title: string
  body: string
  media: UpdateMedia[]
  externalUrl?: string
  isMilestone: boolean
  createdAt: string
}

export interface Comment {
  id: string
  projectId: string
  authorId: string
  body: string
  parentId?: string
  reactionCount: number
  createdAt: string
}

export interface Reaction {
  id: string
  userId: string
  targetType: 'project' | 'comment' | 'update'
  targetId: string
  type: ReactionType
  createdAt: string
}

export interface Collection {
  id: string
  name: string
  description: string
  coverImage: string
  projectIds: string[]
  createdBy: string
  createdAt: string
}

export interface FeaturedProject {
  id: string
  projectId: string
  order: number
  createdAt: string
}

export interface MockSession {
  user: User
  isAuthenticated: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ProjectFilters {
  search?: string
  platform?: Platform
  status?: ProjectStatus
  category?: ProjectCategory
  tags?: string[]
  featured?: boolean
  recentlyUpdated?: boolean
}
