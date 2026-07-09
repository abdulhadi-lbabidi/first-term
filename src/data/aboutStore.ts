export const aboutHighlights = ['curated', 'categories', 'shopping'] as const

export const aboutTimelineSteps = [
  'browse',
  'details',
  'cart',
  'track',
] as const

export type AboutHighlightId = (typeof aboutHighlights)[number]
export type AboutTimelineStepId = (typeof aboutTimelineSteps)[number]

export interface TimelineStepConfig {
  id: AboutTimelineStepId
  number: string
  cardPosition: 'above' | 'below'
}

export const aboutTimelineStepConfig: TimelineStepConfig[] = [
  { id: 'browse', number: '01', cardPosition: 'above' },
  { id: 'details', number: '02', cardPosition: 'below' },
  { id: 'cart', number: '03', cardPosition: 'above' },
  { id: 'track', number: '04', cardPosition: 'below' },
]

export const TIMELINE_PROGRESS_MS = 2800

export const TIMELINE_STEP_DELAYS_MS = [0, 700, 1400, 2100] as const
