import { MOCK_PROJECTS } from '@/mock/data/projects'
import { getUserById } from '@/mock/data/users'
import { HomeView } from '@/components/home/HomeView'
import type { User } from '@/types'

export default function HomePage() {
  const projects = MOCK_PROJECTS.filter((p) => p.isPublished)
  const owners: Record<string, User> = {}
  for (const project of projects) {
    const user = getUserById(project.ownerId)
    if (user) owners[project.ownerId] = user
  }
  return <HomeView projects={projects} owners={owners} />
}
