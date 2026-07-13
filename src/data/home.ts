import type { Category, HeroSlide } from '../types'

export type NavLink =
  | { key: 'home'; href: string; page?: never }
  | {
      key: 'about' | 'store' | 'contact' | 'orders'
      page: 'about' | 'store' | 'contact' | 'orders'
      href?: never
    }

export const navLinks: NavLink[] = [
  { key: 'home', href: '#home' },
  { key: 'store', page: 'store' },
  { key: 'about', page: 'about' },
  { key: 'orders', page: 'orders' },
  { key: 'contact', page: 'contact' },
]

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    image: '/images/fashion-1.jpg',
    fallback: 'linear-gradient(135deg, #2e1065 0%, #581c87 50%, #7c3aed 100%)',
  },
  {
    id: 'slide-2',
    image: '/images/fashion-2.jpg',
    fallback: 'linear-gradient(135deg, #1e1033 0%, #4c1d95 50%, #9333ea 100%)',
  },
  {
    id: 'slide-3',
    image: '/images/fashion-3.jpg',
    fallback: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #a855f7 100%)',
  },
  {
    id: 'slide-4',
    image: '/images/fashion-4.jpg',
    fallback: 'linear-gradient(135deg, #18181b 0%, #581c87 50%, #c084fc 100%)',
  },
  {
    id: 'slide-5',
    image: '/images/fashion-5.jpg',
    fallback: 'linear-gradient(135deg, #0f0a1a 0%, #3b0764 50%, #7c3aed 100%)',
  },
]

export const SLIDE_INTERVAL = 4000

/** Maps hero sidebar typing words (by index) to a store category when one exists. */
export const HERO_TYPING_STORE_CATEGORIES: (string | undefined)[] = [
  undefined, // Dresses
  undefined, // Jackets
  undefined, // Shirts
  undefined, // Pants
  'shoesBags', // Shoes
  'accessories', // Accessories
  'men', // Men's Wear
  'women', // Women's Wear
]

export const categories: Category[] = [
  {
    id: 'women',
    itemCount: 120,
    image: '/images/category-women.jpg',
    fallback: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c084fc 100%)',
  },
  {
    id: 'men',
    itemCount: 85,
    image: '/images/category-men.jpg',
    fallback: 'linear-gradient(135deg, #1e1033 0%, #581c87 50%, #9333ea 100%)',
  },
  {
    id: 'accessories',
    itemCount: 64,
    image: '/images/category-accessories.jpg',
    fallback: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #a855f7 100%)',
  },
  {
    id: 'shoesBags',
    itemCount: 50,
    image: '/images/category-shoes-bags.jpg',
    fallback: 'linear-gradient(135deg, #18181b 0%, #4c1d95 50%, #7c3aed 100%)',
  },
]
