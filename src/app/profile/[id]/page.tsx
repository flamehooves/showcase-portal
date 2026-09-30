import { MOCK_USERS } from '@/mock/data/users'
import { ProfilePageClient } from './ProfilePageClient'

export function generateStaticParams() {
  return MOCK_USERS.map((u) => ({ id: u.id }))
}

export const dynamicParams = false

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  return <ProfilePageClient params={params} />
}
