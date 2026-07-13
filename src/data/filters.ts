export const FILTER_CATEGORY_IDS = [
  'all',
  'women',
  'men',
  'accessories',
  'shoesBags',
] as const

export type FilterCategoryId = (typeof FILTER_CATEGORY_IDS)[number]

export function isValidStoreCategory(value: string | null | undefined): value is FilterCategoryId {
  return FILTER_CATEGORY_IDS.includes(value as FilterCategoryId)
}

export const STORE_SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const

export const STORE_FILTER_SWATCHES = [
  { id: 'purple-deep', key: 'purple', value: '#1e1033' },
  { id: 'purple-dark', key: 'purple', value: '#581c87' },
  { id: 'purple', key: 'purple', value: '#7c3aed' },
  { id: 'purple-light', key: 'purple', value: '#a855f7' },
  { id: 'purple-pale', key: 'lavender', value: '#d8b4fe' },
  { id: 'pink-deep', key: 'pink', value: '#be185d' },
  { id: 'pink', key: 'pink', value: '#db2777' },
  { id: 'pink-bright', key: 'pink', value: '#d946ef' },
  { id: 'pink-light', key: 'pink', value: '#f0abfc' },
  { id: 'pink-pale', key: 'pink', value: '#fce7f3' },
  { id: 'white', key: 'white', value: '#ffffff' },
  { id: 'black', key: 'black', value: '#18181b' },
  { id: 'silver', key: 'silver', value: '#c0c0c0' },
] as const

export const STORE_PRICE_MIN = 100
export const STORE_PRICE_MAX = 10000
export const STORE_PRICE_STEP = 50

export interface StoreFilters {
  codeSearch: string
  size: string
  color: string
  customColor: string | null
  priceMin: number
  priceMax: number
  category: string
}

export const DEFAULT_STORE_FILTERS: StoreFilters = {
  codeSearch: '',
  size: '',
  color: 'all',
  customColor: null,
  priceMin: STORE_PRICE_MIN,
  priceMax: STORE_PRICE_MAX,
  category: 'all',
}
