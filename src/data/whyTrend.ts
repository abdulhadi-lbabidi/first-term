import type { WhyTrendItem, WhyTrendStat } from '../types'

export const whyTrendItems: WhyTrendItem[] = [
  { id: 'style', number: '01', rotation: 'rotate-[1deg]' },
  { id: 'shopping', number: '02', rotation: 'rotate-[-1deg]' },
  { id: 'tracking', number: '03', rotation: 'rotate-[-2deg]' },
  { id: 'trust', number: '04', rotation: 'rotate-[2deg]' },
]

export const whyTrendStats: WhyTrendStat[] = [
  { id: 'products', target: 250, suffix: '+' },
  { id: 'categories', target: 4, suffix: '+' },
  { id: 'support', target: 24, format: 'ratio', ratioSuffix: '/7' },
]

export const whyTrendFeaturePositions: Record<string, string> = {
  style:
    'md:absolute md:top-[12%] md:left-[calc(50%+9rem)] md:z-20 md:max-w-[200px] lg:top-[18%] lg:left-[calc(50%+13.5rem)] lg:max-w-[285px]',
  shopping:
    'md:absolute md:bottom-[8%] md:left-[calc(50%+9rem)] md:z-20 md:max-w-[200px] lg:bottom-[12%] lg:left-[calc(50%+13.5rem)] lg:max-w-[265px]',
  tracking:
    'md:absolute md:top-[14%] md:right-[calc(50%+9rem)] md:z-20 md:max-w-[200px] lg:top-[20%] lg:right-[calc(50%+13.5rem)] lg:max-w-[275px]',
  trust:
    'md:absolute md:bottom-[6%] md:right-[calc(50%+9rem)] md:z-20 md:max-w-[200px] lg:bottom-[10%] lg:right-[calc(50%+13.5rem)] lg:max-w-[295px]',
}

export const whyTrendFeatureFloat: Record<string, string> = {
  style: 'animate-float',
  shopping: 'animate-float-down-slow [animation-delay:1.4s]',
  tracking: 'animate-float [animation-delay:0.7s]',
  trust: 'animate-float-down-slow [animation-delay:2.1s]',
}

export const whyTrendImageBadges = ['season', 'picks', 'products'] as const
