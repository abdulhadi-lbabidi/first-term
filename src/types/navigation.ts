export type AppPage =
  | 'home'
  | 'about'
  | 'store'
  | 'product'
  | 'cart'
  | 'contact'
  | 'checkout'
  | 'orders'

export type NavigateOptions = {
  hash?: string
  productId?: number
}

export type NavigateFn = (page: AppPage, options?: string | NavigateOptions) => void

export interface PageProps {
  currentPage: AppPage
  onNavigate: NavigateFn
}

export interface ProductPageProps extends PageProps {
  productId?: number
}

export function parseNavigateOptions(options?: string | NavigateOptions): NavigateOptions {
  if (typeof options === 'string') return { hash: options }
  return options ?? {}
}
