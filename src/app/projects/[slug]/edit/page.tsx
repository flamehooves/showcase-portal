import { MOCK_PROJECTS } from '@/mock/data/projects'
import { EditPageClient } from './EditPageClient'

export function generateStaticParams() {
  return MOCK_PROJECTS.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export default function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  return <EditPageClient params={params} />
}
