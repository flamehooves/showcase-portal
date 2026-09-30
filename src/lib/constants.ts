export const ALLOWED_EMAIL_DOMAIN = '@zohocorp.com'

export const PROJECT_STATUSES = {
  concept: { label: 'Concept', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  building: { label: 'Building', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  beta: { label: 'Beta', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  live: { label: 'Live', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  iterating: { label: 'Iterating', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
} as const

export const PROJECT_CATEGORIES = {
  productivity: 'Productivity',
  finance: 'Finance',
  health: 'Health & Wellness',
  'internal-tools': 'Internal Tools',
  ai: 'AI',
  collaboration: 'Collaboration',
  'customer-experience': 'Customer Experience',
  'developer-tools': 'Developer Tools',
  operations: 'Operations',
  learning: 'Learning',
} as const

export const PLATFORMS = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  'cross-platform': 'Cross-Platform',
} as const

export const UPDATE_TYPES = {
  milestone: 'Milestone',
  feature: 'Feature Launch',
  release: 'Release',
  screenshot: 'New Screenshots',
  demo: 'Demo',
  iteration: 'Iteration Note',
  announcement: 'Announcement',
  progress: 'Progress',
  reflection: 'Reflection',
} as const

export const MOCK_OTP = '847291'
export const OTP_EXPIRY_SECONDS = 300
export const OTP_RESEND_COOLDOWN = 30
