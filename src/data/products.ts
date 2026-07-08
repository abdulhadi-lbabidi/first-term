import type { Product } from '../types'

export const newArrivals: Product[] = [
  {
    id: 'dress',
    sku: 'TRD-1001',
    image: '/images/product-1.jpg',
    fallback: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)',
    colors: ['#1e1033', '#7c3aed', '#f5f5f5', '#c084fc'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'new',
  },
  {
    id: 'jacket',
    sku: 'TRD-1002',
    image: '/images/product-2.jpg',
    fallback: 'linear-gradient(135deg, #4c1d95 0%, #9333ea 100%)',
    colors: ['#18181b', '#6b21a8', '#e9d5ff'],
    sizes: ['S', 'M', 'L'],
    badge: 'bestseller',
  },
  {
    id: 'blouse',
    sku: 'TRD-1003',
    image: '/images/product-3.jpg',
    fallback: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
    colors: ['#ffffff', '#d8b4fe', '#9333ea'],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: 'new',
  },
  {
    id: 'pants',
    sku: 'TRD-1004',
    image: '/images/product-4.jpg',
    fallback: 'linear-gradient(135deg, #3b0764 0%, #7c3aed 100%)',
    colors: ['#27272a', '#52525b', '#a1a1aa'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
]
