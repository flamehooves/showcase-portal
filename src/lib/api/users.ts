import type { User } from '@/types'
import { MOCK_USERS, getUserById } from '@/mock/data/users'
import { delay } from '@/lib/utils/misc'

export async function fetchUser(id: string): Promise<User | null> {
  await delay(200)
  return getUserById(id) ?? null
}

export async function fetchAllUsers(): Promise<User[]> {
  await delay(200)
  return MOCK_USERS
}
