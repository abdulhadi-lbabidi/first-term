import type { StoreFilters } from '../data/filters'
import type { Product } from '../types/product'

const CUSTOM_COLOR_THRESHOLD = 85

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function colorDistance(hex1: string, hex2: string) {
  const a = hexToRgb(hex1)
  const b = hexToRgb(hex2)
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b)
}

function matchesColor(
  product: Product,
  colorFilter: string,
  customColor: string | null,
) {
  if (colorFilter === 'all') return true
  if (colorFilter === 'custom' && customColor) {
    return product.colors.some(
      (color) =>
        colorDistance(color.value.toLowerCase(), customColor.toLowerCase()) <=
        CUSTOM_COLOR_THRESHOLD,
    )
  }
  return product.colors.some((color) => color.key === colorFilter)
}

function matchesPrice(price: number, priceMin: number, priceMax: number) {
  return price >= priceMin && price <= priceMax
}

export function filterProducts(products: Product[], filters: StoreFilters): Product[] {
  const codeQuery = filters.codeSearch.trim().toLowerCase()

  return products.filter((product) => {
    if (codeQuery && !product.code.toLowerCase().includes(codeQuery)) return false
    if (filters.size && !product.sizes.includes(filters.size)) return false
    if (!matchesColor(product, filters.color, filters.customColor)) return false
    if (filters.category !== 'all' && product.categoryKey !== filters.category) {
      return false
    }
    if (!matchesPrice(product.price, filters.priceMin, filters.priceMax)) return false
    return true
  })
}

export function getRelatedProducts(
  products: Product[],
  product: Product,
  limit = 3,
): Product[] {
  return products
    .filter(
      (item) => item.categoryKey === product.categoryKey && item.id !== product.id,
    )
    .slice(0, limit)
}
