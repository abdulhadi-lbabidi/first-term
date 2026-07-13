import type { TFunction } from 'i18next'
import type { Product } from '../types/product'
import type { ProductColor as ApiProductColor } from '../types/product'
import type { ProductColor as CartColor } from '../types/cart'
import type { ShowcaseProduct } from '../types'

export const DEFAULT_PRODUCT_FALLBACK =
  'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)'

export function formatProductPrice(
  price: number,
  locale: string,
  currency: string,
): string {
  return `${price.toLocaleString(locale)} ${currency}`
}

export function getColorLabel(t: TFunction, colorKey: string) {
  return t(`store.colors.${colorKey}`, { defaultValue: colorKey })
}

export function getProductDisplay(
  product: Product,
  t: TFunction,
  locale: string,
  currency: string,
) {
  return {
    name: t(`store.products.${product.id}.name`),
    price: formatProductPrice(product.price, locale, currency),
    oldPrice: product.oldPrice
      ? formatProductPrice(product.oldPrice, locale, currency)
      : undefined,
    description: t(`store.products.${product.id}.description`),
  }
}

export function toCartColor(t: TFunction, color: ApiProductColor): CartColor {
  return {
    name: getColorLabel(t, color.key),
    value: color.value,
  }
}

export function mapProductToShowcase(product: Product): ShowcaseProduct {
  return {
    id: String(product.id),
    sku: product.code,
    images: product.images,
    fallback: DEFAULT_PRODUCT_FALLBACK,
    colors: product.colors.map((color) => color.value),
    sizes: product.sizes,
  }
}
