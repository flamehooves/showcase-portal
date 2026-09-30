import type { ProjectUpdate } from '@/types'
import { MOCK_UPDATES } from '@/mock/data/updates'
import { delay } from '@/lib/utils/misc'

const localUpdates: ProjectUpdate[] = [...MOCK_UPDATES]

export async function fetchUpdates(projectId: string): Promise<ProjectUpdate[]> {
  await delay(300)
  return localUpdates
    .filter((u) => u.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function createUpdate(data: Omit<ProjectUpdate, 'id'>): Promise<ProjectUpdate> {
  await delay(500)
  const update: ProjectUpdate = { ...data, id: `upd${Date.now()}` }
  localUpdates.unshift(update)
  return update
}

export async function deleteUpdate(id: string): Promise<void> {
  await delay(300)
  const idx = localUpdates.findIndex((u) => u.id === id)
  if (idx !== -1) localUpdates.splice(idx, 1)
}
