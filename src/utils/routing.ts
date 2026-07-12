import type { AppPage } from '../types/navigation'

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
}

export function getProductIdFromPath(pathname: string): number | undefined {
  const match = pathname.match(/^\/product\/(\d+)$/)
  if (!match) return undefined
  const id = Number(match[1])
  return Number.isFinite(id) ? id : undefined
}

export function getPageFromLocation(): AppLocation {
  const pathname = window.location.pathname

  if (pathname === ABOUT_PATH) return { page: 'about' }
  if (pathname === STORE_PATH) return { page: 'store' }
  if (pathname === CART_PATH) return { page: 'cart' }
  if (pathname === CONTACT_PATH) return { page: 'contact' }
  if (pathname === CHECKOUT_PATH) return { page: 'checkout' }
  if (pathname === ORDERS_PATH) return { page: 'orders' }

  const productId = getProductIdFromPath(pathname)
  if (productId !== undefined) return { page: 'product', productId }

  return { page: 'home' }
}

export function buildAppUrl(
  page: AppPage,
  options?: { hash?: string; productId?: number },
): string {
  if (page === 'about') return ABOUT_PATH
  if (page === 'store') return STORE_PATH
  if (page === 'cart') return CART_PATH
  if (page === 'contact') return CONTACT_PATH
  if (page === 'checkout') return CHECKOUT_PATH
  if (page === 'orders') return ORDERS_PATH
  if (page === 'product' && options?.productId !== undefined) {
    return `/product/${options.productId}`
  }
  return options?.hash ? `${HOME_PATH}${options.hash}` : HOME_PATH
}

export function syncHistory(
  page: AppPage,
  options?: { hash?: string; productId?: number },
) {
  const nextUrl = buildAppUrl(page, options)
  const currentUrl = `${window.location.pathname}${window.location.hash}`

  if (currentUrl !== nextUrl) {
    window.history.pushState(
      { page, hash: options?.hash ?? null, productId: options?.productId ?? null },
      '',
      nextUrl,
    )
  }
}
