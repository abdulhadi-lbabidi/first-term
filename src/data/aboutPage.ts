export const aboutHeroBadges = ['premium', 'easy', 'curated'] as const

export const aboutStoryHighlights = ['curated', 'clear', 'easy'] as const

export const visionMissionCards = [
  {
    id: 'vision',
    ghost: 'VISION',
    number: '01',
    rotation: '-rotate-1',
    slideFrom: 'start' as const,
  },
  {
    id: 'mission',
    ghost: 'MISSION',
    number: '02',
    rotation: 'rotate-1',
    slideFrom: 'end' as const,
  },
] as const

export const aboutValues = [
  {
    id: 'elegance',
    number: '01',
    position: 'top-6 start-0 lg:top-10 lg:start-4',
    floatClass: 'animate-float-soft',
  },
  {
    id: 'clarity',
    number: '02',
    position: 'bottom-6 start-0 lg:bottom-10 lg:start-4',
    floatClass: 'animate-float-soft-slow [animation-delay:0.6s]',
  },
  {
    id: 'ease',
    number: '03',
    position: 'top-6 end-0 lg:top-10 lg:end-4',
    floatClass: 'animate-float-soft [animation-delay:1.2s]',
  },
  {
    id: 'trust',
    number: '04',
    position: 'bottom-6 end-0 lg:bottom-10 lg:end-4',
    floatClass: 'animate-float-soft-slow [animation-delay:1.8s]',
  },
] as const

export const aboutTimelineStepConfig = [
  { id: 'browse', number: '01', cardPosition: 'above' as const },
  { id: 'view', number: '02', cardPosition: 'below' as const },
  { id: 'cart', number: '03', cardPosition: 'above' as const },
  { id: 'track', number: '04', cardPosition: 'below' as const },
] as const

export const ABOUT_TIMELINE_PROGRESS_MS = 2800
export const ABOUT_TIMELINE_STEP_DELAYS_MS = [0, 700, 1400, 2100] as const

export const aboutStats = [
  { id: 'products', type: 'count' as const, target: 250, suffix: '+' },
  { id: 'categories', type: 'count' as const, target: 4, suffix: '+' },
  { id: 'support', type: 'static' as const, display: '24/7' },
  { id: 'experience', type: 'count' as const, target: 100, suffix: '%' },
] as const

export const aboutDifferenceFeatures = ['photos', 'info', 'order'] as const

export const aboutStoryImage = '/images/about-trend.jpg'
export const aboutDifferenceImage = '/images/fashion-3.jpg'

export const valuesOrbitLines = [
  { x2: 22, y2: 18 },
  { x2: 22, y2: 82 },
  { x2: 78, y2: 18 },
  { x2: 78, y2: 82 },
] as const
