export type { AddToCartPayload, CartItem } from './cart'
export type { Product, ProductColor } from './product'

export interface HeroSlide {
  id: string
  image: string
  fallback: string
}

export interface Category {
  id: string
  itemCount: number
  image: string
  fallback: string
}

export interface ShowcaseProduct {
  id: string
  sku: string
  images: string[]
  fallback: string
  colors: string[]
  sizes: string[]
  badge?: 'new' | 'bestseller'
}

export interface WhyTrendItem {
  id: string
  number: string
  rotation: string
}

export interface WhyTrendStat {
  id: string
  target: number
  suffix?: string
  format?: 'ratio'
  ratioSuffix?: string
}
