import type { Collection, FeaturedProject } from '@/types'

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col1',
    name: 'Async-First Workspace',
    description: 'Tools that let teams communicate and collaborate without the meeting overhead.',
    coverImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=500&fit=crop',
    projectIds: ['p1', 'p2'],
    createdBy: 'u9',
    createdAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 'col2',
    name: 'AI-Native Analytics',
    description: 'Moving from dashboards to conversations — analytics tools that speak human.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    projectIds: ['p3', 'p8', 'p13'],
    createdBy: 'u9',
    createdAt: '2026-09-05T09:00:00Z',
  },
  {
    id: 'col3',
    name: 'Developer Experience',
    description: 'Making the developer workflow faster, smarter, and less mentally exhausting.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop',
    projectIds: ['p5', 'p10'],
    createdBy: 'u9',
    createdAt: '2026-09-10T09:00:00Z',
  },
]

export const MOCK_FEATURED: FeaturedProject[] = [
  { id: 'f1', projectId: 'p1', order: 1, createdAt: '2026-09-20T09:00:00Z' },
  { id: 'f2', projectId: 'p2', order: 2, createdAt: '2026-09-20T09:00:00Z' },
  { id: 'f3', projectId: 'p3', order: 3, createdAt: '2026-09-20T09:00:00Z' },
  { id: 'f4', projectId: 'p4', order: 4, createdAt: '2026-09-20T09:00:00Z' },
]
