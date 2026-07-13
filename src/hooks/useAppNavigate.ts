import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { AppPage, NavigateFn, NavigateOptions } from '../types/navigation'
import { parseNavigateOptions } from '../types/navigation'
import {
  ABOUT_PATH,
  buildAppUrl,
  CART_PATH,
  CHECKOUT_PATH,
  CONTACT_PATH,
  getProductIdFromPath,
  ORDERS_PATH,
  STORE_PATH,
} from '../utils/routing'

export function useAppNavigate(): NavigateFn {
  const navigate = useNavigate()

  return useCallback(
    (target: AppPage, options?: string | NavigateOptions) => {
      const parsed = parseNavigateOptions(options)
      const nextUrl = buildAppUrl(target, parsed)

      navigate(nextUrl)

      if (!parsed.hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [navigate],
  )
}

export function useCurrentPage(): AppPage {
  const { pathname } = useLocation()

  if (pathname === ABOUT_PATH) return 'about'
  if (pathname === STORE_PATH) return 'store'
  if (pathname === CART_PATH) return 'cart'
  if (pathname === CONTACT_PATH) return 'contact'
  if (pathname === CHECKOUT_PATH) return 'checkout'
  if (pathname === ORDERS_PATH) return 'orders'
  if (getProductIdFromPath(pathname) !== undefined) return 'product'
  return 'home'
}
