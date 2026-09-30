import type { Comment } from '@/types'

export const MOCK_COMMENTS: Comment[] = [
  // Pulse comments
  { id: 'c1', projectId: 'p1', authorId: 'u10', body: 'Our team tried this and eliminated the daily standup entirely. Cannot overstate how much mental overhead this removes.', reactionCount: 12, createdAt: '2026-09-21T09:00:00Z' },
  { id: 'c2', projectId: 'p1', authorId: 'u13', body: 'Would love to see this connected to our internal CRM as a data source. Sales standups have a lot of deal context.', reactionCount: 5, createdAt: '2026-09-19T14:00:00Z' },
  { id: 'c3', projectId: 'p1', authorId: 'u15', body: 'Question: can the digest be customized per-team or is it a single template? We need different sections for legal vs engineering.', reactionCount: 3, createdAt: '2026-09-18T11:00:00Z' },
  { id: 'c4', projectId: 'p1', authorId: 'u4', body: 'The onboarding flow is really clean. Set up in under 4 minutes and the first digest was useful immediately.', reactionCount: 8, createdAt: '2026-09-17T16:00:00Z' },
  { id: 'c5', projectId: 'p1', authorId: 'u11', body: 'Great work. The mobile version is surprisingly good — I check the digest on my commute.', reactionCount: 6, createdAt: '2026-09-15T10:00:00Z' },

  // Claris comments
  { id: 'c6', projectId: 'p2', authorId: 'u13', body: 'The Notion sync is seamless. Finally stopped manually copying meeting notes after every call.', reactionCount: 9, createdAt: '2026-09-22T15:00:00Z' },
  { id: 'c7', projectId: 'p2', authorId: 'u10', body: 'Beta invite worked great. The action item tracking is the killer feature — I love that it tells me who owns what.', reactionCount: 7, createdAt: '2026-09-21T10:00:00Z' },
  { id: 'c8', projectId: 'p2', authorId: 'u14', body: 'Works well for technical meetings. Haven\'t tried it for executive stakeholder sessions yet — might be a different use case.', reactionCount: 4, createdAt: '2026-09-20T14:00:00Z' },
  { id: 'c9', projectId: 'p2', authorId: 'u9', body: 'This is one of the most polished projects from the workshop. The attention to meeting context is impressive.', reactionCount: 11, createdAt: '2026-09-18T09:00:00Z' },

  // Budget Lens comments
  { id: 'c10', projectId: 'p3', authorId: 'u10', body: 'Asked it "what did we spend on software licenses in Q2?" and it answered in 4 seconds. Genuinely impressive.', reactionCount: 14, createdAt: '2026-09-19T10:00:00Z' },
  { id: 'c11', projectId: 'p3', authorId: 'u13', body: 'The plain-language summaries make budget reviews so much less painful. Great for non-finance stakeholders.', reactionCount: 8, createdAt: '2026-09-17T14:00:00Z' },
  { id: 'c12', projectId: 'p3', authorId: 'u15', body: 'Would love to see forecast vs actual comparison in the main view. Currently have to ask for it explicitly.', reactionCount: 6, createdAt: '2026-09-14T11:00:00Z' },

  // ReviewBuddy comments
  { id: 'c13', projectId: 'p5', authorId: 'u3', body: 'Review times dropped from 45 min average to 18 min after rolling this out. The context summary is the key feature.', reactionCount: 16, createdAt: '2026-09-16T10:00:00Z' },
  { id: 'c14', projectId: 'p5', authorId: 'u11', body: 'The "what to focus on" section is spot-on. It correctly identified the security-critical change in a 400-line diff.', reactionCount: 10, createdAt: '2026-09-14T15:00:00Z' },
  { id: 'c15', projectId: 'p5', authorId: 'u12', body: 'The timeline update makes the evolution easy to follow. Love seeing the iteration process documented.', reactionCount: 5, createdAt: '2026-09-12T09:00:00Z' },
  { id: 'c16', projectId: 'p5', authorId: 'u6', body: 'Works well for Python PRs. Curious how it handles frontend React diffs where component boundaries matter a lot.', reactionCount: 4, createdAt: '2026-09-10T14:00:00Z' },

  // OnboardFlow comments
  { id: 'c17', projectId: 'p4', authorId: 'u8', body: 'Our August batch of new hires had significantly higher week-1 satisfaction scores. This is part of the reason.', reactionCount: 13, createdAt: '2026-09-26T09:00:00Z' },
  { id: 'c18', projectId: 'p4', authorId: 'u15', body: 'The AI guide for HR policy questions is surprisingly capable. It correctly handled 18/20 test questions I threw at it.', reactionCount: 9, createdAt: '2026-09-24T15:00:00Z' },
  { id: 'c19', projectId: 'p4', authorId: 'u13', body: 'When does the manager-side view ship? Would be great to see where each new hire is in the onboarding journey.', reactionCount: 7, createdAt: '2026-09-22T11:00:00Z' },

  // WellCheck comments
  { id: 'c20', projectId: 'p6', authorId: 'u10', body: 'The weekly format is perfect. Monthly surveys feel too infrequent; daily would be annoying. This hits the right cadence.', reactionCount: 8, createdAt: '2026-09-11T10:00:00Z' },
  { id: 'c21', projectId: 'p6', authorId: 'u13', body: 'Managers love this. Getting signal before issues escalate is exactly what we needed.', reactionCount: 6, createdAt: '2026-09-09T14:00:00Z' },

  // CustomerVoice comments
  { id: 'c22', projectId: 'p8', authorId: 'u4', body: 'We spotted a major UX pattern from CustomerVoice that we\'d missed in product reviews. Turned into a Q3 priority.', reactionCount: 11, createdAt: '2026-09-25T10:00:00Z' },
  { id: 'c23', projectId: 'p8', authorId: 'u13', body: 'The daily briefing format is the right call. I actually look forward to reading it each morning.', reactionCount: 7, createdAt: '2026-09-23T15:00:00Z' },
  { id: 'c24', projectId: 'p8', authorId: 'u15', body: 'How does it handle sarcasm or ambiguous feedback? Curious about the edge cases in sentiment analysis.', reactionCount: 4, createdAt: '2026-09-22T09:00:00Z' },

  // DataNarrator comments
  { id: 'c25', projectId: 'p13', authorId: 'u10', body: 'The anomaly callouts are the feature I didn\'t know I needed. Got alerted to a metric drop before anyone else noticed.', reactionCount: 10, createdAt: '2026-09-24T11:00:00Z' },
  { id: 'c26', projectId: 'p13', authorId: 'u7', body: 'Finance team is using this to prepare the quarterly board materials. Saves about 6 hours of analyst time per cycle.', reactionCount: 12, createdAt: '2026-09-22T14:00:00Z' },
  { id: 'c27', projectId: 'p13', authorId: 'u15', body: 'The "probably why" section for anomalies is smart. It\'s not always right but it\'s a great starting point for investigation.', reactionCount: 5, createdAt: '2026-09-20T10:00:00Z' },

  // LearnLoop comments
  { id: 'c28', projectId: 'p9', authorId: 'u10', body: 'The 5-minute format is the key design decision. I can do one on my morning coffee break. Consistent habit for 3 weeks now.', reactionCount: 9, createdAt: '2026-09-29T09:00:00Z' },
  { id: 'c29', projectId: 'p9', authorId: 'u15', body: 'Would love to see team-level tracking so managers can see skill coverage across their reports.', reactionCount: 6, createdAt: '2026-09-27T14:00:00Z' },
  { id: 'c30', projectId: 'p9', authorId: 'u13', body: 'The recommendation engine is much better after the recent iteration. Actually relevant modules this week.', reactionCount: 4, createdAt: '2026-09-25T11:00:00Z' },

  // ContractScan comments
  { id: 'c31', projectId: 'p12', authorId: 'u15', body: 'The legal team is cautiously optimistic. It caught three non-standard clauses in our last vendor NDA that we would have flagged anyway.', reactionCount: 8, createdAt: '2026-09-16T10:00:00Z' },
  { id: 'c32', projectId: 'p12', authorId: 'u14', body: 'The citation to specific sections is the most valuable feature. Saves the manual work of finding what triggered the flag.', reactionCount: 6, createdAt: '2026-09-13T15:00:00Z' },
]

export const getCommentsByProjectId = (projectId: string): Comment[] =>
  MOCK_COMMENTS.filter((c) => c.projectId === projectId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
