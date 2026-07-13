import type { AppPage } from '../types/navigation'
import { isValidStoreCategory } from '../data/filters'

export const ABOUT_PATH = '/about'
export const STORE_PATH = '/store'
export const CART_PATH = '/cart'
export const CONTACT_PATH = '/contact'
export const CHECKOUT_PATH = '/checkout'
export const ORDERS_PATH = '/orders'
export const HOME_PATH = '/'

export interface AppLocation {
  page: AppPage
  productId?: number
  storeCategory?: string
  storeSearch?: string
}

function getStoreCategoryFromSearch(search: string): string | undefined {
  const category = new URLSearchParams(search).get('category')
  if (!category || category === 'all' || !isValidStoreCategory(category)) {
    return undefined
  }
  return category
}

function getStoreSearchFromSearch(search: string): string | undefined {
  const query = new URLSearchParams(search).get('search')?.trim()
  return query || undefined
}

export function getProductIdFromPath(pathname: string): number | undefined {
  const match = pathname.match(/^\/product\/(\d+)$/)
  if (!match) return undefined
  const id = Number(match[1])
  return Number.isFinite(id) ? id : undefined
}

export function getPageFromLocation(
  pathname = window.location.pathname,
  search = window.location.search,
): AppLocation {
  if (pathname === ABOUT_PATH) return { page: 'about' }
  if (pathname === STORE_PATH) {
    return {
      page: 'store',
      storeCategory: getStoreCategoryFromSearch(search),
      storeSearch: getStoreSearchFromSearch(search),
    }
  }
  if (pathname === CART_PATH) return { page: 'cart' }
  if (pathname === CONTACT_PATH) return { page: 'contact' }
  if (pathname === CHECKOUT_PATH) return { page: 'checkout' }
  if (pathname === ORDERS_PATH) return { page: 'orders' }

  const productId = getProductIdFromPath(pathname)
  if (productId !== undefined) return { page: 'product', productId }

  return { page: 'home' }
}

type StoreUrlOptions = {
  hash?: string
  productId?: number
  storeCategory?: string
  storeSearch?: string
}

export function buildAppUrl(page: AppPage, options?: StoreUrlOptions): string {
  if (page === 'about') return ABOUT_PATH
  if (page === 'store') {
    const params = new URLSearchParams()
    if (options?.storeCategory && options.storeCategory !== 'all') {
      params.set('category', options.storeCategory)
    }
    if (options?.storeSearch?.trim()) {
      params.set('search', options.storeSearch.trim())
    }
    const query = params.toString()
    return query ? `${STORE_PATH}?${query}` : STORE_PATH
  }
  if (page === 'cart') return CART_PATH
  if (page === 'contact') return CONTACT_PATH
  if (page === 'checkout') return CHECKOUT_PATH
  if (page === 'orders') return ORDERS_PATH
  if (page === 'product' && options?.productId !== undefined) {
    return `/product/${options.productId}`
  }
  return options?.hash ? `${HOME_PATH}${options.hash}` : HOME_PATH
}
