import type { Comment } from '@/types'
import { MOCK_COMMENTS, getCommentsByProjectId } from '@/mock/data/comments'
import { delay } from '@/lib/utils/misc'

const localComments: Comment[] = [...MOCK_COMMENTS]

export async function fetchComments(projectId: string): Promise<Comment[]> {
  await delay(300)
  return localComments
    .filter((c) => c.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function postComment(
  projectId: string,
  authorId: string,
  body: string,
  parentId?: string
): Promise<Comment> {
  await delay(500)
  const comment: Comment = {
    id: `c${Date.now()}`,
    projectId,
    authorId,
    body,
    parentId,
    reactionCount: 0,
    createdAt: new Date().toISOString(),
  }
  localComments.unshift(comment)
  return comment
}

export async function deleteComment(id: string): Promise<void> {
  await delay(300)
  const idx = localComments.findIndex((c) => c.id === id)
  if (idx !== -1) localComments.splice(idx, 1)
}
